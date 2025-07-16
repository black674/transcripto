from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class UserSignup(BaseModel):
    email: str
    password: str

class UserSignin(BaseModel):
    email: str
    password: str

class SubscriptionUpdate(BaseModel):
    plan: str = Field(..., description="Subscription plan: 'free' or 'pro'")

class TranscriptData(BaseModel):
    transcript_text: str
    model_used: str
    duration: int

class UserProfile(BaseModel):
    id: str
    email: str
    subscription_plan: str
    transcript_count: int
    transcript_limit: int
    is_trial: bool
    reset_date: datetime
    subscription_start_date: Optional[datetime] = None
    subscription_end_date: Optional[datetime] = None
    
class TranscriptHistory(BaseModel):
    id: str
    user_id: str
    data: Dict[str, Any]
    created_at: datetime