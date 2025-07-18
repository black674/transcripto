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
        
        # Try to get current session user instead of admin API
        try:
            print("2. Attempting to get user from session...")
            session = supabase.auth.get_session()
            if not session:
                print("3. No session found")
                return None
                
            user = session.user
            print("4. Successfully got user from session")
            
            # Verify the user ID matches
            if user.id != user_id:
                print("5. User ID mismatch")
                return None
                
            return {
                "user": user,
                "email_verified": user.email_confirmed_at is not None
            }
            
        except Exception as session_error:
            print(f"Session error: {str(session_error)}")
            
            # Fallback to try getting user metadata from the database
            try:
                print("6. Attempting fallback to database query...")
                response = supabase.table("users").select("*").eq("id", user_id).single().execute()
                if response.data:
                    print("7. Found user in database")
                    return {
                        "user": response.data,
                        "email_verified": True  # Assuming if in DB, email is verified
                    }
                else:
                    print("7. User not found in database")
                    return None
            except Exception as db_error:
                print(f"Database error: {str(db_error)}")
                return None
                
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