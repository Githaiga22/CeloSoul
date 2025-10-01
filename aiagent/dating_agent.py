"""
Core Dating AI Agent for CeloSoul
"""
import openai
from typing import List, Dict, Optional, Any
import json
from datetime import datetime
import uuid

from config import Config
from models import (
    UserProfile, PotentialMatch, ChatMessage, ConversationContext,
    FlirtingStyle, MatchAnalysis, UserPreferences
)

class DatingAgent:
    """Core AI agent for dating assistance and conversation generation"""
    
    def __init__(self):
        """Initialize the dating agent with OpenAI client"""
        self.client = openai.OpenAI(api_key=Config.OPENAI_API_KEY)
        self.system_prompt = Config.get_agent_system_prompt()
        
    def generate_flirty_message(
        self, 
        context: ConversationContext, 
        flirting_style: FlirtingStyle,
        target_message: Optional[str] = None
    ) -> str:
        """Generate a flirty message based on context and style preferences"""
        
        prompt = self._build_flirting_prompt(context, flirting_style, target_message)
        
        try:
            response = self.client.chat.completions.create(
                model=Config.DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=Config.TEMPERATURE,
                max_tokens=Config.MAX_TOKENS
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating flirty message: {e}")
            return self._get_fallback_message(flirting_style)
    
    def generate_conversation_starter(
        self, 
        match: PotentialMatch, 
        user_preferences: UserPreferences,
        flirting_style: FlirtingStyle
    ) -> List[str]:
        """Generate conversation starters for a potential match"""
        
        prompt = f"""
        Generate 3 engaging conversation starters for someone who:
        - Name: {match.name}
        - Bio: {match.bio}
        - Shared interests: {match.match_reasons[:3]}
        
        Flirting style: {flirting_style.intensity}, {flirting_style.humor_level} humor
        
        Make them:
        - Personalized and genuine
        - Engaging but not overwhelming
        - Appropriate for the flirting style
        - Based on shared interests when possible
        
        Return as a JSON array of strings.
        """
        
        try:
            response = self.client.chat.completions.create(
                model=Config.DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=Config.TEMPERATURE,
                max_tokens=Config.MAX_TOKENS
            )
            
            # Try to parse JSON response
            content = response.choices[0].message.content.strip()
            try:
                starters = json.loads(content)
                return starters if isinstance(starters, list) else [content]
            except json.JSONDecodeError:
                # If not JSON, split by lines and clean up
                starters = [line.strip() for line in content.split('\n') if line.strip()]
                return starters[:3]
                
        except Exception as e:
            print(f"Error generating conversation starters: {e}")
            return [
                f"Hey {match.name}! I noticed we both love {match.match_reasons[0] if match.match_reasons else 'similar things'}. What's your take on it?",
                f"Hi {match.name}! Your bio caught my attention - seems like we might have a lot in common!",
                f"Hey there! I couldn't help but notice we share an interest in {match.match_reasons[0] if match.match_reasons else 'some cool stuff'}. Tell me more!"
            ]
    
    def analyze_conversation_tone(
        self, 
        messages: List[ChatMessage]
    ) -> Dict[str, Any]:
        """Analyze the tone and style of a conversation"""
        
        if not messages:
            return {"tone": "neutral", "engagement": "low", "suggestions": []}
        
        # Get recent messages for analysis
        recent_messages = messages[-5:] if len(messages) > 5 else messages
        conversation_text = "\n".join([msg.content for msg in recent_messages])
        
        prompt = f"""
        Analyze the tone and engagement level of this conversation:
        
        {conversation_text}
        
        Provide analysis in JSON format:
        {{
            "tone": "casual/flirty/serious/playful",
            "engagement": "high/medium/low",
            "response_suggestions": ["suggestion1", "suggestion2"],
            "mood_indicators": ["indicator1", "indicator2"]
        }}
        """
        
        try:
            response = self.client.chat.completions.create(
                model=Config.DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": "You are a conversation analyst. Provide accurate, helpful analysis in JSON format."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=300
            )
            
            content = response.choices[0].message.content.strip()
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                return {"tone": "casual", "engagement": "medium", "suggestions": []}
                
        except Exception as e:
            print(f"Error analyzing conversation tone: {e}")
            return {"tone": "casual", "engagement": "medium", "suggestions": []}
    
    def suggest_response_strategy(
        self, 
        context: ConversationContext,
        incoming_message: str,
        user_preferences: UserPreferences
    ) -> Dict[str, Any]:
        """Suggest response strategy based on incoming message and context"""
        
        prompt = f"""
        Given this conversation context and incoming message, suggest the best response strategy:
        
        Conversation history:
        {self._format_conversation_history(context.messages[-3:])}
        
        Incoming message: "{incoming_message}"
        
        User preferences: {user_preferences.behavior_signals}
        
        Provide strategy in JSON format:
        {{
            "response_type": "flirty/playful/casual/serious",
            "tone_adjustment": "increase/decrease/maintain",
            "suggested_topics": ["topic1", "topic2"],
            "response_length": "short/medium/long",
            "emoji_usage": "minimal/moderate/frequent"
        }}
        """
        
        try:
            response = self.client.chat.completions.create(
                model=Config.DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=200
            )
            
            content = response.choices[0].message.content.strip()
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                return {
                    "response_type": "casual",
                    "tone_adjustment": "maintain",
                    "suggested_topics": [],
                    "response_length": "medium",
                    "emoji_usage": "moderate"
                }
                
        except Exception as e:
            print(f"Error suggesting response strategy: {e}")
            return {
                "response_type": "casual",
                "tone_adjustment": "maintain",
                "suggested_topics": [],
                "response_length": "medium",
                "emoji_usage": "moderate"
            }
    
    def _build_flirting_prompt(
        self, 
        context: ConversationContext, 
        flirting_style: FlirtingStyle,
        target_message: Optional[str]
    ) -> str:
        """Build the prompt for flirty message generation"""
        
        base_prompt = f"""
        Generate a {flirting_style.intensity} flirty message with {flirting_style.humor_level} humor level.
        
        Flirting style preferences:
        - Intensity: {flirting_style.intensity}
        - Humor: {flirting_style.humor_level}
        - Directness: {flirting_style.directness}
        - Emoji usage: {flirting_style.emoji_usage}
        """
        
        if context.messages:
            base_prompt += f"""
            
            Recent conversation:
            {self._format_conversation_history(context.messages[-3:])}
            """
        
        if target_message:
            base_prompt += f"""
            
            Responding to: "{target_message}"
            """
        
        if context.match_profile:
            base_prompt += f"""
            
            About the person:
            - Name: {context.match_profile.name}
            - Bio: {context.match_profile.bio}
            - Shared interests: {context.match_profile.match_reasons[:2]}
            """
        
        base_prompt += """
        
        Generate a natural, engaging response that:
        - Matches the specified flirting style
        - Feels authentic and genuine
        - Keeps the conversation flowing
        - Shows interest without being overwhelming
        """
        
        return base_prompt
    
    def _format_conversation_history(self, messages: List[ChatMessage]) -> str:
        """Format conversation history for prompts"""
        if not messages:
            return "No previous messages."
        
        formatted = []
        for msg in messages:
            sender = "You" if msg.is_ai_generated else "Them"
            formatted.append(f"{sender}: {msg.content}")
        
        return "\n".join(formatted)
    
    def _get_fallback_message(self, flirting_style: FlirtingStyle) -> str:
        """Get a fallback message if AI generation fails"""
        fallbacks = {
            "subtle": "That's interesting! Tell me more about that.",
            "moderate": "I love that perspective! What made you think of that?",
            "bold": "You've definitely caught my attention! What else should I know about you?"
        }
        
        return fallbacks.get(flirting_style.intensity, fallbacks["moderate"])
