"""
Conversation Manager for handling chat history and context
"""
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import uuid
import json

from models import (
    ChatMessage, ConversationContext, UserPreferences, 
    PotentialMatch, FlirtingStyle
)

class ConversationManager:
    """Manages conversation history and context for AI agent"""
    
    def __init__(self, max_history: int = 20):
        """Initialize conversation manager"""
        self.max_history = max_history
        self.active_conversations: Dict[str, ConversationContext] = {}
        self.conversation_archives: Dict[str, List[ChatMessage]] = {}
    
    def create_conversation(
        self,
        user_id: str,
        match_profile: PotentialMatch,
        user_preferences: UserPreferences,
        flirting_style: FlirtingStyle
    ) -> str:
        """Create a new conversation context"""
        
        conversation_id = str(uuid.uuid4())
        
        context = ConversationContext(
            conversation_id=conversation_id,
            participants=[user_id, match_profile.user_id],
            match_profile=match_profile,
            user_preferences=user_preferences,
            conversation_tone="casual"
        )
        
        self.active_conversations[conversation_id] = context
        return conversation_id
    
    def add_message(
        self,
        conversation_id: str,
        sender_id: str,
        receiver_id: str,
        content: str,
        is_ai_generated: bool = False,
        message_type: str = "text"
    ) -> ChatMessage:
        """Add a message to a conversation"""
        
        if conversation_id not in self.active_conversations:
            raise ValueError(f"Conversation {conversation_id} not found")
        
        message = ChatMessage(
            message_id=str(uuid.uuid4()),
            sender_id=sender_id,
            receiver_id=receiver_id,
            content=content,
            message_type=message_type,
            is_ai_generated=is_ai_generated
        )
        
        context = self.active_conversations[conversation_id]
        context.messages.append(message)
        context.last_activity = datetime.now()
        
        # Maintain conversation history limit
        if len(context.messages) > self.max_history:
            context.messages = context.messages[-self.max_history:]
        
        return message
    
    def get_conversation_context(
        self, 
        conversation_id: str
    ) -> Optional[ConversationContext]:
        """Get conversation context by ID"""
        return self.active_conversations.get(conversation_id)
    
    def get_recent_messages(
        self, 
        conversation_id: str, 
        limit: int = 10
    ) -> List[ChatMessage]:
        """Get recent messages from a conversation"""
        
        context = self.active_conversations.get(conversation_id)
        if not context:
            return []
        
        return context.messages[-limit:] if context.messages else []
    
    def analyze_conversation_flow(
        self, 
        conversation_id: str
    ) -> Dict[str, Any]:
        """Analyze conversation flow and engagement"""
        
        context = self.active_conversations.get(conversation_id)
        if not context or not context.messages:
            return {
                "engagement": "low",
                "response_time": "slow",
                "conversation_depth": "shallow",
                "topics_covered": [],
                "suggestions": []
            }
        
        messages = context.messages
        
        # Calculate engagement metrics
        total_messages = len(messages)
        ai_messages = sum(1 for msg in messages if msg.is_ai_generated)
        user_messages = total_messages - ai_messages
        
        # Calculate response times (simplified)
        response_times = []
        for i in range(1, len(messages)):
            time_diff = messages[i].timestamp - messages[i-1].timestamp
            response_times.append(time_diff.total_seconds() / 60)  # minutes
        
        avg_response_time = sum(response_times) / len(response_times) if response_times else 0
        
        # Analyze conversation depth
        word_counts = [len(msg.content.split()) for msg in messages]
        avg_message_length = sum(word_counts) / len(word_counts) if word_counts else 0
        
        # Extract topics from messages
        topics = self._extract_topics_from_messages(messages)
        
        # Determine engagement level
        if total_messages > 10 and avg_message_length > 15:
            engagement = "high"
        elif total_messages > 5 and avg_message_length > 8:
            engagement = "medium"
        else:
            engagement = "low"
        
        # Determine response time category
        if avg_response_time < 30:  # Less than 30 minutes
            response_time_category = "fast"
        elif avg_response_time < 120:  # Less than 2 hours
            response_time_category = "moderate"
        else:
            response_time_category = "slow"
        
        # Generate suggestions
        suggestions = self._generate_conversation_suggestions(
            engagement, avg_response_time, topics, context
        )
        
        return {
            "engagement": engagement,
            "response_time": response_time_category,
            "conversation_depth": "deep" if avg_message_length > 20 else "shallow",
            "topics_covered": topics,
            "total_messages": total_messages,
            "avg_response_time_minutes": avg_response_time,
            "avg_message_length": avg_message_length,
            "suggestions": suggestions
        }
    
    def update_conversation_tone(
        self, 
        conversation_id: str, 
        new_tone: str
    ) -> bool:
        """Update conversation tone based on recent interactions"""
        
        context = self.active_conversations.get(conversation_id)
        if not context:
            return False
        
        context.conversation_tone = new_tone
        return True
    
    def get_conversation_summary(
        self, 
        conversation_id: str
    ) -> Dict[str, Any]:
        """Get a summary of the conversation"""
        
        context = self.active_conversations.get(conversation_id)
        if not context:
            return {}
        
        analysis = self.analyze_conversation_flow(conversation_id)
        
        return {
            "conversation_id": conversation_id,
            "participants": context.participants,
            "started_at": context.messages[0].timestamp if context.messages else None,
            "last_activity": context.last_activity,
            "total_messages": len(context.messages),
            "conversation_tone": context.conversation_tone,
            "engagement_level": analysis["engagement"],
            "topics_discussed": analysis["topics_covered"],
            "match_compatibility": context.match_profile.compatibility_score if context.match_profile else 0.0
        }
    
    def archive_conversation(self, conversation_id: str) -> bool:
        """Archive a conversation"""
        
        context = self.active_conversations.get(conversation_id)
        if not context:
            return False
        
        # Move messages to archive
        self.conversation_archives[conversation_id] = context.messages.copy()
        
        # Remove from active conversations
        del self.active_conversations[conversation_id]
        
        return True
    
    def get_conversation_history_for_ai(
        self, 
        conversation_id: str, 
        limit: int = 10
    ) -> str:
        """Format conversation history for AI agent context"""
        
        messages = self.get_recent_messages(conversation_id, limit)
        if not messages:
            return "No conversation history."
        
        formatted_messages = []
        for msg in messages:
            sender = "You" if msg.is_ai_generated else "Them"
            formatted_messages.append(f"{sender}: {msg.content}")
        
        return "\n".join(formatted_messages)
    
    def _extract_topics_from_messages(self, messages: List[ChatMessage]) -> List[str]:
        """Extract topics from conversation messages"""
        
        topics = []
        topic_keywords = {
            "music": ["music", "song", "band", "concert", "artist"],
            "travel": ["travel", "trip", "vacation", "destination", "country"],
            "food": ["food", "restaurant", "cooking", "recipe", "meal"],
            "work": ["work", "job", "career", "office", "business"],
            "hobbies": ["hobby", "interest", "activity", "fun", "enjoy"],
            "movies": ["movie", "film", "cinema", "netflix", "watch"],
            "sports": ["sport", "game", "team", "player", "match"],
            "books": ["book", "read", "author", "novel", "story"],
            "defi": ["defi", "yield", "farming", "liquidity", "protocol", "dex", "uniswap", "compound"],
            "nft": ["nft", "token", "collection", "mint", "opensea", "digital art", "blockchain art"],
            "coding": ["code", "programming", "smart contract", "solidity", "javascript", "python", "github"],
            "crypto": ["crypto", "bitcoin", "ethereum", "trading", "hodl", "altcoin", "wallet"],
            "blockchain": ["blockchain", "web3", "dapp", "dao", "consensus", "mining", "validator"]
        }
        
        all_content = " ".join([msg.content.lower() for msg in messages])
        
        for topic, keywords in topic_keywords.items():
            if any(keyword in all_content for keyword in keywords):
                topics.append(topic)
        
        return topics
    
    def _generate_conversation_suggestions(
        self, 
        engagement: str, 
        avg_response_time: float, 
        topics: List[str],
        context: ConversationContext
    ) -> List[str]:
        """Generate suggestions to improve conversation"""
        
        suggestions = []
        
        if engagement == "low":
            suggestions.append("Try asking more open-ended questions")
            suggestions.append("Share personal anecdotes to encourage sharing")
        
        if avg_response_time > 60:  # More than 1 hour
            suggestions.append("Consider sending follow-up messages to maintain engagement")
        
        if len(topics) < 3:
            suggestions.append("Explore new topics to deepen the conversation")
        
        if context.conversation_tone == "casual" and engagement == "medium":
            suggestions.append("Consider being slightly more playful or flirty")
        
        if context.match_profile and context.match_profile.compatibility_score > 0.8:
            suggestions.append("High compatibility detected - be more confident in your approach")
        
        return suggestions
    
    def get_active_conversations(self, user_id: str) -> List[str]:
        """Get all active conversation IDs for a user"""
        
        user_conversations = []
        for conv_id, context in self.active_conversations.items():
            if user_id in context.participants:
                user_conversations.append(conv_id)
        
        return user_conversations
    
    def cleanup_old_conversations(self, days_old: int = 30) -> int:
        """Clean up old inactive conversations"""
        
        cutoff_date = datetime.now() - timedelta(days=days_old)
        conversations_to_remove = []
        
        for conv_id, context in self.active_conversations.items():
            if context.last_activity < cutoff_date:
                conversations_to_remove.append(conv_id)
        
        for conv_id in conversations_to_remove:
            self.archive_conversation(conv_id)
        
        return len(conversations_to_remove)
