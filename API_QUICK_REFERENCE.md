# 🚀 CeloSoul Dating AI Agent - API Quick Reference

## 📡 **Base URL**
```
Development: http://localhost:8000
Production: https://your-domain.com
```

---

## 🔑 **Core Endpoints**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/` | Health check |
| `POST` | `/users` | Create Web3 user |
| `POST` | `/matches/analyze` | Analyze Web3 matches |
| `POST` | `/conversations` | Create conversation |
| `POST` | `/chat` | Send message |
| `POST` | `/conversations/{id}/starters` | Get conversation starters |

---

## 💻 **JavaScript API Client**

```javascript
class CeloSoulAPI {
  constructor(baseURL = 'http://localhost:8000') {
    this.baseURL = baseURL;
  }

  // Create Web3 user
  async createUser(userData) {
    return fetch(`${this.baseURL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then(r => r.json());
  }

  // Analyze matches
  async analyzeMatches(userId, matches) {
    return fetch(`${this.baseURL}/matches/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, potential_matches: matches })
    }).then(r => r.json());
  }

  // Create conversation
  async createConversation(userId, matchUserId, flirtingStyle) {
    return fetch(`${this.baseURL}/conversations?user_id=${userId}&match_user_id=${matchUserId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flirtingStyle)
    }).then(r => r.json());
  }

  // Send message
  async sendMessage(conversationId, senderId, receiverId, message, flirtingStyle) {
    return fetch(`${this.baseURL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation_id: conversationId,
        sender_id: senderId,
        receiver_id: receiverId,
        message,
        flirting_style: flirtingStyle
      })
    }).then(r => r.json());
  }
}

const api = new CeloSoulAPI();
```

---

## 🎯 **Web3 User Data Structure**

```javascript
const web3User = {
  name: "Alex the Builder",
  age: 28,
  location: "San Francisco",
  bio: "Smart contract developer passionate about DeFi protocols and Web3.",
  interests: ["blockchain", "defi", "smart contracts", "celo", "ethereum"],
  photos: ["alex1.jpg"],
  personality_types: ["analytical", "creative"],
  music_genres: ["electronic", "indie"],
  hobbies: ["coding", "yield farming", "nft collecting"],
  behavior_signals: ["tech_savvy", "web3_enthusiast", "nerdy"],
  web3_preferences: {
    favorite_chains: ["celo", "ethereum"],
    trading_style: "builder",
    defi_experience: "expert",
    programming_languages: ["solidity", "javascript", "python"],
    nft_interests: ["art", "gaming"],
    web3_communities: ["gitcoin", "celo", "ethglobal"]
  }
};
```

---

## 🎨 **Web3 Flirting Styles**

```javascript
const web3FlirtingStyles = {
  defiEnthusiast: {
    intensity: "moderate",
    humor_level: "high",
    directness: "balanced",
    emoji_usage: "moderate",
    tech_level: "heavy",
    web3_knowledge: "expert",
    crypto_enthusiasm: "high",
    nerd_factor: "high"
  },
  
  nftArtist: {
    intensity: "subtle",
    humor_level: "medium",
    directness: "balanced",
    emoji_usage: "frequent",
    tech_level: "balanced",
    web3_knowledge: "intermediate",
    crypto_enthusiasm: "moderate",
    nerd_factor: "medium"
  },
  
  cryptoTrader: {
    intensity: "bold",
    humor_level: "medium",
    directness: "direct",
    emoji_usage: "moderate",
    tech_level: "balanced",
    web3_knowledge: "expert",
    crypto_enthusiasm: "high",
    nerd_factor: "low"
  }
};
```

---

## 🔗 **Web3 Enums Reference**

### **Blockchain Chains**
```javascript
const BLOCKCHAIN_CHAINS = [
  "celo", "ethereum", "polygon", "arbitrum", 
  "optimism", "bsc", "solana", "avalanche", 
  "fantom", "cosmos"
];
```

### **Trading Styles**
```javascript
const TRADING_STYLES = [
  "hodler", "trader", "degen", "builder", 
  "cautious", "yolo"
];
```

### **Web3 Experience**
```javascript
const WEB3_EXPERIENCE = [
  "beginner", "intermediate", "expert", "builder"
];
```

### **Programming Languages**
```javascript
const PROGRAMMING_LANGUAGES = [
  "solidity", "javascript", "typescript", "python", 
  "rust", "go", "vyper", "move"
];
```

### **Behavior Signals**
```javascript
const BEHAVIOR_SIGNALS = [
  "responsive", "playful", "intellectual", "emotional",
  "direct", "subtle", "humorous", "serious",
  "tech_savvy", "web3_enthusiast", "nerdy"
];
```

---

## 📊 **Response Examples**

### **User Creation Response**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user_id": "de6c3f2a-b693-47e2-84b5-7cc4762490ed",
    "profile": { /* user profile data */ }
  }
}
```

### **Match Analysis Response**
```json
{
  "success": true,
  "message": "Match analysis completed",
  "data": {
    "matches": [
      {
        "user_id": "match_1",
        "name": "Jordan the DeFi Expert",
        "compatibility_score": 0.85,
        "tech_compatibility_score": 0.92,
        "blockchain_ecosystem_match": 0.95,
        "development_synergy": 0.88,
        "conversation_starters": [
          "Hey! I noticed we both love the Celo ecosystem. What's your favorite Celo dApp? 🟢"
        ]
      }
    ]
  }
}
```

### **Chat Response**
```json
{
  "success": true,
  "message": "Message processed successfully",
  "data": {
    "user_message": { /* user message data */ },
    "ai_response": {
      "content": "Your DeFi expertise is giving me serious alpha vibes! I love how you think about yield optimization. What's the most innovative protocol you've discovered lately? 🚀"
    }
  }
}
```

---

## 🚨 **Error Handling**

```javascript
try {
  const response = await api.createUser(userData);
  if (!response.success) {
    throw new Error(response.message);
  }
  console.log('Success:', response.data);
} catch (error) {
  console.error('API Error:', error.message);
  // Handle error appropriately
}
```

---

## 🎯 **Common Use Cases**

### **1. Create Web3 User**
```javascript
const user = await api.createUser(web3User);
const userId = user.data.user_id;
```

### **2. Find Matches**
```javascript
const matches = await api.analyzeMatches(userId, potentialMatches);
const bestMatch = matches.data.matches[0];
```

### **3. Start Conversation**
```javascript
const conversation = await api.createConversation(
  userId, 
  bestMatch.user_id, 
  web3FlirtingStyles.defiEnthusiast
);
const conversationId = conversation.data.conversation_id;
```

### **4. Send Message**
```javascript
const chatResponse = await api.sendMessage(
  conversationId,
  userId,
  bestMatch.user_id,
  "Hey! Your DeFi knowledge caught my attention!",
  web3FlirtingStyles.defiEnthusiast
);
```

---

## 🔧 **Development Tips**

1. **Always include Web3 preferences** for better matching
2. **Use appropriate flirting styles** for different user types
3. **Handle API errors gracefully** with try-catch blocks
4. **Cache user data** to avoid repeated API calls
5. **Implement real-time updates** for chat messages
6. **Use Web3-themed UI components** for better UX

---

## 📱 **Mobile Considerations**

- Use responsive design for Web3 profile cards
- Optimize chain tags and programming language displays
- Ensure chat interface works well on mobile
- Consider touch-friendly interaction patterns

---

**Ready to build your Web3 dating platform! 🚀💎**
