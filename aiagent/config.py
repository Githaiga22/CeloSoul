"""
Configuration settings for the CeloSoul Dating AI Agent
"""
import os
from dotenv import load_dotenv
from typing import Dict, Any

load_dotenv()

class Config:
    """Configuration class for the dating AI agent"""
    
    # OpenAI API Configuration
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "gpt-4")
    TEMPERATURE = float(os.getenv("TEMPERATURE", "0.8"))
    MAX_TOKENS = int(os.getenv("MAX_TOKENS", "500"))
    
    # Agent Configuration
    AGENT_NAME = os.getenv("AGENT_NAME", "CeloSoul Dating Assistant")
    AGENT_PERSONALITY = os.getenv("AGENT_PERSONALITY", "flirty, witty, charming")
    
    # Matching Configuration
    MIN_COMPATIBILITY_SCORE = 0.6
    MAX_DAILY_MATCHES = 10
    PREFERENCE_WEIGHTS = {
        "music_taste": 0.2,
        "hobbies": 0.25,
        "behavior_signals": 0.3,
        "personality": 0.15,
        "lifestyle": 0.1
    }
    
    # Conversation Configuration
    MAX_CONVERSATION_HISTORY = 20
    CONTEXT_WINDOW = 10
    
    @classmethod
    def get_agent_system_prompt(cls) -> str:
        """Get the system prompt for the AI agent"""
        return f"""You are {cls.AGENT_NAME}, a sophisticated and charming dating assistant for the CeloSoul platform.

Your personality: {cls.AGENT_PERSONALITY}

Your role:
- Help users find compatible matches based on their preferences
- Generate engaging, flirty, and contextually appropriate messages
- Maintain natural conversation flow while being charming and witty
- Respect boundaries and be genuine in your interactions
- Adapt your communication style to match the user's preferences

Guidelines:
- Always be respectful and authentic
- Use emojis sparingly but effectively
- Keep messages concise but engaging (1-3 sentences)
- Show genuine interest in the other person
- Be playful but not overly forward
- Ask thoughtful questions to keep conversations flowing

Remember: You're helping create meaningful connections, so focus on compatibility and genuine engagement."""
