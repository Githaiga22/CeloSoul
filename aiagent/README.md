# CeloSoul Dating AI Agent

An intelligent dating assistant that helps you find and interact with potential matches on the CeloSoul dating platform.

## Features

- **Smart Matching**: Analyzes user preferences including behavior signals, music taste, hobbies, and more
- **AI Flirting**: Context-aware conversation generation with flirty and engaging responses
- **Preference Learning**: Learns from user interactions to improve matching accuracy
- **Conversation Management**: Maintains chat history and context for natural conversations

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Add your OpenAI API key to `.env`

4. Run the agent:
```bash
python main.py
```

## Usage

The agent provides several key components:

- `DatingAgent`: Core AI agent for chat and flirting
- `PreferenceManager`: Handles user preferences and matching criteria
- `ConversationManager`: Manages chat history and context
- `MatchingEngine`: Analyzes compatibility between users

## API Integration

The agent exposes REST endpoints for frontend integration:
- `/chat` - Send messages and get AI responses
- `/match` - Analyze potential matches
- `/preferences` - Manage user preferences
- `/conversation` - Handle conversation history
