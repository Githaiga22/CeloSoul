import { ProfileDetails } from '../types/profile';

export interface AgentResponse {
  success: boolean;
  message: string;
  profileId: string;
  shortlistSeeded: boolean;
  shortlist: MatchCandidate[];
}

export interface MatchCandidate {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string;
  matchScore: number;
  reason: string;
  icebreaker: string;
}

const PROFILE_KEY_PREFIX = 'celosoul_profile_';

export function saveProfile(addressOrDevKey: string, profile: ProfileDetails): void {
  try {
    const key = `${PROFILE_KEY_PREFIX}${addressOrDevKey}`;
    localStorage.setItem(key, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save profile to localStorage:', error);
  }
}

export function loadProfile(addressOrDevKey: string): ProfileDetails | null {
  try {
    const key = `${PROFILE_KEY_PREFIX}${addressOrDevKey}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load profile from localStorage:', error);
    return null;
  }
}

export function createMockAgentResponse(profileId: string): AgentResponse {
  const mockShortlist: MatchCandidate[] = [
    {
      id: 'mock-1',
      name: 'Alex Chen',
      avatarUrl: null,
      bio: 'Full-stack developer passionate about DeFi and sustainable tech. Love hiking and discovering new coffee shops.',
      matchScore: 92,
      reason: 'You both love DeFi and have similar tech backgrounds. Your interests in sustainable technology align perfectly.',
      icebreaker: 'I saw you\'re into DeFi too! What\'s your favorite protocol right now?'
    },
    {
      id: 'mock-2', 
      name: 'Maya Rodriguez',
      avatarUrl: null,
      bio: 'Smart contract auditor by day, NFT artist by night. Building the future of web3 one line of code at a time.',
      matchScore: 88,
      reason: 'Both crypto enthusiasts with creative sides. Your technical skills complement each other well.',
      icebreaker: 'Your profile mentions smart contracts - I\'d love to hear about your latest audit findings!'
    },
    {
      id: 'mock-3',
      name: 'Jordan Kim', 
      avatarUrl: null,
      bio: 'Product manager at a web3 startup. Believer in decentralized everything. Weekend warrior and yoga enthusiast.',
      matchScore: 85,
      reason: 'Shared passion for web3 and healthy lifestyle. Your product and tech perspectives would create great conversations.',
      icebreaker: 'I noticed you\'re into yoga too! Have you tried any blockchain-based fitness apps?'
    }
  ];

  return {
    success: true,
    message: 'Profile saved (mock)',
    profileId,
    shortlistSeeded: true,
    shortlist: mockShortlist
  };
}