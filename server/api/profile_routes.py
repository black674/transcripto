from fastapi import Depends, HTTPException

from models import UserProfile
from auth import get_account_details
from database import (
    create_user_profile, get_user_profile
)

from app import app, get_current_user

# ... existing code ...
@app.get("/profile", response_model=UserProfile)
async def get_profile(user_id: str = Depends(get_current_user)):
    profile = get_user_profile(user_id)
    
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")
    
    return profile


@app.get("/account")
async def get_account(user_id: str = Depends(get_current_user)):
    print("=== Account Endpoint Debug ===")
    print(f"1. Endpoint called with user_id: {user_id}")
    
    try:
        print("2. Calling get_account_details...")
        account = get_account_details(user_id)
        
        print(f"3. get_account_details returned: {bool(account)}")
        
        if not account:
            print("4. No account found - raising 404")
            raise HTTPException(
                status_code=404, 
                detail={
                    "message": "User account not found",
                    "user_id": user_id
                }
            )
        
        print("5. Successfully returning account details")
        return account
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print("=== Unexpected Error ===")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail={
                "message": f"Error getting account: {str(e)}",
                "user_id": user_id
            }
        )

@app.post("/api/create-profile")
async def create_profile(user_id: str = Depends(get_current_user)):
    # Get user account details
    account = get_account_details(user_id)
    
    if not account:
        raise HTTPException(status_code=404, detail="User account not found")
    
    # Check if email is verified
    if not account["email_verified"]:
        raise HTTPException(status_code=403, detail="Email not verified")
    
    # Check if user profile already exists
    user_profile = get_user_profile(user_id)
    
    if user_profile:
        return {
            "message": "Profile already exists",
            "profile": user_profile,
            "status": "existing"
        }
    
    # Create new profile using user ID and email from the account
    email = account["user"].email
    response = create_user_profile(user_id, email)
    
    if not response or not response.data:
        raise HTTPException(status_code=400, detail="Failed to create user profile")
    
    return {
        "message": "User profile created successfully",
        "profile": response.data[0] if response.data else None,
        "status": "created"
    } 