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
    TECH_SAVVY = "tech_savvy"
    WEB3_ENTHUSIAST = "web3_enthusiast"
    NERDY = "nerdy"

class BlockchainChain(str, Enum):
    """Blockchain chains for Web3 preferences"""
    CELO = "celo"
    ETHEREUM = "ethereum"
    POLYGON = "polygon"
    ARBITRUM = "arbitrum"
    OPTIMISM = "optimism"
    BINANCE_SMART_CHAIN = "bsc"
    SOLANA = "solana"
    AVALANCHE = "avalanche"
    FANTOM = "fantom"
    COSMOS = "cosmos"

class TradingStyle(str, Enum):
    """Trading styles for crypto preferences"""
    HODLER = "hodler"
    TRADER = "trader"
    DEGEN = "degen"
    BUILDER = "builder"
    CAUTIOUS = "cautious"
    YOLO = "yolo"

class Web3Experience(str, Enum):
    """Web3 experience levels"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    EXPERT = "expert"
    BUILDER = "builder"

class ProgrammingLanguage(str, Enum):
    """Programming languages for tech preferences"""
    SOLIDITY = "solidity"
    JAVASCRIPT = "javascript"
    TYPESCRIPT = "typescript"
    PYTHON = "python"
    RUST = "rust"
    GO = "go"
    VYPER = "vyper"
    MOVE = "move"

class Web3Preferences(BaseModel):
    """Web3 and tech-specific preferences"""
    # Blockchain preferences
    favorite_chains: List[BlockchainChain] = Field(default_factory=list)
    trading_style: Optional[TradingStyle] = None
    defi_experience: Web3Experience = Web3Experience.BEGINNER
    nft_interests: List[str] = Field(default_factory=list)  # ["art", "gaming", "utility", "pfp"]
    
    # Tech stack preferences
    programming_languages: List[ProgrammingLanguage] = Field(default_factory=list)
    dev_frameworks: List[str] = Field(default_factory=list)  # ["react", "vue", "hardhat", "truffle"]
    preferred_ide: Optional[str] = None  # "vscode", "remix", "foundry"
    
    # Community & culture
    web3_communities: List[str] = Field(default_factory=list)  # ["gitcoin", "dappcon", "ethglobal", "celo"]
    conference_attendance: List[str] = Field(default_factory=list)  # ["devcon", "consensus", "celocon"]
    mentorship_interest: str = "both"  # mentor, mentee, both, neither
    
    # Crypto preferences
    crypto_portfolio_size: Optional[str] = None  # "small", "medium", "large", "whale"
    risk_tolerance: str = "moderate"  # conservative, moderate, aggressive
    investment_philosophy: List[str] = Field(default_factory=list)  # ["long_term", "short_term", "speculative"]

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
    
    # Web3 and tech preferences
    web3_preferences: Optional[Web3Preferences] = None

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
    
    # Web3/tech-specific flirting parameters
    tech_level: str = "balanced"  # minimal, balanced, heavy
    web3_knowledge: str = "intermediate"  # beginner, intermediate, expert
    crypto_enthusiasm: str = "moderate"  # low, moderate, high
    nerd_factor: str = "medium"  # low, medium, high

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
    
    # Web3/tech compatibility
    tech_compatibility_score: float = Field(ge=0.0, le=1.0, default=0.0)
    blockchain_ecosystem_match: float = Field(ge=0.0, le=1.0, default=0.0)
    development_synergy: float = Field(ge=0.0, le=1.0, default=0.0)
    trading_philosophy_alignment: float = Field(ge=0.0, le=1.0, default=0.0)
    community_overlap: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Web3-specific insights
    shared_protocols: List[str] = Field(default_factory=list)
    complementary_skills: List[str] = Field(default_factory=list)
    potential_collaborations: List[str] = Field(default_factory=list)
    web3_conversation_starters: List[str] = Field(default_factory=list)
