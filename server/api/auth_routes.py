from fastapi import HTTPException, Body

from models import UserSignup, UserSignin
from auth import signup_user, signin_user, refresh_token
from database import create_user_profile, get_user_profile

from app import app


@app.post("/auth/signup")
async def signup(user_data: UserSignup):
    try:
        response = signup_user(user_data.email, user_data.password)
        
        if not response:
            raise HTTPException(status_code=400, detail="Failed to sign up")
        
        return {
            "message": "User signed up successfully. Please check your email for verification.",
            "user": response.user
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/auth/signin")
async def signin(user_data: UserSignin):
    try:
        response = signin_user(user_data.email, user_data.password)
        
        if not response:
            raise HTTPException(
                status_code=401, 
                detail="Invalid email or password. Please check your credentials and try again."
            )
        
        if response.user and response.user.email_confirmed_at is None:
            raise HTTPException(
                status_code=403, 
                detail="Email not verified. Please check your inbox and verify your email before signing in."
            )
        
        # Check if user profile exists, if not create one
        user_profile = get_user_profile(response.user.id)
        
        if not user_profile:
            create_user_profile(response.user.id, response.user.email)
        
        return {
            "message": "User signed in successfully",
            "user": response.user,
            "session": response.session,
            "email_verified": True
        }
    except Exception as e:
        if hasattr(e, 'status_code') and e.status_code:
            raise e
        else:
            raise HTTPException(
                status_code=500, 
                detail="Unable to sign in due to a server error. Please try again later."
            )

@app.post("/auth/refresh")
async def refresh(refresh_token_data: dict = Body(...)):
    try:
        refresh_token_str = refresh_token_data.get("refresh_token")
        if not refresh_token_str:
            raise HTTPException(
                status_code=400,
                detail="Refresh token is required"
            )
        
        response = refresh_token(refresh_token_str)
        
        if not response or not response.session:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired refresh token"
            )
        
        return {
            "message": "Token refreshed successfully",
            "session": response.session
        }
    except Exception as e:
        if hasattr(e, 'status_code') and e.status_code:
            raise e
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to refresh token"
            ) 