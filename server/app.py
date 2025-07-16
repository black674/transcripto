from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from dotenv import load_dotenv

from auth import verify_jwt_token


load_dotenv()

app = FastAPI(title="Transcript App Backend")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get authenticated user
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Extract token from Authorization header (Bearer token)
    try:
        token = authorization.split(" ")[1]
    except IndexError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    # Verify token
    token_data = verify_jwt_token(token)
    
    if not token_data["valid"]:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Check if email is verified
    if not token_data["email_verified"]:
        raise HTTPException(status_code=403, detail="Email not verified")
    
    return token_data["user_id"]

@app.get("/")
async def root():
    return {"message": "Transcript App Backend API"}

# Import all route modules to register API endpoints (must come after app and get_current_user are defined)
import api.auth_routes
import api.channel_routes
import api.playlist_routes
import api.profile_routes
import api.stripe_routes
import api.transcript_routes
import api.websocket_routes


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)