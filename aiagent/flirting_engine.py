"""
Advanced Flirting Engine for Context-Aware Conversation Generation
"""
from typing import List, Dict, Any, Optional, Tuple
import random
from datetime import datetime

from models import (
    ConversationContext, FlirtingStyle, ChatMessage, 
    UserPreferences, PotentialMatch
)
from dating_agent import DatingAgent

class FlirtingEngine:
    """Advanced engine for generating context-aware flirty messages"""
    
    def __init__(self):
        """Initialize the flirting engine"""
        self.dating_agent = DatingAgent()
        
        # Flirting templates organized by style and context
        self.flirting_templates = {
            "subtle": {
                "openers": [
                    "I couldn't help but notice...",
                    "There's something intriguing about...",
                    "I find myself drawn to...",
                    "You seem like someone who...",
                    "I have a feeling we'd get along because...",
                    "I'm getting strong mainnet energy from your profile...",
                    "Your code commits are giving me serious alpha vibes...",
                    "I sense some serious Web3 intellect here...",
                    "Your GitHub activity is making me curious...",
                    "Your blockchain knowledge is giving me mainnet energy..."
                ],
                "playful": [
                    "You've got me curious about...",
                    "I'm betting you're the kind of person who...",
                    "Something tells me you have great taste in...",
                    "I'm getting the vibe that you...",
                    "You strike me as someone who knows...",
                    "I'm betting you have some hot takes on the latest protocol upgrades...",
                    "Something tells me you're the kind of person who can explain DeFi to anyone...",
                    "I'm getting excited thinking about our future discussions on tokenomics...",
                    "You seem like someone who could teach me a thing or two about smart contracts...",
                    "I'm getting strong builder vibes from your profile..."
                ],
                "compliments": [
                    "Your perspective on {topic} is really refreshing",
                    "I love how you think about {topic}",
                    "You have such an interesting take on {topic}",
                    "The way you describe {topic} is captivating",
                    "Your insights about {topic} are spot on",
                    "Your understanding of {topic} is incredibly attractive",
                    "I love how you think about {topic} - it's giving me serious brain stimulation",
                    "Your insights on {topic} are pure alpha",
                    "The way you explain {topic} is making me fall for your intellect",
                    "Your technical expertise in {topic} is mesmerizing"
                ]
            },
            "moderate": {
                "openers": [
                    "You've definitely caught my attention with...",
                    "I'm genuinely intrigued by your thoughts on...",
                    "There's something about you that's really appealing...",
                    "I find your approach to {topic} quite attractive",
                    "You seem like exactly the kind of person I'd want to...",
                    "Your Web3 knowledge is definitely catching my attention...",
                    "I'm genuinely intrigued by your blockchain insights...",
                    "There's something about your tech stack that's really appealing...",
                    "I find your approach to DeFi quite attractive",
                    "You seem like exactly the kind of developer I'd want to collaborate with..."
                ],
                "playful": [
                    "I'm already imagining the conversations we could have about...",
                    "You seem like someone who could teach me a thing or two about...",
                    "I'm getting excited just thinking about discussing...",
                    "Something tells me you're going to be trouble in the best way",
                    "I can already tell we're going to have some great debates about...",
                    "I'm already imagining our future hackathons together...",
                    "You seem like someone who could teach me a thing or two about smart contracts...",
                    "I'm getting excited just thinking about our technical discussions...",
                    "Something tells me you're going to be trouble in the best way - like breaking production on a Friday",
                    "I can already tell we're going to have some great debates about consensus mechanisms..."
                ],
                "compliments": [
                    "Your intelligence about {topic} is incredibly attractive",
                    "I'm drawn to how passionate you are about {topic}",
                    "Your confidence when talking about {topic} is magnetic",
                    "The way you light up when discussing {topic} is captivating",
                    "Your expertise in {topic} is really impressive",
                    "Your blockchain intelligence is incredibly attractive",
                    "I'm drawn to how passionate you are about Web3",
                    "Your confidence when talking about DeFi is magnetic",
                    "The way you light up when discussing smart contracts is captivating",
                    "Your technical expertise is really impressive"
                ]
            },
            "bold": {
                "openers": [
                    "I have to say, you're exactly what I've been looking for...",
                    "There's no way I'm letting someone this interesting slip away...",
                    "I'm already planning our first date and we haven't even met...",
                    "You've got me thinking about things I shouldn't be thinking about yet...",
                    "I'm going to be honest - I'm completely smitten with your approach to...",
                    "I have to say, your blockchain knowledge is exactly what I've been looking for...",
                    "There's no way I'm letting someone this technically brilliant slip away...",
                    "I'm already planning our first hackathon and we haven't even met...",
                    "You've got me thinking about things I shouldn't be thinking about yet... like our DAO governance strategy...",
                    "I'm going to be honest - I'm completely smitten with your smart contract skills..."
                ],
                "playful": [
                    "I'm already imagining all the ways we could explore {topic} together",
                    "You seem like the perfect person to get lost in conversation with about...",
                    "I'm getting butterflies just thinking about our future discussions on...",
                    "Something tells me you're going to be absolutely irresistible once we start talking",
                    "I can already picture us having the most amazing conversations about...",
                    "I'm already planning our first smart contract deployment together",
                    "You seem like the perfect person to get lost in code reviews with",
                    "I'm getting butterflies just thinking about our future technical discussions",
                    "Something tells me you're going to be absolutely irresistible once we start talking about DeFi",
                    "I can already picture us having the most amazing debates about consensus mechanisms"
                ],
                "compliments": [
                    "Your passion for {topic} is absolutely intoxicating",
                    "I'm completely captivated by your knowledge of {topic}",
                    "Your perspective on {topic} is incredibly sexy",
                    "The way you engage with {topic} is making me fall for you already",
                    "Your expertise in {topic} is the most attractive thing about you",
                    "Your passion for blockchain is absolutely intoxicating",
                    "I'm completely captivated by your Web3 knowledge",
                    "Your perspective on DeFi is incredibly sexy",
                    "The way you engage with smart contracts is making me fall for you already",
                    "Your technical expertise is the most attractive thing about you"
                ]
            }
        }
        
        # Context-aware response patterns
        self.context_patterns = {
            "music": {
                "questions": [
                    "What's the last song that gave you chills?",
                    "If you could only listen to one artist for the rest of your life, who would it be?",
                    "What's a song that perfectly describes your mood right now?",
                    "Do you have a go-to song for when you need to feel confident?",
                    "What's the most unexpected genre you've fallen in love with?"
                ],
                "flirty_followups": [
                    "I'm already imagining us sharing headphones and discovering new music together",
                    "Your music taste is making me want to create the perfect playlist for you",
                    "I have a feeling our music tastes would create some amazing chemistry",
                    "I'm getting excited thinking about all the concerts we could go to together",
                    "Your music preferences are giving me serious butterflies"
                ]
            },
            "travel": {
                "questions": [
                    "What's the most spontaneous trip you've ever taken?",
                    "If you could teleport anywhere right now, where would you go?",
                    "What's a destination that completely changed your perspective?",
                    "Do you prefer planned adventures or going with the flow?",
                    "What's your dream destination that you haven't visited yet?"
                ],
                "flirty_followups": [
                    "I'm already planning all the adventures we could have together",
                    "Your wanderlust is incredibly attractive - I love that adventurous spirit",
                    "I can picture us getting lost in amazing places and finding each other",
                    "Your travel stories are making me want to explore the world with you",
                    "I'm getting excited thinking about all the memories we could create together"
                ]
            },
            "food": {
                "questions": [
                    "What's the most memorable meal you've ever had?",
                    "If you could have dinner with anyone, living or dead, who would it be?",
                    "What's your signature dish that always impresses people?",
                    "Do you prefer cooking together or being surprised with a meal?",
                    "What's a food experience that completely changed your mind about something?"
                ],
                "flirty_followups": [
                    "I'm already imagining us cooking together and creating something delicious",
                    "Your food preferences are making me want to cook you the perfect meal",
                    "I have a feeling we'd have amazing chemistry in the kitchen",
                    "Your culinary adventures are giving me serious foodie crushes",
                    "I'm getting excited thinking about all the restaurants we could discover together"
                ]
            },
            "defi": {
                "questions": [
                    "What's your go-to DeFi protocol for yield farming?",
                    "If you could only use one DEX for the rest of your life, which would it be?",
                    "What's the most innovative DeFi mechanism you've seen recently?",
                    "Do you prefer automated or manual yield strategies?",
                    "What's your take on the latest governance token distribution?"
                ],
                "flirty_followups": [
                    "I'm already imagining us optimizing yield strategies together",
                    "Your DeFi knowledge is making me want to create the perfect portfolio with you",
                    "I have a feeling our DeFi strategies would create some amazing returns",
                    "Your yield farming expertise is giving me serious financial butterflies",
                    "I'm getting excited thinking about all the protocols we could explore together"
                ]
            },
            "nft": {
                "questions": [
                    "What's the most meaningful NFT in your collection?",
                    "If you could mint any NFT right now, what would it be?",
                    "What's your favorite use case for NFTs beyond art?",
                    "Do you prefer utility or aesthetic-focused NFTs?",
                    "What's the most innovative NFT project you've seen?"
                ],
                "flirty_followups": [
                    "I'm already planning our first collaborative NFT project",
                    "Your NFT taste is incredibly attractive - I love that creative vision",
                    "I can picture us curating the most amazing collection together",
                    "Your NFT insights are making me want to create something beautiful with you",
                    "I'm getting excited thinking about all the art we could discover together"
                ]
            },
            "coding": {
                "questions": [
                    "What's your favorite programming language for blockchain development?",
                    "If you could only use one development framework, what would it be?",
                    "What's the most challenging smart contract you've written?",
                    "Do you prefer test-driven or behavior-driven development?",
                    "What's your go-to debugging strategy?"
                ],
                "flirty_followups": [
                    "I'm already imagining us pairing on some complex smart contracts",
                    "Your coding style is making me want to collaborate on the perfect dApp",
                    "I have a feeling we'd have amazing chemistry in the development process",
                    "Your technical expertise is giving me serious intellectual crushes",
                    "I'm getting excited thinking about all the projects we could build together"
                ]
            },
            "crypto": {
                "questions": [
                    "What's your most successful crypto trade?",
                    "If you could only hold one crypto for the next 5 years, what would it be?",
                    "What's your take on the current market cycle?",
                    "Do you prefer fundamental or technical analysis?",
                    "What's the most interesting crypto narrative you're following?"
                ],
                "flirty_followups": [
                    "I'm already planning our first crypto research session together",
                    "Your market insights are incredibly attractive",
                    "I can picture us analyzing charts and finding the next gem together",
                    "Your trading strategies are making me want to learn from you",
                    "I'm getting excited thinking about all the alpha we could discover together"
                ]
            },
            "blockchain": {
                "questions": [
                    "What's your favorite blockchain ecosystem and why?",
                    "If you could improve one blockchain, which would it be and how?",
                    "What's the most exciting blockchain innovation you've seen?",
                    "Do you prefer layer 1 or layer 2 solutions?",
                    "What's your take on the future of blockchain scalability?"
                ],
                "flirty_followups": [
                    "I'm already imagining our future discussions about blockchain architecture",
                    "Your blockchain insights are making me want to dive deeper into the tech with you",
                    "I have a feeling we'd have amazing debates about consensus mechanisms",
                    "Your technical knowledge is giving me serious brain stimulation",
                    "I'm getting excited thinking about all the blockchain concepts we could explore together"
                ]
            }
        }
    
    def generate_contextual_flirty_message(
        self,
        context: ConversationContext,
        flirting_style: FlirtingStyle,
        incoming_message: Optional[str] = None,
        topic_context: Optional[str] = None
    ) -> str:
        """Generate a context-aware flirty message"""
        
        # Analyze the conversation context
        conversation_analysis = self._analyze_conversation_context(context)
        
        # Determine the appropriate flirting approach
        approach = self._determine_flirting_approach(
            conversation_analysis, flirting_style, incoming_message
        )
        
        # Generate the message based on the approach
        if approach == "question_based":
            return self._generate_question_based_message(
                context, flirting_style, topic_context
            )
        elif approach == "compliment_based":
            return self._generate_compliment_based_message(
                context, flirting_style, incoming_message
            )
        elif approach == "playful_teasing":
            return self._generate_playful_teasing_message(
                context, flirting_style, conversation_analysis
            )
        elif approach == "shared_interest":
            return self._generate_shared_interest_message(
                context, flirting_style, conversation_analysis
            )
        else:
            return self._generate_general_flirty_message(
                context, flirting_style, incoming_message
            )
    
    def generate_opening_message(
        self,
        match: PotentialMatch,
        user_preferences: UserPreferences,
        flirting_style: FlirtingStyle
    ) -> str:
        """Generate an opening message for a new match"""
        
        # Use the dating agent's conversation starter generation
        starters = self.dating_agent.generate_conversation_starter(
            match, user_preferences, flirting_style
        )
        
        # Enhance with flirting style
        if starters:
            base_message = starters[0]
            enhanced_message = self._enhance_with_flirting_style(
                base_message, flirting_style, match
            )
            return enhanced_message
        
        # Fallback to template-based approach
        return self._generate_template_opener(match, flirting_style)
    
    def generate_follow_up_message(
        self,
        context: ConversationContext,
        flirting_style: FlirtingStyle,
        last_message: str
    ) -> str:
        """Generate a follow-up message based on the conversation flow"""
        
        # Analyze the last message for response cues
        response_cues = self._analyze_message_for_cues(last_message)
        
        # Determine response strategy
        if response_cues.get("question_asked"):
            return self._generate_question_response(context, flirting_style, last_message)
        elif response_cues.get("compliment_given"):
            return self._generate_compliment_response(context, flirting_style, last_message)
        elif response_cues.get("topic_introduced"):
            return self._generate_topic_response(context, flirting_style, response_cues["topic"])
        else:
            return self._generate_continuation_message(context, flirting_style, last_message)
    
    def _analyze_conversation_context(self, context: ConversationContext) -> Dict[str, Any]:
        """Analyze the current conversation context"""
        
        analysis = {
            "message_count": len(context.messages),
            "conversation_tone": context.conversation_tone,
            "topics_discussed": context.topics_discussed,
            "engagement_level": "low",
            "response_patterns": [],
            "shared_interests": []
        }
        
        if context.messages:
            recent_messages = context.messages[-5:]
            
            # Analyze engagement level
            message_lengths = [len(msg.content.split()) for msg in recent_messages]
            avg_length = sum(message_lengths) / len(message_lengths)
            
            if avg_length > 15:
                analysis["engagement_level"] = "high"
            elif avg_length > 8:
                analysis["engagement_level"] = "medium"
            
            # Extract topics from recent messages
            topics = self._extract_topics_from_messages(recent_messages)
            analysis["topics_discussed"] = topics
            
            # Find shared interests
            if context.match_profile:
                analysis["shared_interests"] = context.match_profile.match_reasons[:3]
        
        return analysis
    
    def _determine_flirting_approach(
        self, 
        conversation_analysis: Dict[str, Any],
        flirting_style: FlirtingStyle,
        incoming_message: Optional[str]
    ) -> str:
        """Determine the best flirting approach based on context"""
        
        message_count = conversation_analysis["message_count"]
        engagement_level = conversation_analysis["engagement_level"]
        topics_discussed = conversation_analysis["topics_discussed"]
        
        # Early conversation - focus on questions and shared interests
        if message_count < 3:
            if topics_discussed:
                return "shared_interest"
            else:
                return "question_based"
        
        # Medium engagement - use compliments and playful teasing
        elif engagement_level == "medium":
            if incoming_message and any(word in incoming_message.lower() for word in ["love", "enjoy", "passion"]):
                return "compliment_based"
            else:
                return "playful_teasing"
        
        # High engagement - can be more direct and bold
        elif engagement_level == "high":
            if flirting_style.intensity == "bold":
                return "compliment_based"
            else:
                return "shared_interest"
        
        # Default approach
        return "general"
    
    def _generate_question_based_message(
        self,
        context: ConversationContext,
        flirting_style: FlirtingStyle,
        topic_context: Optional[str]
    ) -> str:
        """Generate a question-based flirty message"""
        
        # Get relevant questions based on topic
        if topic_context and topic_context in self.context_patterns:
            questions = self.context_patterns[topic_context]["questions"]
            flirty_followups = self.context_patterns[topic_context]["flirty_followups"]
            
            question = random.choice(questions)
            followup = random.choice(flirty_followups)
            
            return f"{question} {followup}"
        
        # Generic engaging questions
        generic_questions = [
            "What's something you're really passionate about that most people don't know?",
            "If you could have any superpower for a day, what would it be and why?",
            "What's the most spontaneous thing you've ever done?",
            "If you could travel anywhere right now, where would you go and what would you do there?",
            "What's something that always makes you smile, no matter what?"
        ]
        
        question = random.choice(generic_questions)
        
        # Add flirty followup based on style
        if flirting_style.intensity == "bold":
            followup = "I'm already imagining all the interesting conversations we could have about this."
        elif flirting_style.intensity == "moderate":
            followup = "I have a feeling your answer is going to be really interesting."
        else:
            followup = "I'm curious to hear what you think."
        
        return f"{question} {followup}"
    
    def _generate_compliment_based_message(
        self,
        context: ConversationContext,
        flirting_style: FlirtingStyle,
        incoming_message: Optional[str]
    ) -> str:
        """Generate a compliment-based flirty message"""
        
        if not context.match_profile:
            return "You seem like a really interesting person. I'd love to get to know you better!"
        
        # Get appropriate compliment templates
        intensity = flirting_style.intensity
        templates = self.flirting_templates[intensity]["compliments"]
        
        # Find a topic to compliment about
        topic = self._extract_compliment_topic(incoming_message, context)
        
        if topic and templates:
            compliment = random.choice(templates).format(topic=topic)
            return compliment
        
        # Fallback compliments
        fallback_compliments = {
            "subtle": "I really appreciate your perspective on things.",
            "moderate": "I find your way of thinking really attractive.",
            "bold": "Your intelligence and personality are incredibly appealing."
        }
        
        return fallback_compliments.get(intensity, fallback_compliments["moderate"])
    
    def _generate_playful_teasing_message(
        self,
        context: ConversationContext,
        flirting_style: FlirtingStyle,
        conversation_analysis: Dict[str, Any]
    ) -> str:
        """Generate a playful teasing message"""
        
        topics = conversation_analysis.get("topics_discussed", [])
        
        if "music" in topics:
            return "I'm already imagining us having epic music debates. You seem like the type who'd challenge my favorite artists, and I'm here for it! 🎵"
        elif "travel" in topics:
            return "I have a feeling you're the kind of person who'd convince me to book a last-minute trip somewhere amazing. Should I be worried? ✈️"
        elif "food" in topics:
            return "I'm betting you have strong opinions about food. Care to prove me right over dinner sometime? 😏"
        else:
            playful_messages = [
                "I'm getting the vibe that you're going to be trouble in the best possible way.",
                "Something tells me you have strong opinions about things. I love that.",
                "I can already tell we're going to have some great debates about everything.",
                "You seem like exactly the kind of person who'd keep me on my toes.",
                "I'm already imagining all the interesting conversations we could have."
            ]
            return random.choice(playful_messages)
    
    def _generate_shared_interest_message(
        self,
        context: ConversationContext,
        flirting_style: FlirtingStyle,
        conversation_analysis: Dict[str, Any]
    ) -> str:
        """Generate a message based on shared interests"""
        
        shared_interests = conversation_analysis.get("shared_interests", [])
        
        if shared_interests:
            interest = shared_interests[0]
            
            if flirting_style.intensity == "bold":
                return f"I'm already excited thinking about all the ways we could explore our shared love of {interest} together. This is going to be fun! 😊"
            elif flirting_style.intensity == "moderate":
                return f"I love that we both enjoy {interest}. I have a feeling we could have some amazing conversations about it."
            else:
                return f"It's great that we both like {interest}. I'd love to hear more about your perspective on it."
        
        return "I'm really enjoying our conversation so far. You seem like someone I could talk to for hours."
    
    def _generate_general_flirty_message(
        self,
        context: ConversationContext,
        flirting_style: FlirtingStyle,
        incoming_message: Optional[str]
    ) -> str:
        """Generate a general flirty message"""
        
        intensity = flirting_style.intensity
        templates = self.flirting_templates[intensity]["openers"]
        
        if templates:
            opener = random.choice(templates)
            
            # Add personalization based on match profile
            if context.match_profile:
                name = context.match_profile.name.split()[0] if context.match_profile.name else "you"
                return f"{opener} {name}, and I'm really looking forward to getting to know you better."
            
            return f"{opener} getting to know you better."
        
        # Fallback message
        return "I'm really enjoying our conversation. You seem like someone special."
    
    def _generate_template_opener(self, match: PotentialMatch, flirting_style: FlirtingStyle) -> str:
        """Generate an opener using templates"""
        
        intensity = flirting_style.intensity
        name = match.name.split()[0] if match.name else "there"
        
        if intensity == "bold":
            return f"Hey {name}! I have to say, your profile really caught my attention. I'm already imagining all the interesting conversations we could have. What's something you're passionate about that you could talk about for hours?"
        elif intensity == "moderate":
            return f"Hi {name}! Your profile is really intriguing. I'd love to get to know you better. What's something that always makes your day better?"
        else:
            return f"Hello {name}! I noticed we might have some things in common. I'd love to learn more about your interests. What's something you're really into right now?"
    
    def _enhance_with_flirting_style(
        self, 
        base_message: str, 
        flirting_style: FlirtingStyle, 
        match: PotentialMatch
    ) -> str:
        """Enhance a base message with flirting style"""
        
        intensity = flirting_style.intensity
        name = match.name.split()[0] if match.name else "you"
        
        if intensity == "bold":
            enhancement = f"I'm already getting excited thinking about our future conversations! 😊"
        elif intensity == "moderate":
            enhancement = f"I have a feeling we're going to get along really well."
        else:
            enhancement = f"I'm looking forward to getting to know you better."
        
        return f"{base_message} {enhancement}"
    
    def _analyze_message_for_cues(self, message: str) -> Dict[str, Any]:
        """Analyze a message for response cues"""
        
        message_lower = message.lower()
        
        cues = {
            "question_asked": any(word in message_lower for word in ["?", "what", "how", "why", "when", "where", "which"]),
            "compliment_given": any(word in message_lower for word in ["beautiful", "amazing", "wonderful", "great", "love", "impressed"]),
            "topic_introduced": None,
            "emotional_tone": "neutral"
        }
        
        # Detect topic introduction
        for topic, pattern in self.context_patterns.items():
            if topic in message_lower:
                cues["topic_introduced"] = topic
                break
        
        # Detect emotional tone
        positive_words = ["happy", "excited", "love", "amazing", "wonderful", "great"]
        negative_words = ["sad", "upset", "disappointed", "frustrated", "angry"]
        
        if any(word in message_lower for word in positive_words):
            cues["emotional_tone"] = "positive"
        elif any(word in message_lower for word in negative_words):
            cues["emotional_tone"] = "negative"
        
        return cues
    
    def _extract_compliment_topic(
        self, 
        message: Optional[str], 
        context: ConversationContext
    ) -> Optional[str]:
        """Extract a topic for complimenting from the message or context"""
        
        if message:
            for topic in self.context_patterns.keys():
                if topic in message.lower():
                    return topic
        
        # Use topics from conversation context
        if context.topics_discussed:
            return context.topics_discussed[0]
        
        # Use shared interests from match profile
        if context.match_profile and context.match_profile.match_reasons:
            return context.match_profile.match_reasons[0].split()[-1]  # Get last word as topic
        
        return None
    
    def _extract_topics_from_messages(self, messages: List[ChatMessage]) -> List[str]:
        """Extract topics from a list of messages"""
        
        topics = []
        all_content = " ".join([msg.content.lower() for msg in messages])
        
        for topic in self.context_patterns.keys():
            if topic in all_content:
                topics.append(topic)
        
        return topics
