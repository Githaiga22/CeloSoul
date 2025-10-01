"""
Example usage of the CeloSoul Dating AI Agent
"""
import asyncio
from typing import Dict, Any

from models import UserProfile, UserPreferences, PotentialMatch, FlirtingStyle
from dating_agent import DatingAgent
from preference_manager import PreferenceManager
from matching_engine import MatchingEngine
from conversation_manager import ConversationManager
from flirting_engine import FlirtingEngine

def example_user_creation():
    """Example of creating a user profile"""
    print("=== Creating User Profile ===")
    
    preference_manager = PreferenceManager()
    
    # Create user preferences
    preferences = preference_manager.create_user_preferences(
        personality_types=["extrovert", "creative"],
        music_genres=["pop", "rock", "electronic"],
        hobbies=["photography", "travel", "cooking"],
        behavior_signals=["playful", "humorous", "responsive"],
        age_range=(25, 35),
        lifestyle_preferences=["fitness", "travel"],
        deal_breakers=["smoking", "not interested in travel"],
        must_haves=["sense of humor", "adventurous"]
    )
    
    # Create user profile
    user_profile = UserProfile(
        user_id="user_123",
        name="Alex",
        age=28,
        location="San Francisco",
        bio="Adventure seeker who loves capturing moments through photography and exploring new cuisines.",
        preferences=preferences,
        interests=["photography", "travel", "cooking", "music"],
        photos=["photo1.jpg", "photo2.jpg"]
    )
    
    print(f"Created user: {user_profile.name}")
    print(f"Preferences: {len(preferences.hobbies)} hobbies, {len(preferences.music_genres)} music genres")
    return user_profile

def example_matching():
    """Example of matching users"""
    print("\n=== Matching Users ===")
    
    # Create user profile
    user_profile = example_user_creation()
    
    # Create potential matches
    potential_matches = [
        {
            "user_id": "match_1",
            "name": "Jordan",
            "age": 26,
            "location": "San Francisco",
            "bio": "Photographer and travel enthusiast who loves trying new restaurants.",
            "music_genres": ["pop", "indie"],
            "hobbies": ["photography", "travel", "food"],
            "personality_types": ["creative", "adventurous"],
            "behavior_signals": ["playful", "humorous"],
            "lifestyle_preferences": ["travel", "fitness"],
            "photos": ["jordan1.jpg"]
        },
        {
            "user_id": "match_2", 
            "name": "Taylor",
            "age": 30,
            "location": "Oakland",
            "bio": "Software engineer who enjoys rock concerts and weekend hiking trips.",
            "music_genres": ["rock", "alternative"],
            "hobbies": ["hiking", "concerts"],
            "personality_types": ["analytical", "introvert"],
            "behavior_signals": ["direct", "intellectual"],
            "lifestyle_preferences": ["fitness"],
            "photos": ["taylor1.jpg"]
        }
    ]
    
    # Analyze matches
    matching_engine = MatchingEngine()
    best_matches = matching_engine.find_best_matches(user_profile, potential_matches, limit=5)
    
    print(f"Found {len(best_matches)} compatible matches:")
    for match in best_matches:
        print(f"- {match.name}: {match.compatibility_score:.2f} compatibility")
        print(f"  Reasons: {', '.join(match.match_reasons[:2])}")
    
    return best_matches[0] if best_matches else None

def example_conversation():
    """Example of AI-powered conversation"""
    print("\n=== AI Conversation Example ===")
    
    # Get a match from the previous example
    match = example_matching()
    if not match:
        print("No matches found for conversation example")
        return
    
    # Create user profile
    user_profile = example_user_creation()
    
    # Create flirting style
    flirting_style = FlirtingStyle(
        intensity="moderate",
        humor_level="high",
        directness="balanced",
        emoji_usage="moderate"
    )
    
    # Create conversation
    conversation_manager = ConversationManager()
    conversation_id = conversation_manager.create_conversation(
        user_profile.user_id,
        match,
        user_profile.preferences,
        flirting_style
    )
    
    print(f"Created conversation: {conversation_id}")
    
    # Initialize AI components
    dating_agent = DatingAgent()
    flirting_engine = FlirtingEngine()
    
    # Generate opening message
    opening_message = dating_agent.generate_conversation_starter(
        match, user_profile.preferences, flirting_style
    )
    
    print(f"\nAI Opening Message: {opening_message[0] if opening_message else 'Hello!'}")
    
    # Simulate conversation
    messages = [
        "Hi! I love your photography work. Where's your favorite place you've traveled to take photos?",
        "That sounds amazing! I've always wanted to visit Iceland. What kind of camera do you use?",
        "Wow, that's a great setup! Do you prefer landscape or street photography?"
    ]
    
    for i, message in enumerate(messages):
        print(f"\nUser: {message}")
        
        # Add user message to conversation
        conversation_manager.add_message(
            conversation_id,
            "match_user",
            user_profile.user_id,
            message,
            is_ai_generated=False
        )
        
        # Get conversation context
        context = conversation_manager.get_conversation_context(conversation_id)
        
        # Generate AI response
        ai_response = flirting_engine.generate_contextual_flirty_message(
            context, flirting_style, message
        )
        
        print(f"AI: {ai_response}")
        
        # Add AI response to conversation
        conversation_manager.add_message(
            conversation_id,
            "ai_agent",
            "match_user",
            ai_response,
            is_ai_generated=True
        )
    
    # Analyze conversation
    analysis = conversation_manager.analyze_conversation_flow(conversation_id)
    print(f"\nConversation Analysis:")
    print(f"- Engagement: {analysis['engagement']}")
    print(f"- Response Time: {analysis['response_time']}")
    print(f"- Topics Covered: {', '.join(analysis['topics_covered'])}")
    print(f"- Suggestions: {', '.join(analysis['suggestions'][:2])}")

def example_preference_analysis():
    """Example of analyzing user preferences"""
    print("\n=== Preference Analysis Example ===")
    
    preference_manager = PreferenceManager()
    
    # Example user messages
    user_messages = [
        "I love going to concerts and discovering new indie bands!",
        "Traveling solo has taught me so much about myself.",
        "Photography is my passion - I love capturing candid moments.",
        "I'm always up for trying new restaurants and cuisines."
    ]
    
    # Example profile data
    profile_data = {
        "bio": "Adventure seeker and creative soul who loves music, travel, and capturing life through photography.",
        "interests": ["photography", "music", "travel", "food"]
    }
    
    # Analyze behavior
    behavior_signals = preference_manager.analyze_user_behavior(user_messages, profile_data)
    
    print(f"Detected behavior signals: {[signal.value for signal in behavior_signals]}")
    
    # Extract preferences from profile
    extracted_prefs = preference_manager.extract_preferences_from_profile(profile_data)
    
    print(f"Extracted preferences:")
    for category, items in extracted_prefs.items():
        if items:
            print(f"- {category}: {', '.join(items[:3])}")

def example_flirting_styles():
    """Example of different flirting styles"""
    print("\n=== Flirting Styles Example ===")
    
    # Create a sample context
    match = PotentialMatch(
        user_id="demo_match",
        name="Sam",
        age=27,
        location="Los Angeles",
        bio="Music lover and coffee enthusiast who enjoys weekend adventures.",
        compatibility_score=0.85
    )
    
    user_preferences = UserPreferences(
        hobbies=["music", "coffee", "adventure"],
        music_genres=["indie", "pop"],
        behavior_signals=["playful", "humorous"]
    )
    
    context = ConversationContext(
        conversation_id="demo_conv",
        participants=["user", "match"],
        match_profile=match,
        user_preferences=user_preferences
    )
    
    flirting_engine = FlirtingEngine()
    
    # Test different flirting intensities
    styles = [
        ("subtle", "low"),
        ("moderate", "medium"), 
        ("bold", "high")
    ]
    
    print("Testing different flirting styles:")
    
    for intensity, humor in styles:
        style = FlirtingStyle(
            intensity=intensity,
            humor_level=humor,
            directness="balanced",
            emoji_usage="moderate"
        )
        
        message = flirting_engine.generate_contextual_flirty_message(
            context, style, "Hey! I noticed we both love indie music."
        )
        
        print(f"\n{intensity.title()} style: {message}")

if __name__ == "__main__":
    print("CeloSoul Dating AI Agent - Example Usage\n")
    
    try:
        # Run examples
        example_user_creation()
        example_matching()
        example_conversation()
        example_preference_analysis()
        example_flirting_styles()
        
        print("\n=== All Examples Completed Successfully! ===")
        print("\nTo run the API server:")
        print("python main.py")
        print("\nThen visit: http://localhost:8000/docs for API documentation")
        
    except Exception as e:
        print(f"Error running examples: {e}")
        print("Make sure you have set up your OpenAI API key in the .env file")
