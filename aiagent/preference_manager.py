"""
Preference Management System for User Matching
"""
from typing import List, Dict, Any, Optional
import json
from datetime import datetime

from models import (
    UserPreferences, UserProfile, PersonalityType, MusicGenre, 
    BehaviorSignal, FlirtingStyle
)

class PreferenceManager:
    """Manages user preferences and matching criteria"""
    
    def __init__(self):
        """Initialize the preference manager"""
        self.preference_weights = {
            "music_taste": 0.2,
            "hobbies": 0.25,
            "behavior_signals": 0.3,
            "personality": 0.15,
            "lifestyle": 0.1
        }
    
    def create_user_preferences(
        self,
        personality_types: List[str] = None,
        music_genres: List[str] = None,
        hobbies: List[str] = None,
        behavior_signals: List[str] = None,
        age_range: tuple = None,
        location_preferences: List[str] = None,
        lifestyle_preferences: List[str] = None,
        deal_breakers: List[str] = None,
        must_haves: List[str] = None
    ) -> UserPreferences:
        """Create user preferences from provided data"""
        
        # Convert string enums to proper enum types
        personality_enum = []
        if personality_types:
            for p in personality_types:
                try:
                    personality_enum.append(PersonalityType(p.lower()))
                except ValueError:
                    continue
        
        music_enum = []
        if music_genres:
            for m in music_genres:
                try:
                    music_enum.append(MusicGenre(m.lower().replace(" ", "_")))
                except ValueError:
                    continue
        
        behavior_enum = []
        if behavior_signals:
            for b in behavior_signals:
                try:
                    behavior_enum.append(BehaviorSignal(b.lower()))
                except ValueError:
                    continue
        
        return UserPreferences(
            personality_types=personality_enum,
            music_genres=music_enum,
            hobbies=hobbies or [],
            behavior_signals=behavior_enum,
            age_range=age_range,
            location_preferences=location_preferences or [],
            lifestyle_preferences=lifestyle_preferences or [],
            deal_breakers=deal_breakers or [],
            must_haves=must_haves or []
        )
    
    def analyze_user_behavior(
        self, 
        messages: List[str], 
        profile_data: Dict[str, Any]
    ) -> List[BehaviorSignal]:
        """Analyze user behavior from messages and profile to extract behavior signals"""
        
        behavior_signals = []
        
        # Analyze message patterns
        if messages:
            combined_text = " ".join(messages).lower()
            
            # Detect behavior signals from text patterns
            if any(word in combined_text for word in ["lol", "haha", "😂", "funny", "joke"]):
                behavior_signals.append(BehaviorSignal.HUMOROUS)
            
            if any(word in combined_text for word in ["why", "how", "what", "analyze", "think"]):
                behavior_signals.append(BehaviorSignal.INTELLECTUAL)
            
            if any(word in combined_text for word in ["feel", "emotion", "heart", "love"]):
                behavior_signals.append(BehaviorSignal.EMOTIONAL)
            
            if len(messages) > 5:  # User is responsive
                behavior_signals.append(BehaviorSignal.RESPONSIVE)
            
            # Check for directness
            direct_indicators = ["yes", "no", "definitely", "absolutely", "sure"]
            if any(word in combined_text for word in direct_indicators):
                behavior_signals.append(BehaviorSignal.DIRECT)
            else:
                behavior_signals.append(BehaviorSignal.SUBTLE)
        
        # Analyze profile data
        if profile_data:
            bio = profile_data.get("bio", "").lower()
            interests = profile_data.get("interests", [])
            
            if any(word in bio for word in ["adventure", "travel", "explore", "new"]):
                behavior_signals.append(BehaviorSignal.PLAYFUL)
            
            if any(word in bio for word in ["serious", "focused", "career", "goals"]):
                behavior_signals.append(BehaviorSignal.SERIOUS)
        
        return list(set(behavior_signals))  # Remove duplicates
    
    def extract_preferences_from_profile(
        self, 
        profile: Dict[str, Any]
    ) -> Dict[str, List[str]]:
        """Extract preferences from user profile data"""
        
        extracted = {
            "music_genres": [],
            "hobbies": [],
            "personality_types": [],
            "lifestyle_preferences": []
        }
        
        bio = profile.get("bio", "").lower()
        interests = profile.get("interests", [])
        photos = profile.get("photos", [])
        
        # Music genre detection
        music_keywords = {
            "pop": ["pop music", "taylor swift", "beyonce", "pop songs"],
            "rock": ["rock music", "guitar", "band", "concert", "rock"],
            "hip_hop": ["hip hop", "rap", "hip-hop", "rapper"],
            "electronic": ["edm", "electronic", "dance music", "techno", "house"],
            "jazz": ["jazz", "saxophone", "blues"],
            "classical": ["classical", "orchestra", "piano", "violin"],
            "country": ["country", "guitar", "nashville", "country music"],
            "r_and_b": ["r&b", "rnb", "soul", "r and b"],
            "alternative": ["alternative", "indie", "underground"],
            "indie": ["indie", "independent", "small venue", "local band"]
        }
        
        for genre, keywords in music_keywords.items():
            if any(keyword in bio for keyword in keywords):
                extracted["music_genres"].append(genre)
        
        # Hobby detection
        hobby_keywords = [
            "reading", "books", "writing", "photography", "cooking", "baking",
            "fitness", "gym", "running", "hiking", "travel", "traveling",
            "movies", "films", "netflix", "art", "painting", "drawing",
            "music", "singing", "playing", "instrument", "gaming", "games",
            "sports", "football", "basketball", "soccer", "tennis", "swimming",
            "dancing", "yoga", "meditation", "gardening", "pets", "animals"
        ]
        
        for hobby in hobby_keywords:
            if hobby in bio or hobby in interests:
                extracted["hobbies"].append(hobby)
        
        # Personality type detection
        personality_indicators = {
            "extrovert": ["outgoing", "social", "party", "friends", "crowd"],
            "introvert": ["quiet", "home", "alone", "peaceful", "solitude"],
            "analytical": ["logic", "analysis", "data", "science", "research"],
            "creative": ["creative", "art", "design", "imagination", "innovative"],
            "adventurous": ["adventure", "travel", "explore", "new", "experience"],
            "conservative": ["traditional", "classic", "stable", "consistent"]
        }
        
        for personality, indicators in personality_indicators.items():
            if any(indicator in bio for indicator in indicators):
                extracted["personality_types"].append(personality)
        
        # Lifestyle preferences
        lifestyle_keywords = [
            "vegan", "vegetarian", "organic", "healthy", "fitness",
            "night owl", "early bird", "workout", "meditation",
            "minimalist", "luxury", "budget", "travel", "homebody"
        ]
        
        for lifestyle in lifestyle_keywords:
            if lifestyle in bio:
                extracted["lifestyle_preferences"].append(lifestyle)
        
        return extracted
    
    def create_flirting_style_preferences(
        self,
        intensity: str = "moderate",
        humor_level: str = "medium",
        directness: str = "balanced",
        emoji_usage: str = "moderate",
        preferred_topics: List[str] = None
    ) -> FlirtingStyle:
        """Create flirting style preferences"""
        
        return FlirtingStyle(
            intensity=intensity,
            humor_level=humor_level,
            directness=directness,
            emoji_usage=emoji_usage,
            topics=preferred_topics or []
        )
    
    def update_preferences_from_interaction(
        self,
        preferences: UserPreferences,
        interaction_data: Dict[str, Any]
    ) -> UserPreferences:
        """Update preferences based on user interactions and feedback"""
        
        # This would typically involve machine learning or feedback analysis
        # For now, we'll implement basic preference updating
        
        if interaction_data.get("positive_feedback"):
            # If user liked certain types of matches, strengthen those preferences
            pass
        
        if interaction_data.get("negative_feedback"):
            # If user disliked certain types of matches, weaken those preferences
            pass
        
        return preferences
    
    def validate_preferences(self, preferences: UserPreferences) -> bool:
        """Validate that preferences are reasonable and complete"""
        
        # Check for minimum required preferences
        if not preferences.hobbies and not preferences.music_genres:
            return False
        
        # Check age range validity
        if preferences.age_range:
            min_age, max_age = preferences.age_range
            if min_age > max_age or min_age < 18 or max_age > 100:
                return False
        
        # Check for conflicting preferences
        if BehaviorSignal.DIRECT in preferences.behavior_signals and BehaviorSignal.SUBTLE in preferences.behavior_signals:
            return False
        
        return True
    
    def get_preference_summary(self, preferences: UserPreferences) -> Dict[str, Any]:
        """Get a summary of user preferences for display"""
        
        return {
            "personality_types": [p.value for p in preferences.personality_types],
            "music_genres": [m.value for m in preferences.music_genres],
            "hobbies": preferences.hobbies,
            "behavior_signals": [b.value for b in preferences.behavior_signals],
            "age_range": preferences.age_range,
            "location_preferences": preferences.location_preferences,
            "lifestyle_preferences": preferences.lifestyle_preferences,
            "deal_breakers": preferences.deal_breakers,
            "must_haves": preferences.must_haves,
            "total_preferences": len(preferences.hobbies) + len(preferences.music_genres) + len(preferences.personality_types)
        }
