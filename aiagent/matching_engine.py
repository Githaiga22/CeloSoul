"""
Matching Engine for Compatibility Analysis
"""
from typing import List, Dict, Any, Tuple, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime

from models import (
    UserProfile, UserPreferences, PotentialMatch, MatchAnalysis,
    PersonalityType, MusicGenre, BehaviorSignal
)

class MatchingEngine:
    """Engine for analyzing compatibility between users and potential matches"""
    
    def __init__(self):
        """Initialize the matching engine"""
        self.preference_weights = {
            "music_taste": 0.2,
            "hobbies": 0.25,
            "behavior_signals": 0.3,
            "personality": 0.15,
            "lifestyle": 0.1
        }
        
        # Initialize text vectorizer for bio similarity
        self.vectorizer = TfidfVectorizer(
            max_features=100,
            stop_words='english',
            ngram_range=(1, 2)
        )
    
    def analyze_compatibility(
        self, 
        user_profile: UserProfile, 
        potential_match: Dict[str, Any]
    ) -> MatchAnalysis:
        """Analyze compatibility between user and potential match"""
        
        # Calculate individual compatibility scores
        music_score = self._calculate_music_compatibility(
            user_profile.preferences.music_genres,
            potential_match.get("music_genres", [])
        )
        
        hobby_score = self._calculate_hobby_compatibility(
            user_profile.preferences.hobbies,
            potential_match.get("hobbies", [])
        )
        
        personality_score = self._calculate_personality_compatibility(
            user_profile.preferences.personality_types,
            potential_match.get("personality_types", [])
        )
        
        behavior_score = self._calculate_behavior_compatibility(
            user_profile.preferences.behavior_signals,
            potential_match.get("behavior_signals", [])
        )
        
        lifestyle_score = self._calculate_lifestyle_compatibility(
            user_profile.preferences.lifestyle_preferences,
            potential_match.get("lifestyle_preferences", [])
        )
        
        # Calculate bio similarity
        bio_similarity = self._calculate_bio_similarity(
            user_profile.bio,
            potential_match.get("bio", "")
        )
        
        # Calculate tech compatibility if Web3 preferences exist
        tech_score = 0.0
        blockchain_score = 0.0
        dev_synergy = 0.0
        trading_alignment = 0.0
        community_overlap = 0.0
        
        if user_profile.preferences.web3_preferences and potential_match.get("web3_preferences"):
            tech_score = self._calculate_tech_compatibility(
                user_profile.preferences.web3_preferences,
                potential_match.get("web3_preferences")
            )
            blockchain_score = self._calculate_blockchain_compatibility(
                user_profile.preferences.web3_preferences,
                potential_match.get("web3_preferences")
            )
            dev_synergy = self._calculate_dev_synergy(
                user_profile.preferences.web3_preferences,
                potential_match.get("web3_preferences")
            )
            trading_alignment = self._calculate_trading_alignment(
                user_profile.preferences.web3_preferences,
                potential_match.get("web3_preferences")
            )
            community_overlap = self._calculate_community_overlap(
                user_profile.preferences.web3_preferences,
                potential_match.get("web3_preferences")
            )
        
        # Weighted overall compatibility score
        overall_score = (
            music_score * self.preference_weights["music_taste"] +
            hobby_score * self.preference_weights["hobbies"] +
            behavior_score * self.preference_weights["behavior_signals"] +
            personality_score * self.preference_weights["personality"] +
            lifestyle_score * self.preference_weights["lifestyle"] +
            bio_similarity * 0.1 +  # Bio similarity as additional factor
            tech_score * 0.2  # Tech compatibility weight
        )
        
        # Find shared interests
        shared_interests = self._find_shared_interests(user_profile, potential_match)
        
        # Generate match reasons
        match_reasons = self._generate_match_reasons(
            music_score, hobby_score, personality_score, 
            behavior_score, lifestyle_score, shared_interests
        )
        
        # Identify potential issues
        potential_issues = self._identify_potential_issues(
            user_profile.preferences, potential_match
        )
        
        # Generate conversation suggestions
        conversation_suggestions = self._generate_conversation_suggestions(
            shared_interests, potential_match
        )
        
        # Recommend approach
        recommended_approach = self._recommend_approach(
            behavior_score, personality_score, overall_score
        )
        
        return MatchAnalysis(
            compatibility_score=overall_score,
            shared_interests=shared_interests,
            personality_compatibility=personality_score,
            lifestyle_compatibility=lifestyle_score,
            communication_style_match=behavior_score,
            potential_issues=potential_issues,
            conversation_suggestions=conversation_suggestions,
            recommended_approach=recommended_approach,
            
            # Web3/tech compatibility
            tech_compatibility_score=tech_score,
            blockchain_ecosystem_match=blockchain_score,
            development_synergy=dev_synergy,
            trading_philosophy_alignment=trading_alignment,
            community_overlap=community_overlap,
            
            # Web3-specific insights
            shared_protocols=self._find_shared_protocols(user_profile, potential_match),
            complementary_skills=self._find_complementary_skills(user_profile, potential_match),
            potential_collaborations=self._suggest_collaborations(user_profile, potential_match),
            web3_conversation_starters=self._generate_web3_starters(user_profile, potential_match)
        )
    
    def find_best_matches(
        self, 
        user_profile: UserProfile, 
        potential_matches: List[Dict[str, Any]],
        limit: int = 10
    ) -> List[PotentialMatch]:
        """Find the best matches for a user from a list of potential matches"""
        
        scored_matches = []
        
        for match_data in potential_matches:
            analysis = self.analyze_compatibility(user_profile, match_data)
            
            if analysis.compatibility_score >= 0.3:  # Minimum threshold
                potential_match = PotentialMatch(
                    user_id=match_data.get("user_id", ""),
                    name=match_data.get("name", ""),
                    age=match_data.get("age", 0),
                    location=match_data.get("location", ""),
                    bio=match_data.get("bio", ""),
                    photos=match_data.get("photos", []),
                    compatibility_score=analysis.compatibility_score,
                    match_reasons=analysis.conversation_suggestions[:3],
                    conversation_starters=self._generate_conversation_starters(
                        analysis.shared_interests, match_data
                    )
                )
                scored_matches.append(potential_match)
        
        # Sort by compatibility score and return top matches
        scored_matches.sort(key=lambda x: x.compatibility_score, reverse=True)
        return scored_matches[:limit]
    
    def _calculate_music_compatibility(
        self, 
        user_genres: List[MusicGenre], 
        match_genres: List[str]
    ) -> float:
        """Calculate music taste compatibility"""
        if not user_genres or not match_genres:
            return 0.5  # Neutral score if no data
        
        user_genre_values = [g.value for g in user_genres]
        match_genre_values = [g.lower().replace(" ", "_") for g in match_genres]
        
        # Calculate Jaccard similarity
        intersection = len(set(user_genre_values) & set(match_genre_values))
        union = len(set(user_genre_values) | set(match_genre_values))
        
        return intersection / union if union > 0 else 0.0
    
    def _calculate_hobby_compatibility(
        self, 
        user_hobbies: List[str], 
        match_hobbies: List[str]
    ) -> float:
        """Calculate hobby compatibility"""
        if not user_hobbies or not match_hobbies:
            return 0.5
        
        user_hobbies_lower = [h.lower() for h in user_hobbies]
        match_hobbies_lower = [h.lower() for h in match_hobbies]
        
        # Calculate Jaccard similarity
        intersection = len(set(user_hobbies_lower) & set(match_hobbies_lower))
        union = len(set(user_hobbies_lower) | set(match_hobbies_lower))
        
        return intersection / union if union > 0 else 0.0
    
    def _calculate_personality_compatibility(
        self, 
        user_personality: List[PersonalityType], 
        match_personality: List[str]
    ) -> float:
        """Calculate personality compatibility"""
        if not user_personality or not match_personality:
            return 0.5
        
        user_personality_values = [p.value for p in user_personality]
        match_personality_values = [p.lower() for p in match_personality]
        
        # Some personality types complement each other
        complementary_pairs = [
            ("extrovert", "introvert"),
            ("analytical", "creative"),
            ("adventurous", "conservative")
        ]
        
        # Check for direct matches
        direct_match = len(set(user_personality_values) & set(match_personality_values)) > 0
        
        # Check for complementary matches
        complementary_match = False
        for pair in complementary_pairs:
            if (pair[0] in user_personality_values and pair[1] in match_personality_values) or \
               (pair[1] in user_personality_values and pair[0] in match_personality_values):
                complementary_match = True
                break
        
        if direct_match:
            return 0.8
        elif complementary_match:
            return 0.6
        else:
            return 0.3
    
    def _calculate_behavior_compatibility(
        self, 
        user_behavior: List[BehaviorSignal], 
        match_behavior: List[str]
    ) -> float:
        """Calculate behavior signal compatibility"""
        if not user_behavior or not match_behavior:
            return 0.5
        
        user_behavior_values = [b.value for b in user_behavior]
        match_behavior_values = [b.lower() for b in match_behavior]
        
        # Behavior signals that work well together
        compatible_pairs = [
            ("humorous", "playful"),
            ("intellectual", "analytical"),
            ("direct", "responsive"),
            ("emotional", "subtle")
        ]
        
        # Calculate compatibility score
        compatibility_score = 0.0
        
        # Direct matches
        direct_matches = len(set(user_behavior_values) & set(match_behavior_values))
        compatibility_score += direct_matches * 0.3
        
        # Compatible pairs
        for pair in compatible_pairs:
            if (pair[0] in user_behavior_values and pair[1] in match_behavior_values) or \
               (pair[1] in user_behavior_values and pair[0] in match_behavior_values):
                compatibility_score += 0.2
        
        return min(compatibility_score, 1.0)
    
    def _calculate_lifestyle_compatibility(
        self, 
        user_lifestyle: List[str], 
        match_lifestyle: List[str]
    ) -> float:
        """Calculate lifestyle compatibility"""
        if not user_lifestyle or not match_lifestyle:
            return 0.5
        
        user_lifestyle_lower = [l.lower() for l in user_lifestyle]
        match_lifestyle_lower = [l.lower() for l in match_lifestyle]
        
        # Calculate Jaccard similarity
        intersection = len(set(user_lifestyle_lower) & set(match_lifestyle_lower))
        union = len(set(user_lifestyle_lower) | set(match_lifestyle_lower))
        
        return intersection / union if union > 0 else 0.0
    
    def _calculate_bio_similarity(self, user_bio: str, match_bio: str) -> float:
        """Calculate bio similarity using TF-IDF"""
        if not user_bio or not match_bio:
            return 0.5
        
        try:
            # Fit and transform the bios
            bios = [user_bio, match_bio]
            tfidf_matrix = self.vectorizer.fit_transform(bios)
            
            # Calculate cosine similarity
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return similarity
        except:
            return 0.5  # Fallback if vectorization fails
    
    def _find_shared_interests(
        self, 
        user_profile: UserProfile, 
        potential_match: Dict[str, Any]
    ) -> List[str]:
        """Find shared interests between user and potential match"""
        shared = []
        
        # Music interests
        user_music = [g.value for g in user_profile.preferences.music_genres]
        match_music = [g.lower().replace(" ", "_") for g in potential_match.get("music_genres", [])]
        shared_music = set(user_music) & set(match_music)
        shared.extend([f"Both love {music.replace('_', ' ')} music" for music in shared_music])
        
        # Hobbies
        user_hobbies = [h.lower() for h in user_profile.preferences.hobbies]
        match_hobbies = [h.lower() for h in potential_match.get("hobbies", [])]
        shared_hobbies = set(user_hobbies) & set(match_hobbies)
        shared.extend([f"Both enjoy {hobby}" for hobby in shared_hobbies])
        
        # Personality traits
        user_personality = [p.value for p in user_profile.preferences.personality_types]
        match_personality = [p.lower() for p in potential_match.get("personality_types", [])]
        shared_personality = set(user_personality) & set(match_personality)
        shared.extend([f"Both are {personality}" for personality in shared_personality])
        
        return shared[:5]  # Limit to top 5 shared interests
    
    def _generate_match_reasons(
        self, 
        music_score: float, 
        hobby_score: float, 
        personality_score: float,
        behavior_score: float, 
        lifestyle_score: float,
        shared_interests: List[str]
    ) -> List[str]:
        """Generate reasons why this is a good match"""
        reasons = []
        
        if music_score > 0.7:
            reasons.append("Great music taste compatibility")
        if hobby_score > 0.7:
            reasons.append("Shared hobbies and interests")
        if personality_score > 0.7:
            reasons.append("Complementary personalities")
        if behavior_score > 0.7:
            reasons.append("Compatible communication styles")
        if lifestyle_score > 0.7:
            reasons.append("Similar lifestyle preferences")
        
        reasons.extend(shared_interests[:2])  # Add top shared interests
        
        return reasons[:5]  # Limit to top 5 reasons
    
    def _identify_potential_issues(
        self, 
        user_preferences: UserPreferences, 
        potential_match: Dict[str, Any]
    ) -> List[str]:
        """Identify potential compatibility issues"""
        issues = []
        
        # Check deal breakers
        match_attributes = []
        match_attributes.extend(potential_match.get("music_genres", []))
        match_attributes.extend(potential_match.get("hobbies", []))
        match_attributes.extend(potential_match.get("lifestyle_preferences", []))
        
        for deal_breaker in user_preferences.deal_breakers:
            if deal_breaker.lower() in [attr.lower() for attr in match_attributes]:
                issues.append(f"Potential deal breaker: {deal_breaker}")
        
        # Check for conflicting personality types
        if BehaviorSignal.DIRECT in user_preferences.behavior_signals and \
           "subtle" in potential_match.get("behavior_signals", []):
            issues.append("Different communication styles - direct vs subtle")
        
        # Check age preferences
        if user_preferences.age_range:
            min_age, max_age = user_preferences.age_range
            match_age = potential_match.get("age", 0)
            if match_age < min_age or match_age > max_age:
                issues.append(f"Age outside preferred range ({min_age}-{max_age})")
        
        return issues
    
    def _generate_conversation_suggestions(
        self, 
        shared_interests: List[str], 
        potential_match: Dict[str, Any]
    ) -> List[str]:
        """Generate conversation starter suggestions"""
        suggestions = []
        
        # Use shared interests for conversation starters
        for interest in shared_interests[:3]:
            if "music" in interest:
                suggestions.append(f"Ask about their favorite {interest.split()[-2]} artists")
            elif "enjoy" in interest:
                hobby = interest.split("enjoy")[-1].strip()
                suggestions.append(f"Share experiences about {hobby}")
            elif "are" in interest:
                trait = interest.split("are")[-1].strip()
                suggestions.append(f"Discuss what being {trait} means to them")
        
        # Generic suggestions based on bio
        bio = potential_match.get("bio", "")
        if "travel" in bio.lower():
            suggestions.append("Ask about their favorite travel destination")
        if "food" in bio.lower() or "cook" in bio.lower():
            suggestions.append("Share favorite recipes or restaurants")
        if "work" in bio.lower() or "career" in bio.lower():
            suggestions.append("Ask about their professional interests")
        
        return suggestions[:5]
    
    def _recommend_approach(
        self, 
        behavior_score: float, 
        personality_score: float, 
        overall_score: float
    ) -> str:
        """Recommend the best approach for starting conversation"""
        
        if overall_score > 0.8:
            return "confident"  # High compatibility, be confident
        elif behavior_score > 0.7:
            return "playful"  # Good communication match, be playful
        elif personality_score > 0.7:
            return "genuine"  # Good personality match, be genuine
        elif overall_score > 0.5:
            return "casual"  # Moderate compatibility, keep it casual
        else:
            return "cautious"  # Low compatibility, be cautious
    
    def _generate_conversation_starters(
        self, 
        shared_interests: List[str], 
        potential_match: Dict[str, Any]
    ) -> List[str]:
        """Generate specific conversation starter messages"""
        starters = []
        
        # Use shared interests
        for interest in shared_interests[:2]:
            if "music" in interest:
                starters.append(f"I noticed we both love {interest.split()[-2]} music! Who's your favorite artist?")
            elif "enjoy" in interest:
                hobby = interest.split("enjoy")[-1].strip()
                starters.append(f"Hey! I saw you're into {hobby} too. What got you into it?")
        
        # Use bio information
        bio = potential_match.get("bio", "")
        name = potential_match.get("name", "")
        
        if "travel" in bio.lower():
            starters.append(f"Hi {name}! Your bio mentions travel - what's been your favorite adventure so far?")
        elif "food" in bio.lower():
            starters.append(f"Hey {name}! I'm always looking for new food recommendations. What's your go-to dish?")
        else:
            starters.append(f"Hi {name}! Your profile caught my attention. What's something you're passionate about?")
        
        return starters[:3]  # Return top 3 starters
    
    def _calculate_tech_compatibility(self, user_web3_prefs, match_web3_prefs):
        """Calculate overall tech compatibility score"""
        if not user_web3_prefs or not match_web3_prefs:
            return 0.5
        
        # Combine all tech compatibility scores
        blockchain_score = self._calculate_blockchain_compatibility(user_web3_prefs, match_web3_prefs)
        dev_score = self._calculate_dev_synergy(user_web3_prefs, match_web3_prefs)
        trading_score = self._calculate_trading_alignment(user_web3_prefs, match_web3_prefs)
        community_score = self._calculate_community_overlap(user_web3_prefs, match_web3_prefs)
        
        return (blockchain_score + dev_score + trading_score + community_score) / 4
    
    def _calculate_blockchain_compatibility(self, user_web3_prefs, match_web3_prefs):
        """Calculate blockchain ecosystem compatibility"""
        if not user_web3_prefs.favorite_chains or not match_web3_prefs.favorite_chains:
            return 0.5
        
        user_chains = [chain.value for chain in user_web3_prefs.favorite_chains]
        match_chains = [chain.value for chain in match_web3_prefs.favorite_chains]
        
        # Calculate Jaccard similarity
        intersection = len(set(user_chains) & set(match_chains))
        union = len(set(user_chains) | set(match_chains))
        
        return intersection / union if union > 0 else 0.0
    
    def _calculate_dev_synergy(self, user_web3_prefs, match_web3_prefs):
        """Calculate development synergy score"""
        if not user_web3_prefs.programming_languages or not match_web3_prefs.programming_languages:
            return 0.5
        
        user_langs = [lang.value for lang in user_web3_prefs.programming_languages]
        match_langs = [lang.value for lang in match_web3_prefs.programming_languages]
        
        # Calculate overlap
        intersection = len(set(user_langs) & set(match_langs))
        union = len(set(user_langs) | set(match_langs))
        
        base_score = intersection / union if union > 0 else 0.0
        
        # Bonus for complementary skills (e.g., frontend + backend)
        frontend_langs = ["javascript", "typescript", "react", "vue"]
        backend_langs = ["solidity", "python", "rust", "go"]
        
        user_has_frontend = any(lang in frontend_langs for lang in user_langs)
        user_has_backend = any(lang in backend_langs for lang in user_langs)
        match_has_frontend = any(lang in frontend_langs for lang in match_langs)
        match_has_backend = any(lang in backend_langs for lang in match_langs)
        
        if (user_has_frontend and match_has_backend) or (user_has_backend and match_has_frontend):
            base_score += 0.2  # Bonus for complementary skills
        
        return min(base_score, 1.0)
    
    def _calculate_trading_alignment(self, user_web3_prefs, match_web3_prefs):
        """Calculate trading philosophy alignment"""
        if not user_web3_prefs.trading_style or not match_web3_prefs.trading_style:
            return 0.5
        
        # Compatible trading styles
        compatible_pairs = [
            ("hodler", "hodler"),
            ("trader", "trader"),
            ("builder", "builder"),
            ("degen", "degen"),
            ("hodler", "builder"),  # Both long-term focused
            ("trader", "degen"),    # Both active trading
        ]
        
        user_style = user_web3_prefs.trading_style.value
        match_style = match_web3_prefs.trading_style.value
        
        if (user_style, match_style) in compatible_pairs or (match_style, user_style) in compatible_pairs:
            return 0.8
        elif user_style == match_style:
            return 0.9
        else:
            return 0.3
    
    def _calculate_community_overlap(self, user_web3_prefs, match_web3_prefs):
        """Calculate Web3 community overlap"""
        if not user_web3_prefs.web3_communities or not match_web3_prefs.web3_communities:
            return 0.5
        
        user_communities = user_web3_prefs.web3_communities
        match_communities = match_web3_prefs.web3_communities
        
        # Calculate Jaccard similarity
        intersection = len(set(user_communities) & set(match_communities))
        union = len(set(user_communities) | set(match_communities))
        
        return intersection / union if union > 0 else 0.0
    
    def _find_shared_protocols(self, user_profile, potential_match):
        """Find shared DeFi protocols and Web3 interests"""
        shared = []
        
        if user_profile.preferences.web3_preferences and potential_match.get("web3_preferences"):
            user_prefs = user_profile.preferences.web3_preferences
            match_prefs = potential_match["web3_preferences"]
            
            # Shared chains
            if user_prefs.favorite_chains and match_prefs.get("favorite_chains"):
                user_chains = [chain.value for chain in user_prefs.favorite_chains]
                match_chains = match_prefs["favorite_chains"]
                shared_chains = set(user_chains) & set(match_chains)
                shared.extend([f"Both love {chain} ecosystem" for chain in shared_chains])
            
            # Shared programming languages
            if user_prefs.programming_languages and match_prefs.get("programming_languages"):
                user_langs = [lang.value for lang in user_prefs.programming_languages]
                match_langs = match_prefs["programming_languages"]
                shared_langs = set(user_langs) & set(match_langs)
                shared.extend([f"Both code in {lang}" for lang in shared_langs])
        
        return shared[:3]
    
    def _find_complementary_skills(self, user_profile, potential_match):
        """Find complementary technical skills"""
        complementary = []
        
        if user_profile.preferences.web3_preferences and potential_match.get("web3_preferences"):
            user_prefs = user_profile.preferences.web3_preferences
            match_prefs = potential_match["web3_preferences"]
            
            # Frontend/Backend complementarity
            frontend_langs = ["javascript", "typescript", "react", "vue"]
            backend_langs = ["solidity", "python", "rust", "go"]
            
            user_langs = [lang.value for lang in user_prefs.programming_languages] if user_prefs.programming_languages else []
            match_langs = match_prefs.get("programming_languages", [])
            
            user_has_frontend = any(lang in frontend_langs for lang in user_langs)
            user_has_backend = any(lang in backend_langs for lang in user_langs)
            match_has_frontend = any(lang in frontend_langs for lang in match_langs)
            match_has_backend = any(lang in backend_langs for lang in match_langs)
            
            if user_has_frontend and match_has_backend:
                complementary.append("Perfect frontend/backend combination")
            elif user_has_backend and match_has_frontend:
                complementary.append("Great full-stack development potential")
            
            # Trading style complementarity
            if user_prefs.trading_style and match_prefs.get("trading_style"):
                if user_prefs.trading_style.value == "hodler" and match_prefs["trading_style"] == "trader":
                    complementary.append("Balanced hodler/trader perspectives")
                elif user_prefs.trading_style.value == "builder" and match_prefs["trading_style"] in ["hodler", "trader"]:
                    complementary.append("Builder with investor mindset")
        
        return complementary[:2]
    
    def _suggest_collaborations(self, user_profile, potential_match):
        """Suggest potential collaboration opportunities"""
        collaborations = []
        
        if user_profile.preferences.web3_preferences and potential_match.get("web3_preferences"):
            user_prefs = user_profile.preferences.web3_preferences
            match_prefs = potential_match["web3_preferences"]
            
            # DeFi collaboration
            if user_prefs.defi_experience.value in ["intermediate", "expert"] and match_prefs.get("defi_experience") in ["intermediate", "expert"]:
                collaborations.append("DeFi protocol development")
            
            # NFT collaboration
            if user_prefs.nft_interests and match_prefs.get("nft_interests"):
                shared_nft_interests = set(user_prefs.nft_interests) & set(match_prefs["nft_interests"])
                if shared_nft_interests:
                    collaborations.append("NFT project collaboration")
            
            # Hackathon collaboration
            if user_prefs.programming_languages and match_prefs.get("programming_languages"):
                collaborations.append("Hackathon team formation")
            
            # Community building
            if user_prefs.web3_communities and match_prefs.get("web3_communities"):
                collaborations.append("Community building initiatives")
        
        return collaborations[:3]
    
    def _generate_web3_starters(self, user_profile, potential_match):
        """Generate Web3-themed conversation starters"""
        starters = []
        
        if user_profile.preferences.web3_preferences and potential_match.get("web3_preferences"):
            user_prefs = user_profile.preferences.web3_preferences
            match_prefs = potential_match["web3_preferences"]
            
            # Based on shared blockchain interests
            if user_prefs.favorite_chains and match_prefs.get("favorite_chains"):
                user_chains = [chain.value for chain in user_prefs.favorite_chains]
                match_chains = match_prefs["favorite_chains"]
                shared_chains = set(user_chains) & set(match_chains)
                
                for chain in list(shared_chains)[:1]:  # Take first shared chain
                    if chain == "celo":
                        starters.append("Hey! I noticed we both love the Celo ecosystem. What's your favorite Celo dApp? 🟢")
                    elif chain == "ethereum":
                        starters.append("Your Ethereum game is strong! What's your favorite DeFi protocol? 🔷")
            
            # Based on development interests
            if user_prefs.programming_languages and match_prefs.get("programming_languages"):
                user_langs = [lang.value for lang in user_prefs.programming_languages]
                if "solidity" in user_langs:
                    starters.append("Your profile screams 'smart contract developer'! What's the most complex contract you've deployed? ⚡")
            
            # Based on trading style
            if user_prefs.trading_style and match_prefs.get("trading_style"):
                if user_prefs.trading_style.value == "hodler":
                    starters.append("I'm getting strong HODLer vibes from your profile. What's your diamond hand strategy? 💎")
                elif user_prefs.trading_style.value == "builder":
                    starters.append("Your builder energy is infectious! What are you currently working on? 🛠️")
            
            # Generic Web3 starters
            starters.extend([
                "Hey! I'm getting serious Web3 alpha from your profile. Care to share some insights? 🚀",
                "Your blockchain knowledge is giving me mainnet energy! What's your take on the current market? 📈",
                "I sense some serious DeFi intellect here. What's your go-to yield farming strategy? 🌾"
            ])
        
        return starters[:3]
