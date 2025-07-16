from fastapi import Depends, HTTPException, Query
from typing import List

from database import (
    get_user_profile,
    store_transcript, increment_transcript_count, check_transcript_limit,
    get_user_transcripts, get_transcript_by_video_id, get_user_transcripts_count
)
from get_video_transcript import process_video_transcripts

from app import app, get_current_user

# Route for handling transcript requests
@app.post("/transcript")
async def process_transcripts(video_ids: List[str], user_id: str = Depends(get_current_user)):
    if not video_ids:
        raise HTTPException(status_code=400, detail="No video IDs provided")
    
    # Check if user has reached their transcript limit
    # We only check for new videos that aren't already in history
    new_video_ids = []
    existing_videos_data = []
    
    # First, check which videos already exist in the transcript history
    for video_id in video_ids:
        existing_transcript = get_transcript_by_video_id(user_id, video_id)
        if existing_transcript:
            # Video already exists in history, add to results
            existing_videos_data.append(existing_transcript['data']['metadata'])
        else:
            # New video, add to list for processing
            new_video_ids.append(video_id)
    
    # Check if user has enough transcript quota for new videos
    if new_video_ids and not check_transcript_limit(user_id):
        raise HTTPException(
            status_code=403,
            detail="You have reached your monthly transcript limit. Please upgrade your subscription."
        )
    
    results = []
    # Add existing videos to results first
    results.extend(existing_videos_data)
    
    # Only process new videos if there are any
    if new_video_ids:
        # Get video data from the imported function for new videos only
        video_results = process_video_transcripts(new_video_ids)
        
        for video_data in video_results:
            video_id = video_data.get("id")
            
            if "error" not in video_data:
                # Store in database as individual entry
                transcript_data = {
                    "video_id": video_id,
                    "title": video_data["title"],
                    "metadata": video_data,
                    "model_used": "youtube_api",  # Or appropriate model identifier
                    "duration": int(video_data["microformat"]["playerMicroformatRenderer"]["lengthSeconds"])
                }
                
                response = store_transcript(user_id, transcript_data)
                
                if response and response.data:
                    # Increment transcript count only for new videos
                    increment_transcript_count(user_id)
                    results.append(video_data)
                else:
                    results.append({"id": video_id, "error": "Failed to store transcript"})
            else:
                results.append(video_data)  # Include the error message
    
    # Get updated profile for remaining transcript count
    profile = get_user_profile(user_id)
    
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")
    
    return {
        "message": "Transcripts processed successfully",
        "videos": results,
        "count": len(results),
        "remaining_transcripts": profile["transcript_limit"] - profile["transcript_count"]
    }

@app.get("/transcript")
async def get_transcripts_route(
    user_id: str = Depends(get_current_user),
    limit: int = Query(10, ge=1),
    offset: int = Query(0, ge=0), 
):
    transcripts = get_user_transcripts(user_id, limit, offset)
    total_count = get_user_transcripts_count(user_id)
    
    return {
        "transcripts": transcripts,
        "count": len(transcripts),
        "total_count": total_count,
        "total_pages": (total_count + limit - 1) // limit,
    }