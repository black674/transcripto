from fastapi import Depends, HTTPException, Query
import os
import requests
from pytube import Channel

from app import app, get_current_user

# ... existing code ...
@app.get("/channel")
async def get_channel_route(username: str = Query(...), user_id: str = Depends(get_current_user)):
    try:
        # Get YouTube API key from environment variables
        api_key = os.getenv("YOUTUBE_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="YouTube API key not configured")
            
        # Try to get channel ID using pytube - handle different formats
        channel_id = None
        
        try:
            # First try with @ format which is most common
            channel = Channel(f'https://www.youtube.com/@{username}')
            channel_id = channel.channel_id
        except Exception:
            # If that fails, try to get the channel ID from the YouTube API
            search_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q={username}&key={api_key}"
            search_response = requests.get(search_url)
            
            if search_response.status_code != 200:
                raise HTTPException(status_code=search_response.status_code, 
                                   detail="Error searching for channel from YouTube API")
            
            search_data = search_response.json()
            
            # Check if we found any channels
            if not search_data.get("items"):
                raise HTTPException(status_code=404, 
                                   detail=f"No channel found with username: {username}")
            
            # Get the channel ID from the first result
            channel_id = search_data["items"][0]["id"]["channelId"]
            
            # Now that we have the channel ID, try to use pytube again
            try:
                channel = Channel(f'https://www.youtube.com/channel/{channel_id}')
            except Exception:
                # If pytube still fails, continue with just the channel ID
                pass
        
        # Make request to YouTube Data API
        url = f"https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id={channel_id}&key={api_key}"
        response = requests.get(url)
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Error fetching channel data from YouTube API")
        
        channel_data = response.json()
        
        return channel_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching channel data: {str(e)}") 