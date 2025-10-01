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
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio: 'Full-stack developer passionate about DeFi and sustainable tech. Love hiking and discovering new coffee shops.',
      matchScore: 92,
      reason: 'You both love DeFi and have similar tech backgrounds. Your interests in sustainable technology align perfectly.',
      icebreaker: 'I saw you\'re into DeFi too! What\'s your favorite protocol right now?'
    },
    {
      id: 'mock-2', 
      name: 'Sophia Williams',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      bio: 'UX designer crafting beautiful interfaces for DApps. Coffee addict, bookworm, and weekend photographer.',
      matchScore: 90,
      reason: 'Creative minds think alike! Your tech background and her design skills would make a perfect team.',
      icebreaker: 'I love your approach to user experience! What\'s the most challenging DApp you\'ve designed?'
    },
    {
      id: 'mock-3',
      name: 'Emma Davis', 
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
      bio: 'DevOps engineer building scalable blockchain infrastructure. Love rock climbing and exploring new cities.',
      matchScore: 89,
      reason: 'Both tech enthusiasts who love adventure. Your development skills complement her infrastructure expertise.',
      icebreaker: 'I see you\'re into rock climbing! Any favorite spots you\'d recommend for a fellow adventurer?'
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