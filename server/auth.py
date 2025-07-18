import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase_jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
supabase: Client = create_client(supabase_url, supabase_key)

def signup_user(email, password):
    """Sign up a new user with email and password"""
    try:
        users = supabase.auth.admin.list_users()
        for user in users:
            if user.email == email:
                raise Exception("Email already in use")

        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        return response
    except Exception as e:
        print(f"Error signing up user: {e}")
        raise Exception(e)

def signin_user(email, password):
    """Sign in a user with email and password"""
    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        return response
    except Exception as e:
        print(f"Error signing in user: {e}")
        return None

def verify_jwt_token(token):
    """Verify JWT token and extract user ID"""
    try:
        user = supabase.auth.get_user(token)
        
        if user and user.user:
            return {
                "valid": True,
                "user_id": user.user.id,
                "email_verified": user.user.email_confirmed_at is not None
            }
        else:
            return {
                "valid": False,
                "error": "Invalid user data in token"
            }
    except Exception as e:
        print(f"Error verifying JWT token: {e}")
        return {
            "valid": False,
            "error": str(e)
        }

def is_email_verified(user_id):
    """Check if user's email is verified"""
    try:
        user = supabase.auth.admin.get_user_by_id(user_id)
        return user.user.email_confirmed_at is not None
    except Exception as e:
        print(f"Error checking email verification: {e}")
        return False

def get_account_details(user_id):
    """Get user account details from Supabase Auth"""
    try:
        print("=== Get Account Details Debug ===")
        print(f"1. Starting request for user_id: {user_id}")
        
        # Log the current session state
        try:
            session = supabase.auth.get_session()
            print("2. Current session exists:", bool(session))
        except Exception as session_error:
            print("2. Error getting session:", str(session_error))
        
        # Try to get user details
        print("3. Attempting to get user details...")
        user = supabase.auth.admin.get_user_by_id(user_id)
        print("4. User details retrieved successfully")
        
        if not user or not user.user:
            print("5. No user data found")
            return None
        
        print("6. Successfully got user details")
        return {
            "user": user.user,
            "email_verified": user.user.email_confirmed_at is not None
        }
    except Exception as e:
        print("=== Error Details ===")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        import traceback
        print("Full traceback:")
        print(traceback.format_exc())
        print("=====================")
        return None

def refresh_token(refresh_token):
    """Refresh an access token using a refresh token"""
    try:
        response = supabase.auth.refresh_session(refresh_token)
        return response
    except Exception as e:
        print(f"Error refreshing token: {e}")
        return None