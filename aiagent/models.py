"""
Data models for the CeloSoul Dating AI Agent
"""
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime
from enum import Enum

class PersonalityType(str, Enum):
    """Personality types for matching"""
    EXTROVERT = "extrovert"
    INTROVERT = "introvert"
    AMBIVERT = "ambivert"
    ANALYTICAL = "analytical"
    CREATIVE = "creative"
    ADVENTUROUS = "adventurous"
    CONSERVATIVE = "conservative"

class MusicGenre(str, Enum):
    """Music genres for preference matching"""
    POP = "pop"
    ROCK = "rock"
    HIP_HOP = "hip_hop"
    ELECTRONIC = "electronic"
    JAZZ = "jazz"
    CLASSICAL = "classical"
    COUNTRY = "country"
    R_AND_B = "r_and_b"
    ALTERNATIVE = "alternative"
    INDIE = "indie"

class BehaviorSignal(str, Enum):
    """Behavior signals for compatibility analysis"""
    RESPONSIVE = "responsive"
    PLAYFUL = "playful"
    INTELLECTUAL = "intellectual"
    EMOTIONAL = "emotional"
    DIRECT = "direct"
    SUBTLE = "subtle"
    HUMOROUS = "humorous"
    SERIOUS = "serious"

class UserPreferences(BaseModel):
    """User preferences for matching"""
    personality_types: List[PersonalityType] = Field(default_factory=list)
    music_genres: List[MusicGenre] = Field(default_factory=list)
    hobbies: List[str] = Field(default_factory=list)
    behavior_signals: List[BehaviorSignal] = Field(default_factory=list)
    age_range: Optional[tuple] = None
    location_preferences: List[str] = Field(default_factory=list)
    lifestyle_preferences: List[str] = Field(default_factory=list)
    deal_breakers: List[str] = Field(default_factory=list)
    must_haves: List[str] = Field(default_factory=list)

class UserProfile(BaseModel):
    """User profile information"""
    user_id: str
    name: str
    age: int
    location: str
    bio: str
    preferences: UserPreferences
    personality_traits: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    photos: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.now)

class PotentialMatch(BaseModel):
    """Potential match profile"""
    user_id: str
    name: str
    age: int
    location: str
    bio: str
    photos: List[str] = Field(default_factory=list)
    compatibility_score: float = Field(ge=0.0, le=1.0)
    match_reasons: List[str] = Field(default_factory=list)
    conversation_starters: List[str] = Field(default_factory=list)

class ChatMessage(BaseModel):
    """Chat message structure"""
    message_id: str
    sender_id: str
    receiver_id: str
    content: str
    timestamp: datetime = Field(default_factory=datetime.now)
    message_type: str = "text"  # text, emoji, image, etc.
    is_ai_generated: bool = False

class ConversationContext(BaseModel):
    """Conversation context for AI agent"""
    conversation_id: str
    participants: List[str]
    messages: List[ChatMessage] = Field(default_factory=list)
    match_profile: Optional[PotentialMatch] = None
    user_preferences: Optional[UserPreferences] = None
    conversation_tone: str = "casual"  # casual, flirty, serious, playful
    topics_discussed: List[str] = Field(default_factory=list)
    last_activity: datetime = Field(default_factory=datetime.now)

class FlirtingStyle(BaseModel):
    """Flirting style preferences"""
    intensity: str = "moderate"  # subtle, moderate, bold
    humor_level: str = "medium"  # low, medium, high
    directness: str = "balanced"  # subtle, balanced, direct
    emoji_usage: str = "moderate"  # minimal, moderate, frequent
    topics: List[str] = Field(default_factory=list)

class MatchAnalysis(BaseModel):
    """Detailed match analysis"""
    compatibility_score: float = Field(ge=0.0, le=1.0)
    shared_interests: List[str] = Field(default_factory=list)
    personality_compatibility: float = Field(ge=0.0, le=1.0)
    lifestyle_compatibility: float = Field(ge=0.0, le=1.0)
    communication_style_match: float = Field(ge=0.0, le=1.0)
    potential_issues: List[str] = Field(default_factory=list)
    conversation_suggestions: List[str] = Field(default_factory=list)
    recommended_approach: str
