import os
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

def get_next_reset_date(from_date=None):
    """Calculate the next reset date (30 days from given date or now)"""
    base_date = from_date if from_date else datetime.now()
    return base_date + timedelta(days=30)

def create_user_profile(user_id, email):
    """Create a new user profile after email verification"""
    current_time = datetime.now()
    reset_date = get_next_reset_date(current_time)
    
    # Basic profile data that works with existing schema
    profile_data = {
        'id': user_id,
        'email': email,
        'subscription_plan': 'free',
        'transcript_count': 0,
        'transcript_limit': 30,
        'is_trial': True,
        'reset_date': reset_date.isoformat()
    }
    
    data = supabase.table('user_profiles').insert(profile_data).execute()
    
    return data

def update_subscription_plan(user_id, plan, is_expiration=False):
    """Update user subscription plan"""
    # First get current profile to check if this is an upgrade
    current_profile = get_user_profile(user_id)
    if not current_profile:
        return None
        
    # Set transcript limit based on plan
    transcript_limit = 30 if plan == 'free' else 1000  # Assuming 'pro' has 1000 limit
    
    current_time = datetime.now()
    # Basic update data
    update_data = {
        'subscription_plan': plan,
        'transcript_limit': transcript_limit,
        'is_trial': plan == 'free'
    }

    # Check if this is an upgrade
    if current_profile['subscription_plan'] == 'free' and plan != 'free':
        # Reset reset_date if upgrading from free plan
        update_data.update({
            'reset_date': get_next_reset_date(current_time).isoformat()
        })
    
    # Only try to update subscription dates if the columns exist
    if plan != 'free':
        update_data.update({
            'subscription_start_date': current_time.isoformat(),
            'subscription_end_date': (current_time + timedelta(days=30)).isoformat()
        })
    else:
        update_data.update({
        'subscription_start_date': None,
        'subscription_end_date': None
    })
    
    data = supabase.table('user_profiles').update(update_data).eq('id', user_id).execute()
    
    return data

def store_transcript(user_id, transcript_data):
    """Store transcript in the transcript_history table"""
    data = supabase.table('transcript_history').insert({
        'user_id': user_id,
        'data': transcript_data
    }).execute()
    
    return data

def increment_transcript_count(user_id):
    """Increment the transcript count for a user"""
    # First get the current profile
    profile = get_user_profile(user_id)
    if not profile:
        return None
        
    # Check if reset date has passed
    reset_date = datetime.fromisoformat(profile['reset_date']).replace(tzinfo=None)
    current_date = datetime.now()
    
    # If reset date has passed, reset the count and update the reset date
    if current_date >= reset_date:
        next_reset = get_next_reset_date()
        data = supabase.table('user_profiles').update({
            'transcript_count': 1,  # Set to 1 because we're adding a new transcript
            'reset_date': next_reset.isoformat()
        }).eq('id', user_id).execute()
    else:
        # Otherwise just increment the count
        data = supabase.table('user_profiles').update({
            'transcript_count': profile['transcript_count'] + 1
        }).eq('id', user_id).execute()
    return data

def check_transcript_limit(user_id):
    """Check if user has reached their transcript limit"""
    profile = get_user_profile(user_id)
    
    if not profile:
        return False
        
    # Check if reset date has passed
    reset_date = datetime.fromisoformat(profile['reset_date']).replace(tzinfo=None)
    current_date = datetime.now()
    
    if current_date >= reset_date:
        # If reset date has passed, user is under the limit
        return True
        
    # Check if user is under their limit
    return profile['transcript_count'] < profile['transcript_limit']

def get_user_transcripts_count(user_id):
    """Get the total count of user's transcript history"""
    response = supabase.table('transcript_history') \
        .select('id') \
        .eq('user_id', user_id) \
        .execute()
    return len(response.data)

def get_user_transcripts(user_id, limit, offset):
    """Get user's transcript history"""
    response = supabase.table('transcript_history') \
        .select('*') \
        .eq('user_id', user_id) \
        .order('created_at', desc=True) \
        .range(offset, offset + limit) \
        .execute()
    
    # Remove metadata from each record's data
    for record in response.data:
        if 'data' in record and 'metadata' in record['data']:
            del record['data']['metadata']
    
    return response.data

def get_transcript_by_video_id(user_id, video_id):
    """Get transcript by video ID for a specific user"""
    response = supabase.table('transcript_history') \
        .select('*') \
        .eq('user_id', user_id) \
        .filter('data->>video_id', 'eq', video_id) \
        .execute()
    
    # Return the first matching transcript or None
    if response.data and len(response.data) > 0:
        return response.data[0]
    return None

def get_user_profile(user_id):
    """Get user profile by user ID"""
    response = supabase.table('user_profiles').select('*').eq('id', user_id).execute()
    
    if response.data and len(response.data) > 0:
        profile = response.data[0]
    else:
        return None
        
    # Only check subscription expiration if the columns exist
    if profile.get('subscription_end_date'):
        end_date = datetime.fromisoformat(profile['subscription_end_date']).replace(tzinfo=None)
        if datetime.now() >= end_date and profile['subscription_plan'] != 'free':
            # Downgrade to free plan with quota reset
            update_subscription_plan(user_id, 'free', is_expiration=True)
            # Get the updated profile
            response = supabase.table('user_profiles').select('*').eq('id', user_id).execute()
            profile = response.data[0] if response.data else None
    return profile

    return None