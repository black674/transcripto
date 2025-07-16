from fastapi import Depends, HTTPException, Query
import os
import requests

from app import app, get_current_user

@app.get("/playlist")
async def get_playlist_route(playlist_id: str = Query(...), user_id: str = Depends(get_current_user)):
    try:
        # Get YouTube API key from environment variables
        api_key = os.getenv("YOUTUBE_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="YouTube API key not configured")
        
        # Make request to YouTube Data API to get playlist items
        url = f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId={playlist_id}&key={api_key}"
        response = requests.get(url)
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, 
                detail="Error fetching playlist data from YouTube API"
            )
        
        playlist_data = response.json()
        
        # Check if we found any items
        if not playlist_data.get("items"):
            raise HTTPException(
                status_code=404, 
                detail=f"No videos found in playlist with ID: {playlist_id}"
            )
        
        return playlist_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching playlist data: {str(e)}") 