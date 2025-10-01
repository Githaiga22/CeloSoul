"""
Test script to verify the CeloSoul Dating AI Agent setup
"""
import os
from dotenv import load_dotenv

def test_environment_setup():
    """Test if environment variables are properly configured"""
    print("🧪 Testing Environment Setup...")
    
    # Load environment variables
    load_dotenv()
    
    # Check OpenAI API key
    openai_key = os.getenv("OPENAI_API_KEY")
    if not openai_key or openai_key == "your_openai_api_key_here":
        print("❌ OpenAI API key not configured!")
        print("   Please edit the .env file and add your OpenAI API key")
        return False
    else:
        print("✅ OpenAI API key configured")
    
    # Check other important configs
    agent_name = os.getenv("AGENT_NAME", "CeloSoul Dating Assistant")
    model = os.getenv("DEFAULT_MODEL", "gpt-4")
    temperature = os.getenv("TEMPERATURE", "0.8")
    
    print(f"✅ Agent Name: {agent_name}")
    print(f"✅ Default Model: {model}")
    print(f"✅ Temperature: {temperature}")
    
    return True

def test_imports():
    """Test if all modules can be imported successfully"""
    print("\n🧪 Testing Module Imports...")
    
    try:
        from models import UserProfile, UserPreferences, PotentialMatch
        print("✅ Models imported successfully")
    except Exception as e:
        print(f"❌ Failed to import models: {e}")
        return False
    
    try:
        from config import Config
        print("✅ Config imported successfully")
    except Exception as e:
        print(f"❌ Failed to import config: {e}")
        return False
    
    try:
        from preference_manager import PreferenceManager
        print("✅ PreferenceManager imported successfully")
    except Exception as e:
        print(f"❌ Failed to import PreferenceManager: {e}")
        return False
    
    try:
        from matching_engine import MatchingEngine
        print("✅ MatchingEngine imported successfully")
    except Exception as e:
        print(f"❌ Failed to import MatchingEngine: {e}")
        return False
    
    try:
        from conversation_manager import ConversationManager
        print("✅ ConversationManager imported successfully")
    except Exception as e:
        print(f"❌ Failed to import ConversationManager: {e}")
        return False
    
    try:
        from dating_agent import DatingAgent
        print("✅ DatingAgent imported successfully")
    except Exception as e:
        print(f"❌ Failed to import DatingAgent: {e}")
        return False
    
    try:
        from flirting_engine import FlirtingEngine
        print("✅ FlirtingEngine imported successfully")
    except Exception as e:
        print(f"❌ Failed to import FlirtingEngine: {e}")
        return False
    
    return True

def test_basic_functionality():
    """Test basic functionality without OpenAI API calls"""
    print("\n🧪 Testing Basic Functionality...")
    
    try:
        from preference_manager import PreferenceManager
        from matching_engine import MatchingEngine
        from models import UserProfile, UserPreferences
        
        # Test preference manager
        pm = PreferenceManager()
        preferences = pm.create_user_preferences(
            personality_types=["extrovert"],
            music_genres=["pop", "rock"],
            hobbies=["travel", "photography"]
        )
        print("✅ Preference creation works")
        
        # Test user profile creation
        profile = UserProfile(
            user_id="test_user",
            name="Test User",
            age=25,
            location="Test City",
            bio="Test bio",
            preferences=preferences
        )
        print("✅ User profile creation works")
        
        # Test matching engine
        me = MatchingEngine()
        potential_matches = [{
            "user_id": "match_1",
            "name": "Test Match",
            "age": 26,
            "location": "Test City",
            "bio": "Test match bio",
            "music_genres": ["pop"],
            "hobbies": ["travel"]
        }]
        
        matches = me.find_best_matches(profile, potential_matches, limit=1)
        print(f"✅ Matching engine works - found {len(matches)} matches")
        
        return True
        
    except Exception as e:
        print(f"❌ Basic functionality test failed: {e}")
        return False

def test_openai_connection():
    """Test OpenAI API connection (requires valid API key)"""
    print("\n🧪 Testing OpenAI Connection...")
    
    try:
        from dating_agent import DatingAgent
        from models import FlirtingStyle, ConversationContext, PotentialMatch, UserPreferences
        
        agent = DatingAgent()
        
        # Create test context
        style = FlirtingStyle(intensity="moderate", humor_level="medium")
        match = PotentialMatch(
            user_id="test",
            name="Test",
            age=25,
            location="Test",
            bio="Test bio",
            compatibility_score=0.8
        )
        
        context = ConversationContext(
            conversation_id="test",
            participants=["user1", "user2"],
            match_profile=match
        )
        
        # Try to generate a simple message
        message = agent.generate_flirty_message(context, style, "Hello!")
        print("✅ OpenAI API connection works")
        print(f"   Sample response: {message[:100]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ OpenAI API test failed: {e}")
        print("   Make sure your API key is valid and has sufficient credits")
        return False

def main():
    """Run all tests"""
    print("🚀 CeloSoul Dating AI Agent - Setup Test\n")
    
    all_passed = True
    
    # Run tests
    if not test_environment_setup():
        all_passed = False
    
    if not test_imports():
        all_passed = False
    
    if not test_basic_functionality():
        all_passed = False
    
    # Only test OpenAI if environment is properly configured
    if all_passed:
        test_openai_connection()
    
    print("\n" + "="*50)
    if all_passed:
        print("🎉 All tests passed! Your setup is ready.")
        print("\nNext steps:")
        print("1. Run the API server: python3 main.py")
        print("2. Visit http://localhost:8000/docs for API documentation")
        print("3. Run examples: python3 example_usage.py")
    else:
        print("❌ Some tests failed. Please fix the issues above.")
        print("\nTroubleshooting:")
        print("1. Make sure you've added your OpenAI API key to .env")
        print("2. Check that all dependencies are installed")
        print("3. Verify file permissions")

if __name__ == "__main__":
    main()
