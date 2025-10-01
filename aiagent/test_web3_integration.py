"""
Test script for Web3-integrated CeloSoul Dating AI Agent
"""
import requests
import json
from typing import Dict, Any

class Web3IntegrationTester:
    """Test class for Web3 features"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_user_id = None
        self.conversation_id = None
    
    def test_web3_user_creation(self) -> bool:
        """Test creating a user with Web3 preferences"""
        print("\n🧪 Testing Web3 User Creation...")
        
        user_data = {
            "name": "Alex the Builder",
            "age": 28,
            "location": "San Francisco",
            "bio": "Smart contract developer passionate about DeFi protocols and Web3. Love building on Celo and Ethereum. Active in hackathons and DAO governance.",
            "interests": ["blockchain", "defi", "smart contracts", "celo", "ethereum"],
            "photos": ["alex1.jpg"],
            "personality_types": ["analytical", "creative"],
            "music_genres": ["electronic", "indie"],
            "hobbies": ["coding", "yield farming", "nft collecting"],
            "behavior_signals": ["tech_savvy", "web3_enthusiast", "nerdy"],
            "age_range": [25, 35],
            "lifestyle_preferences": ["fitness", "tech"],
            "deal_breakers": ["anti-crypto"],
            "must_haves": ["web3 knowledge", "technical skills"],
            "web3_preferences": {
                "favorite_chains": ["celo", "ethereum"],
                "trading_style": "builder",
                "defi_experience": "expert",
                "programming_languages": ["solidity", "javascript", "python"],
                "nft_interests": ["art", "gaming"],
                "web3_communities": ["gitcoin", "celo", "ethglobal"],
                "conference_attendance": ["devcon", "celocon"],
                "mentorship_interest": "both"
            }
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/users",
                json=user_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                result = response.json()
                self.test_user_id = result["data"]["user_id"]
                print(f"✅ Web3 user created successfully")
                print(f"   User ID: {self.test_user_id}")
                print(f"   Bio: {user_data['bio'][:100]}...")
                return True
            else:
                print(f"❌ Web3 user creation failed: {response.status_code}")
                print(f"   Error: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Web3 user creation error: {e}")
            return False
    
    def test_web3_match_analysis(self) -> bool:
        """Test analyzing matches with Web3 compatibility"""
        if not self.test_user_id:
            print("❌ No user ID available for testing")
            return False
            
        print("\n🧪 Testing Web3 Match Analysis...")
        
        # Create Web3-focused potential matches
        potential_matches = [
            {
                "user_id": "web3_dev_1",
                "name": "Jordan the DeFi Expert",
                "age": 26,
                "location": "New York",
                "bio": "DeFi protocol developer specializing in yield farming and liquidity optimization. Celo ecosystem contributor and Uniswap V3 expert.",
                "music_genres": ["electronic", "indie"],
                "hobbies": ["yield farming", "smart contracts", "dao governance"],
                "personality_types": ["analytical", "creative"],
                "behavior_signals": ["tech_savvy", "web3_enthusiast", "intellectual"],
                "lifestyle_preferences": ["tech", "fitness"],
                "photos": ["jordan1.jpg"],
                "web3_preferences": {
                    "favorite_chains": ["celo", "ethereum"],
                    "trading_style": "builder",
                    "defi_experience": "expert",
                    "programming_languages": ["solidity", "javascript", "python"],
                    "nft_interests": ["art", "utility"],
                    "web3_communities": ["gitcoin", "celo", "ethglobal"]
                }
            },
            {
                "user_id": "nft_artist_1",
                "name": "Taylor the NFT Creator",
                "age": 24,
                "location": "Los Angeles",
                "bio": "Digital artist and NFT creator working with generative art and Web3 communities. Passionate about blockchain art and creator economy.",
                "music_genres": ["indie", "alternative"],
                "hobbies": ["digital art", "nft creation", "community building"],
                "personality_types": ["creative", "adventurous"],
                "behavior_signals": ["creative", "web3_enthusiast", "playful"],
                "lifestyle_preferences": ["creative", "social"],
                "photos": ["taylor1.jpg"],
                "web3_preferences": {
                    "favorite_chains": ["ethereum", "polygon"],
                    "trading_style": "hodler",
                    "defi_experience": "beginner",
                    "programming_languages": ["javascript"],
                    "nft_interests": ["art", "gaming"],
                    "web3_communities": ["opensea", "foundation", "superrare"]
                }
            },
            {
                "user_id": "crypto_trader_1",
                "name": "Sam the Crypto Trader",
                "age": 30,
                "location": "Miami",
                "bio": "Professional crypto trader and DeFi yield farmer. Technical analysis expert with a focus on altcoin trading and market research.",
                "music_genres": ["hip_hop", "electronic"],
                "hobbies": ["trading", "market analysis", "defi strategies"],
                "personality_types": ["analytical", "adventurous"],
                "behavior_signals": ["direct", "tech_savvy", "intellectual"],
                "lifestyle_preferences": ["luxury", "travel"],
                "photos": ["sam1.jpg"],
                "web3_preferences": {
                    "favorite_chains": ["ethereum", "arbitrum"],
                    "trading_style": "trader",
                    "defi_experience": "expert",
                    "programming_languages": ["python"],
                    "nft_interests": ["pfp"],
                    "web3_communities": ["trading", "defi"]
                }
            }
        ]
        
        match_data = {
            "user_id": self.test_user_id,
            "potential_matches": potential_matches
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/matches/analyze",
                json=match_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                result = response.json()
                matches = result["data"]["matches"]
                print(f"✅ Web3 match analysis successful")
                print(f"   Found {len(matches)} compatible matches")
                
                for match in matches:
                    print(f"\n   🎯 {match['name']}:")
                    print(f"      Compatibility: {match['compatibility_score']:.2f}")
                    print(f"      Bio: {match['bio'][:80]}...")
                    if match['match_reasons']:
                        print(f"      Match reasons: {', '.join(match['match_reasons'][:2])}")
                    if match['conversation_starters']:
                        print(f"      Conversation starter: {match['conversation_starters'][0]}")
                
                return True
            else:
                print(f"❌ Web3 match analysis failed: {response.status_code}")
                print(f"   Error: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Web3 match analysis error: {e}")
            return False
    
    def test_web3_conversation(self) -> bool:
        """Test Web3-themed conversation"""
        if not self.test_user_id:
            print("❌ No user ID available for testing")
            return False
            
        print("\n🧪 Testing Web3 Conversation...")
        
        # Create conversation with Web3 flirting style
        flirting_style = {
            "intensity": "moderate",
            "humor_level": "high",
            "directness": "balanced",
            "emoji_usage": "moderate",
            "tech_level": "heavy",
            "web3_knowledge": "expert",
            "crypto_enthusiasm": "high",
            "nerd_factor": "high"
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/conversations",
                params={
                    "user_id": self.test_user_id,
                    "match_user_id": "web3_dev_1"
                },
                json=flirting_style,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                result = response.json()
                self.conversation_id = result["data"]["conversation_id"]
                print(f"✅ Web3 conversation created successfully")
                print(f"   Conversation ID: {self.conversation_id}")
                return True
            else:
                print(f"❌ Web3 conversation creation failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Web3 conversation creation error: {e}")
            return False
    
    def test_web3_chat(self) -> bool:
        """Test Web3-themed chat messages"""
        if not self.conversation_id:
            print("❌ No conversation ID available for testing")
            return False
            
        print("\n🧪 Testing Web3 Chat Messages...")
        
        # Test Web3-themed messages
        web3_messages = [
            "Hey! I noticed you're a DeFi developer. What's your favorite yield farming strategy?",
            "Your smart contract skills caught my attention! What's the most complex protocol you've built?",
            "I'm getting strong Celo ecosystem vibes from your profile. What's your take on Celo's mobile-first approach?",
            "Your GitHub activity is giving me serious alpha! What are you currently building?"
        ]
        
        flirting_style = {
            "intensity": "moderate",
            "humor_level": "high",
            "directness": "balanced",
            "emoji_usage": "moderate",
            "tech_level": "heavy",
            "web3_knowledge": "expert",
            "crypto_enthusiasm": "high",
            "nerd_factor": "high"
        }
        
        for i, message in enumerate(web3_messages[:2]):  # Test first 2 messages
            try:
                chat_data = {
                    "conversation_id": self.conversation_id,
                    "sender_id": "web3_dev_1",
                    "receiver_id": self.test_user_id,
                    "message": message,
                    "flirting_style": flirting_style
                }
                
                response = self.session.post(
                    f"{self.base_url}/chat",
                    json=chat_data,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    result = response.json()
                    ai_response = result["data"]["ai_response"]["content"]
                    print(f"\n   Message {i+1}:")
                    print(f"   👤 User: {message}")
                    print(f"   🤖 AI: {ai_response}")
                else:
                    print(f"❌ Web3 chat message {i+1} failed: {response.status_code}")
                    return False
                    
            except Exception as e:
                print(f"❌ Web3 chat message {i+1} error: {e}")
                return False
        
        print(f"\n✅ Web3 chat messages successful")
        return True
    
    def test_web3_conversation_starters(self) -> bool:
        """Test Web3 conversation starter generation"""
        if not self.conversation_id:
            print("❌ No conversation ID available for testing")
            return False
            
        print("\n🧪 Testing Web3 Conversation Starters...")
        
        starter_data = {
            "match_profile": {
                "user_id": "web3_dev_1",
                "name": "Jordan",
                "age": 26,
                "location": "New York",
                "bio": "DeFi protocol developer specializing in yield farming and liquidity optimization. Celo ecosystem contributor.",
                "photos": ["jordan1.jpg"],
                "compatibility_score": 0.85
            },
            "user_preferences": {
                "personality_types": ["analytical", "creative"],
                "music_genres": ["electronic", "indie"],
                "hobbies": ["coding", "yield farming", "smart contracts"],
                "behavior_signals": ["tech_savvy", "web3_enthusiast", "nerdy"]
            },
            "flirting_style": {
                "intensity": "moderate",
                "humor_level": "high",
                "directness": "balanced",
                "emoji_usage": "moderate",
                "tech_level": "heavy",
                "web3_knowledge": "expert",
                "crypto_enthusiasm": "high",
                "nerd_factor": "high"
            }
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/conversations/{self.conversation_id}/starters",
                json=starter_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                result = response.json()
                starters = result["data"]["conversation_starters"]
                print(f"✅ Web3 conversation starters generated successfully")
                for i, starter in enumerate(starters, 1):
                    print(f"   {i}. {starter}")
                return True
            else:
                print(f"❌ Web3 conversation starters failed: {response.status_code}")
                print(f"   Error: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Web3 conversation starters error: {e}")
            return False
    
    def run_all_web3_tests(self) -> bool:
        """Run all Web3 integration tests"""
        print("🚀 CeloSoul Dating AI Agent - Web3 Integration Tests\n")
        
        tests = [
            self.test_web3_user_creation,
            self.test_web3_match_analysis,
            self.test_web3_conversation,
            self.test_web3_chat,
            self.test_web3_conversation_starters
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            try:
                if test():
                    passed += 1
            except Exception as e:
                print(f"❌ Test failed with exception: {e}")
        
        print(f"\n{'='*60}")
        print(f"📊 Web3 Integration Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All Web3 integration tests passed!")
            print("\n✅ Your AI agent is now Web3-native and ready to connect blockchain enthusiasts!")
            print("🚀 Features working:")
            print("   • Web3 user profiles with blockchain preferences")
            print("   • Tech compatibility matching")
            print("   • Web3-themed flirting and conversation")
            print("   • DeFi, NFT, and coding context awareness")
            print("   • Blockchain ecosystem matching")
            return True
        else:
            print(f"❌ {total - passed} tests failed.")
            print("Please check the implementation and try again.")
            return False

def main():
    """Run Web3 integration tests"""
    tester = Web3IntegrationTester()
    success = tester.run_all_web3_tests()
    
    if success:
        print("\n🔗 Ready for Web3 Frontend Integration!")
        print("Your dating AI agent now speaks fluent blockchain! 💎")

if __name__ == "__main__":
    main()
