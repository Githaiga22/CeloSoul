"""
Main API Interface for CeloSoul Dating AI Agent
"""
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime

from models import (
    UserProfile, UserPreferences, PotentialMatch, ChatMessage, 
    ConversationContext, FlirtingStyle, MatchAnalysis
)
from dating_agent import DatingAgent
from preference_manager import PreferenceManager
from matching_engine import MatchingEngine
from conversation_manager import ConversationManager
from flirting_engine import FlirtingEngine

# Initialize FastAPI app
app = FastAPI(
    title="CeloSoul Dating AI Agent",
    description="AI-powered dating assistant for matching and flirting",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize core components
dating_agent = DatingAgent()
preference_manager = PreferenceManager()
matching_engine = MatchingEngine()
conversation_manager = ConversationManager()
flirting_engine = FlirtingEngine()

# Request/Response Models
class CreateUserRequest(BaseModel):
    name: str
    age: int
    location: str
    bio: str
    interests: List[str] = []
    photos: List[str] = []
    personality_types: List[str] = []
    music_genres: List[str] = []
    hobbies: List[str] = []
    behavior_signals: List[str] = []
    age_range: Optional[tuple] = None
    lifestyle_preferences: List[str] = []
    deal_breakers: List[str] = []
    must_haves: List[str] = []
    web3_preferences: Optional[Dict[str, Any]] = None

class ChatRequest(BaseModel):
    conversation_id: str
    sender_id: str
    receiver_id: str
    message: str
    flirting_style: Optional[Dict[str, str]] = None

class MatchAnalysisRequest(BaseModel):
    user_id: str
    potential_matches: List[Dict[str, Any]]

class ConversationStarterRequest(BaseModel):
    match_profile: Dict[str, Any]
    user_preferences: Dict[str, Any]
    flirting_style: Dict[str, str]

class ResponseModel(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None

# In-memory storage (replace with database in production)
user_profiles: Dict[str, UserProfile] = {}
potential_matches: List[Dict[str, Any]] = []

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "CeloSoul Dating AI Agent is running!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now()}

@app.post("/users", response_model=ResponseModel)
async def create_user(request: CreateUserRequest):
    """Create a new user profile"""
    try:
        user_id = str(uuid.uuid4())
        
        # Create user preferences
        preferences = preference_manager.create_user_preferences(
            personality_types=request.personality_types,
            music_genres=request.music_genres,
            hobbies=request.hobbies,
            behavior_signals=request.behavior_signals,
            age_range=request.age_range,
            lifestyle_preferences=request.lifestyle_preferences,
            deal_breakers=request.deal_breakers,
            must_haves=request.must_haves
        )
        
        # Add Web3 preferences if provided
        if hasattr(request, 'web3_preferences') and request.web3_preferences:
            preferences.web3_preferences = preference_manager.create_web3_preferences(**request.web3_preferences)
        
        # Create user profile
        profile = UserProfile(
            user_id=user_id,
            name=request.name,
            age=request.age,
            location=request.location,
            bio=request.bio,
            preferences=preferences,
            interests=request.interests,
            photos=request.photos
        )
        
        user_profiles[user_id] = profile
        
        return ResponseModel(
            success=True,
            message="User created successfully",
            data={"user_id": user_id, "profile": profile.dict()}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")

@app.get("/users/{user_id}", response_model=ResponseModel)
async def get_user(user_id: str):
    """Get user profile by ID"""
    if user_id not in user_profiles:
        raise HTTPException(status_code=404, detail="User not found")
    
    return ResponseModel(
        success=True,
        message="User retrieved successfully",
        data={"profile": user_profiles[user_id].dict()}
    )

@app.post("/matches/analyze", response_model=ResponseModel)
async def analyze_matches(request: MatchAnalysisRequest):
    """Analyze compatibility with potential matches"""
    try:
        if request.user_id not in user_profiles:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_profile = user_profiles[request.user_id]
        
        # Find best matches
        best_matches = matching_engine.find_best_matches(
            user_profile, 
            request.potential_matches, 
            limit=10
        )
        
        return ResponseModel(
            success=True,
            message="Matches analyzed successfully",
            data={
                "matches": [match.dict() for match in best_matches],
                "total_analyzed": len(request.potential_matches),
                "compatible_matches": len(best_matches)
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing matches: {str(e)}")

@app.post("/conversations", response_model=ResponseModel)
async def create_conversation(
    user_id: str,
    match_user_id: str,
    flirting_style: Dict[str, str]
):
    """Create a new conversation"""
    try:
        if user_id not in user_profiles:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_profile = user_profiles[user_id]
        
        # Create match profile (simplified for demo)
        match_profile = PotentialMatch(
            user_id=match_user_id,
            name="Match User",
            age=25,
            location="Unknown",
            bio="Potential match",
            compatibility_score=0.8
        )
        
        # Create flirting style
        style = FlirtingStyle(
            intensity=flirting_style.get("intensity", "moderate"),
            humor_level=flirting_style.get("humor_level", "medium"),
            directness=flirting_style.get("directness", "balanced"),
            emoji_usage=flirting_style.get("emoji_usage", "moderate"),
            tech_level=flirting_style.get("tech_level", "balanced"),
            web3_knowledge=flirting_style.get("web3_knowledge", "intermediate"),
            crypto_enthusiasm=flirting_style.get("crypto_enthusiasm", "moderate"),
            nerd_factor=flirting_style.get("nerd_factor", "medium")
        )
        
        # Create conversation
        conversation_id = conversation_manager.create_conversation(
            user_id, match_profile, user_profile.preferences, style
        )
        
        return ResponseModel(
            success=True,
            message="Conversation created successfully",
            data={"conversation_id": conversation_id}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating conversation: {str(e)}")

@app.post("/chat", response_model=ResponseModel)
async def send_message(request: ChatRequest):
    """Send a message and get AI response"""
    try:
        # Add the user's message to conversation
        user_message = conversation_manager.add_message(
            request.conversation_id,
            request.sender_id,
            request.receiver_id,
            request.message,
            is_ai_generated=False
        )
        
        # Get conversation context
        context = conversation_manager.get_conversation_context(request.conversation_id)
        if not context:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Create flirting style
        style_data = request.flirting_style or {}
        flirting_style = FlirtingStyle(
            intensity=style_data.get("intensity", "moderate"),
            humor_level=style_data.get("humor_level", "medium"),
            directness=style_data.get("directness", "balanced"),
            emoji_usage=style_data.get("emoji_usage", "moderate"),
            tech_level=style_data.get("tech_level", "balanced"),
            web3_knowledge=style_data.get("web3_knowledge", "intermediate"),
            crypto_enthusiasm=style_data.get("crypto_enthusiasm", "moderate"),
            nerd_factor=style_data.get("nerd_factor", "medium")
        )
        
        # Generate AI response
        ai_response = flirting_engine.generate_contextual_flirty_message(
            context, flirting_style, request.message
        )
        
        # Add AI response to conversation
        ai_message = conversation_manager.add_message(
            request.conversation_id,
            "ai_agent",
            request.sender_id,
            ai_response,
            is_ai_generated=True
        )
        
        return ResponseModel(
            success=True,
            message="Message sent and response generated",
            data={
                "user_message": user_message.dict(),
                "ai_response": ai_message.dict(),
                "conversation_id": request.conversation_id
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

@app.post("/conversations/{conversation_id}/starters", response_model=ResponseModel)
async def generate_conversation_starters(
    conversation_id: str,
    request: ConversationStarterRequest
):
    """Generate conversation starters for a match"""
    try:
        # Debug: Print the request data
        print(f"DEBUG: match_profile data: {request.match_profile}")
        print(f"DEBUG: compatibility_score in data: {request.match_profile.get('compatibility_score')}")
        
        # Create flirting style
        flirting_style = FlirtingStyle(
            intensity=request.flirting_style.get("intensity", "moderate"),
            humor_level=request.flirting_style.get("humor_level", "medium"),
            directness=request.flirting_style.get("directness", "balanced"),
            emoji_usage=request.flirting_style.get("emoji_usage", "moderate"),
            tech_level=request.flirting_style.get("tech_level", "balanced"),
            web3_knowledge=request.flirting_style.get("web3_knowledge", "intermediate"),
            crypto_enthusiasm=request.flirting_style.get("crypto_enthusiasm", "moderate"),
            nerd_factor=request.flirting_style.get("nerd_factor", "medium")
        )
        
        # Create match profile
        match_profile = PotentialMatch(
            user_id=request.match_profile.get("user_id", ""),
            name=request.match_profile.get("name", ""),
            age=request.match_profile.get("age", 0),
            location=request.match_profile.get("location", ""),
            bio=request.match_profile.get("bio", ""),
            photos=request.match_profile.get("photos", []),
            compatibility_score=request.match_profile.get("compatibility_score", 0.8),
            match_reasons=[],
            conversation_starters=[]
        )
        
        # Create user preferences
        preferences = preference_manager.create_user_preferences(
            personality_types=request.user_preferences.get("personality_types", []),
            music_genres=request.user_preferences.get("music_genres", []),
            hobbies=request.user_preferences.get("hobbies", []),
            behavior_signals=request.user_preferences.get("behavior_signals", []),
            age_range=request.user_preferences.get("age_range"),
            lifestyle_preferences=request.user_preferences.get("lifestyle_preferences", [])
        )
        
        # Generate conversation starters
        starters = dating_agent.generate_conversation_starter(
            match_profile, preferences, flirting_style
        )
        
        return ResponseModel(
            success=True,
            message="Conversation starters generated successfully",
            data={"conversation_starters": starters}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating starters: {str(e)}")

@app.get("/conversations/{conversation_id}", response_model=ResponseModel)
async def get_conversation(conversation_id: str):
    """Get conversation details and history"""
    try:
        context = conversation_manager.get_conversation_context(conversation_id)
        if not context:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        summary = conversation_manager.get_conversation_summary(conversation_id)
        
        return ResponseModel(
            success=True,
            message="Conversation retrieved successfully",
            data=summary
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving conversation: {str(e)}")

@app.get("/conversations/{conversation_id}/messages", response_model=ResponseModel)
async def get_conversation_messages(conversation_id: str, limit: int = 20):
    """Get conversation messages"""
    try:
        messages = conversation_manager.get_recent_messages(conversation_id, limit)
        
        return ResponseModel(
            success=True,
            message="Messages retrieved successfully",
            data={"messages": [msg.dict() for msg in messages]}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving messages: {str(e)}")

@app.get("/conversations/{conversation_id}/analysis", response_model=ResponseModel)
async def analyze_conversation(conversation_id: str):
    """Analyze conversation flow and engagement"""
    try:
        analysis = conversation_manager.analyze_conversation_flow(conversation_id)
        
        return ResponseModel(
            success=True,
            message="Conversation analyzed successfully",
            data=analysis
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing conversation: {str(e)}")

@app.post("/preferences/analyze-behavior", response_model=ResponseModel)
async def analyze_user_behavior(
    user_id: str,
    messages: List[str],
    profile_data: Dict[str, Any]
):
    """Analyze user behavior from messages and profile"""
    try:
        if user_id not in user_profiles:
            raise HTTPException(status_code=404, detail="User not found")
        
        behavior_signals = preference_manager.analyze_user_behavior(messages, profile_data)
        
        return ResponseModel(
            success=True,
            message="Behavior analyzed successfully",
            data={"behavior_signals": [signal.value for signal in behavior_signals]}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing behavior: {str(e)}")

@app.get("/users/{user_id}/preferences", response_model=ResponseModel)
async def get_user_preferences(user_id: str):
    """Get user preferences summary"""
    try:
        if user_id not in user_profiles:
            raise HTTPException(status_code=404, detail="User not found")
        
        preferences = user_profiles[user_id].preferences
        summary = preference_manager.get_preference_summary(preferences)
        
        return ResponseModel(
            success=True,
            message="Preferences retrieved successfully",
            data=summary
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving preferences: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
