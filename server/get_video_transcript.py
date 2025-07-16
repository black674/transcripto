import requests
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from typing import List, Dict, Any
import os
import re  # Added for duration parsing

API_KEY = os.getenv("YOUTUBE_API_KEY")

CATEGORY_MAP = {
    "1": "Film & Animation",
    "2": "Autos & Vehicles",
    "10": "Music",
    "15": "Pets & Animals",
    "17": "Sports",
    "18": "Short Movies",
    "19": "Travel & Events",
    "20": "Gaming",
    "21": "Videoblogging",
    "22": "People & Blogs",
    "23": "Comedy",
    "24": "Entertainment",
    "25": "News & Politics",
    "26": "Howto & Style",
    "27": "Education",
    "28": "Science & Technology",
    "29": "Nonprofits & Activism",
    "30": "Movies",
    "31": "Anime/Animation",
    "32": "Action/Adventure",
    "33": "Classics",
    "34": "Comedy",
    "35": "Documentary",
    "36": "Drama",
    "37": "Family",
    "38": "Foreign",
    "39": "Horror",
    "40": "Sci-Fi/Fantasy",
    "41": "Thriller",
    "42": "Shorts",
    "43": "Shows",
    "44": "Trailers"
}

def get_metadata(video_id: str) -> Dict[str, Any]:
    url = (
        f"https://www.googleapis.com/youtube/v3/videos"
        f"?part=snippet,contentDetails,statistics,player"
        f"&id={video_id}&key={API_KEY}"
    )
    response = requests.get(url)
    data = response.json()

    if data["items"]:
        item = data["items"][0]
        snippet = item["snippet"]
        content_details = item["contentDetails"]
        statistics = item["statistics"]

        category_id = snippet.get("categoryId", "")
        category_name = CATEGORY_MAP.get(category_id, "Unknown")

        microformat = {
            "playerMicroformatRenderer": {
                "thumbnail": {
                    "thumbnails": [
                        {
                            "url": snippet["thumbnails"].get("maxres", snippet["thumbnails"].get("high", snippet["thumbnails"]["default"]))["url"].replace(" ", ""),
                            "width": snippet["thumbnails"].get("maxres", snippet["thumbnails"].get("high", snippet["thumbnails"]["default"]))["width"],
                            "height": snippet["thumbnails"].get("maxres", snippet["thumbnails"].get("high", snippet["thumbnails"]["default"]))["height"],
                        }
                    ]
                },
                "embed": {
                    "iframeUrl": f"https://www.youtube.com/embed/{video_id}",
                    "width": 1280,
                    "height": 720
                },
                "title": {
                    "simpleText": snippet["title"]
                },
                "description": {
                    "simpleText": snippet["description"]
                },
                # Robustly parse ISO8601 duration to seconds (handles missing components like seconds)
                "lengthSeconds": str(
                    (
                        lambda d: (
                            lambda m: (int(m.group(1) or 0) * 3600) + (int(m.group(2) or 0) * 60) + int(m.group(3) or 0)
                        )(re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", d) or re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?", d) or re.match(r"PT(?:(\d+)H)?", d))
                    )(content_details["duration"])
                ),
                "ownerProfileUrl": f"http://www.youtube.com/@{snippet['channelTitle'].replace(' ', '')}",
                "videoId": video_id,
                "channelId": snippet["channelId"],
                "isFamilySafe": True,
                "isUnlisted": False,
                "hasYpcMetadata": False,
                "viewCount": statistics.get("viewCount", "0"),
                "category": category_name,
                "publishDate": snippet["publishedAt"],
                "ownerChannelName": snippet["channelTitle"],
                "uploadDate": snippet["publishedAt"],
                "isShortsEligible": False,
                "likeCount": statistics.get("likeCount", "0")
            }
        }

        result = {
            "id": video_id,
            "title": snippet["title"],
            "microformat": microformat
        }
        return result
    else:
        return {"error": "Video not found"}

def get_transcripts(video_id: str) -> List[Dict[str, Any]]:
    tracks = []
    try:
        transcripts = YouTubeTranscriptApi.list_transcripts(video_id)
        for transcript in transcripts:
            lang_name = transcript.language
            try:
                data = transcript.fetch()
                transcript_list = []
                for item in data:
                    transcript_list.append({
                        "text": item.text.replace('\n', ' '),
                        "start": item.start,
                        "duration": round(item.duration, 3),
                    })
                tracks.append({
                    "language": lang_name,
                    "transcript": transcript_list
                })
            except Exception:
                continue  # Skip transcripts that fail to fetch
    except (TranscriptsDisabled, NoTranscriptFound):
        tracks.append({"error": "No captions available for this video."})
    except Exception as e:
        error_msg = str(e)
        if "no element found: line 1, column 0" in error_msg:
            error_msg = "No captions available or YouTube returned an empty response."
        tracks.append({"error": error_msg})
    if not tracks:
        tracks.append({"error": "No captions available for this video."})
    return tracks


def get_video_data(video_id: str) -> Dict[str, Any]:
    """Get complete video data including metadata and transcripts."""
    result = get_metadata(video_id)
    if "error" not in result:
        result["track"] = get_transcripts(video_id)
    return result

def process_video_transcripts(video_ids: List[str]) -> List[Dict[str, Any]]:
    """Process multiple video IDs and return their metadata with transcripts."""
    results = []
    
    for video_id in video_ids:
        video_data = get_video_data(video_id)
        results.append(video_data)
    
    return results