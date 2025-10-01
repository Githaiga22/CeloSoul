/**
 * CeloSoul Dating AI Agent - Frontend Integration Examples
 * JavaScript/React examples for integrating with the AI agent API
 */

// Base API configuration
const API_BASE_URL = 'http://localhost:8000';
const API_HEADERS = {
    'Content-Type': 'application/json',
};

// ========================================
// 1. BASIC API CLIENT CLASS
// ========================================

class DatingAIClient {
    constructor(baseUrl = API_BASE_URL) {
        this.baseUrl = baseUrl;
        this.session = null;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: API_HEADERS,
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`API request failed: ${error.message}`);
            throw error;
        }
    }

    // User Management
    async createUser(userData) {
        return this.request('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async getUser(userId) {
        return this.request(`/users/${userId}`);
    }

    // Matching
    async analyzeMatches(userId, potentialMatches) {
        return this.request('/matches/analyze', {
            method: 'POST',
            body: JSON.stringify({
                user_id: userId,
                potential_matches: potentialMatches,
            }),
        });
    }

    // Conversations
    async createConversation(userId, matchUserId, flirtingStyle) {
        const params = new URLSearchParams({
            user_id: userId,
            match_user_id: matchUserId,
        });
        
        return this.request(`/conversations?${params}`, {
            method: 'POST',
            body: JSON.stringify(flirtingStyle),
        });
    }

    async sendMessage(conversationId, senderId, receiverId, message, flirtingStyle) {
        return this.request('/chat', {
            method: 'POST',
            body: JSON.stringify({
                conversation_id: conversationId,
                sender_id: senderId,
                receiver_id: receiverId,
                message: message,
                flirting_style: flirtingStyle,
            }),
        });
    }

    async getConversation(conversationId) {
        return this.request(`/conversations/${conversationId}`);
    }

    async getConversationMessages(conversationId, limit = 20) {
        return this.request(`/conversations/${conversationId}/messages?limit=${limit}`);
    }

    async generateConversationStarters(matchProfile, userPreferences, flirtingStyle) {
        return this.request('/conversations/test/starters', {
            method: 'POST',
            body: JSON.stringify({
                match_profile: matchProfile,
                user_preferences: userPreferences,
                flirting_style: flirtingStyle,
            }),
        });
    }
}

// ========================================
// 2. REACT HOOKS EXAMPLE
// ========================================

import { useState, useEffect, useCallback } from 'react';

// Custom hook for dating AI client
export const useDatingAI = () => {
    const [client] = useState(() => new DatingAIClient());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiCall = useCallback(async (apiFunction, ...args) => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await apiFunction.apply(client, args);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [client]);

    return {
        client,
        loading,
        error,
        apiCall,
    };
};

// Hook for user management
export const useUser = (userId) => {
    const { apiCall, loading, error } = useDatingAI();
    const [user, setUser] = useState(null);

    const createUser = useCallback(async (userData) => {
        const result = await apiCall(apiCall.client.createUser, userData);
        setUser(result.data.profile);
        return result;
    }, [apiCall]);

    const fetchUser = useCallback(async () => {
        if (!userId) return;
        const result = await apiCall(apiCall.client.getUser, userId);
        setUser(result.data.profile);
        return result;
    }, [userId, apiCall]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return {
        user,
        createUser,
        fetchUser,
        loading,
        error,
    };
};

// Hook for conversations
export const useConversation = (conversationId) => {
    const { apiCall, loading, error } = useDatingAI();
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);

    const sendMessage = useCallback(async (senderId, receiverId, message, flirtingStyle) => {
        const result = await apiCall(apiCall.client.sendMessage, 
            conversationId, senderId, receiverId, message, flirtingStyle);
        
        // Update messages with new message and AI response
        setMessages(prev => [
            ...prev,
            result.data.user_message,
            result.data.ai_response,
        ]);
        
        return result;
    }, [conversationId, apiCall]);

    const fetchConversation = useCallback(async () => {
        if (!conversationId) return;
        const result = await apiCall(apiCall.client.getConversation, conversationId);
        setConversation(result.data);
        return result;
    }, [conversationId, apiCall]);

    const fetchMessages = useCallback(async (limit = 20) => {
        if (!conversationId) return;
        const result = await apiCall(apiCall.client.getConversationMessages, conversationId, limit);
        setMessages(result.data.messages);
        return result;
    }, [conversationId, apiCall]);

    useEffect(() => {
        fetchConversation();
        fetchMessages();
    }, [fetchConversation, fetchMessages]);

    return {
        conversation,
        messages,
        sendMessage,
        fetchConversation,
        fetchMessages,
        loading,
        error,
    };
};

// ========================================
// 3. REACT COMPONENT EXAMPLES
// ========================================

// User Profile Creation Component
export const UserProfileForm = ({ onUserCreated }) => {
    const { createUser, loading, error } = useUser();
    const [formData, setFormData] = useState({
        name: '',
        age: 25,
        location: '',
        bio: '',
        interests: [],
        personality_types: [],
        music_genres: [],
        hobbies: [],
        behavior_signals: [],
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await createUser(formData);
            onUserCreated(result.data.user_id);
        } catch (err) {
            console.error('Failed to create user:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Your Profile</h2>
            
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                />
            </div>

            <div>
                <label>Age:</label>
                <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                    required
                />
            </div>

            <div>
                <label>Location:</label>
                <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                />
            </div>

            <div>
                <label>Bio:</label>
                <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    required
                />
            </div>

            <div>
                <label>Interests (comma-separated):</label>
                <input
                    type="text"
                    value={formData.interests.join(', ')}
                    onChange={(e) => setFormData({
                        ...formData, 
                        interests: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Profile'}
            </button>

            {error && <div className="error">Error: {error}</div>}
        </form>
    );
};

// Match Analysis Component
export const MatchAnalysis = ({ userId, potentialMatches }) => {
    const { apiCall, loading, error } = useDatingAI();
    const [matches, setMatches] = useState([]);

    const analyzeMatches = useCallback(async () => {
        try {
            const result = await apiCall(apiCall.client.analyzeMatches, userId, potentialMatches);
            setMatches(result.data.matches);
        } catch (err) {
            console.error('Failed to analyze matches:', err);
        }
    }, [userId, potentialMatches, apiCall]);

    useEffect(() => {
        if (userId && potentialMatches.length > 0) {
            analyzeMatches();
        }
    }, [userId, potentialMatches, analyzeMatches]);

    return (
        <div>
            <h2>Your Matches</h2>
            
            {loading && <div>Analyzing matches...</div>}
            {error && <div className="error">Error: {error}</div>}
            
            <div className="matches">
                {matches.map((match) => (
                    <div key={match.user_id} className="match-card">
                        <h3>{match.name}</h3>
                        <p>Compatibility: {(match.compatibility_score * 100).toFixed(1)}%</p>
                        <p>{match.bio}</p>
                        <div className="match-reasons">
                            <strong>Why you match:</strong>
                            <ul>
                                {match.match_reasons.map((reason, index) => (
                                    <li key={index}>{reason}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="conversation-starters">
                            <strong>Conversation starters:</strong>
                            <ul>
                                {match.conversation_starters.map((starter, index) => (
                                    <li key={index}>{starter}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Chat Component
export const ChatInterface = ({ conversationId, userId, matchUserId }) => {
    const { conversation, messages, sendMessage, loading, error } = useConversation(conversationId);
    const [newMessage, setNewMessage] = useState('');
    const [flirtingStyle, setFlirtingStyle] = useState({
        intensity: 'moderate',
        humor_level: 'medium',
        directness: 'balanced',
        emoji_usage: 'moderate',
    });

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await sendMessage(matchUserId, userId, newMessage, flirtingStyle);
            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    return (
        <div className="chat-interface">
            <div className="chat-header">
                <h3>Chat with AI Assistant</h3>
                {conversation && (
                    <div className="conversation-info">
                        <span>Engagement: {conversation.engagement_level}</span>
                        <span>Messages: {conversation.total_messages}</span>
                    </div>
                )}
            </div>

            <div className="chat-messages">
                {messages.map((message) => (
                    <div key={message.message_id} className={`message ${message.is_ai_generated ? 'ai' : 'user'}`}>
                        <div className="message-content">{message.content}</div>
                        <div className="message-time">
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSendMessage} className="chat-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={loading}
                />
                <button type="submit" disabled={loading || !newMessage.trim()}>
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </form>

            <div className="flirting-style-controls">
                <label>Flirting Style:</label>
                <select value={flirtingStyle.intensity} onChange={(e) => setFlirtingStyle({
                    ...flirtingStyle, intensity: e.target.value
                })}>
                    <option value="subtle">Subtle</option>
                    <option value="moderate">Moderate</option>
                    <option value="bold">Bold</option>
                </select>
                
                <select value={flirtingStyle.humor_level} onChange={(e) => setFlirtingStyle({
                    ...flirtingStyle, humor_level: e.target.value
                })}>
                    <option value="low">Low Humor</option>
                    <option value="medium">Medium Humor</option>
                    <option value="high">High Humor</option>
                </select>
            </div>

            {error && <div className="error">Error: {error}</div>}
        </div>
    );
};

// ========================================
// 4. VANILLA JAVASCRIPT EXAMPLE
// ========================================

// Simple vanilla JS example
async function createUserProfile() {
    const userData = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        location: document.getElementById('location').value,
        bio: document.getElementById('bio').value,
        interests: document.getElementById('interests').value.split(',').map(s => s.trim()),
        personality_types: ['extrovert', 'creative'],
        music_genres: ['pop', 'rock'],
        hobbies: ['photography', 'travel'],
        behavior_signals: ['playful', 'humorous'],
    };

    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: API_HEADERS,
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('User created:', result);
            return result.data.user_id;
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

// ========================================
// 5. USAGE EXAMPLES
// ========================================

// Example usage in a React app
/*
import React from 'react';
import { UserProfileForm, MatchAnalysis, ChatInterface } from './frontend_examples';

function App() {
    const [userId, setUserId] = React.useState(null);
    const [conversationId, setConversationId] = React.useState(null);

    return (
        <div className="app">
            {!userId ? (
                <UserProfileForm onUserCreated={setUserId} />
            ) : !conversationId ? (
                <MatchAnalysis 
                    userId={userId} 
                    potentialMatches={sampleMatches}
                    onMatchSelected={(matchId) => {
                        // Create conversation with selected match
                        // setConversationId(conversationId);
                    }}
                />
            ) : (
                <ChatInterface 
                    conversationId={conversationId}
                    userId={userId}
                    matchUserId="match_1"
                />
            )}
        </div>
    );
}
*/

export default DatingAIClient;
