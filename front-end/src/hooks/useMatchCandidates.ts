import { useState, useEffect } from 'react';
import { loadProfile } from '../lib/localCache';
import { useAuth } from '../contexts/AuthContext';

interface MatchCandidate {
  id: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  date_of_birth: string | null;
  interests: string[];
  match_score: number;
  match_reason: string;
  icebreaker: string;
}

// Mock data for MVP
const mockCandidates: MatchCandidate[] = [
  {
    id: '1',
    display_name: 'Alex Chen',
    bio: 'Full-stack developer passionate about DeFi and sustainable tech. Love hiking and discovering new coffee shops.',
    avatar_url: null,
    date_of_birth: '1995-03-15',
    interests: ['Technology', 'DeFi', 'Hiking', 'Coffee'],
    match_score: 92,
    match_reason: 'You both love DeFi and have similar tech backgrounds. Your interests in sustainable technology align perfectly.',
    icebreaker: 'I saw you\'re into DeFi too! What\'s your favorite protocol right now?'
  },
  {
    id: '2',
    display_name: 'Maya Rodriguez',
    bio: 'Smart contract auditor by day, NFT artist by night. Building the future of web3 one line of code at a time.',
    avatar_url: null,
    date_of_birth: '1993-07-22',
    interests: ['Crypto', 'NFTs', 'Art', 'Technology'],
    match_score: 88,
    match_reason: 'Both crypto enthusiasts with creative sides. Your technical skills complement each other well.',
    icebreaker: 'Your profile mentions smart contracts - I\'d love to hear about your latest audit findings!'
  },
  {
    id: '3',
    display_name: 'Jordan Kim',
    bio: 'Product manager at a web3 startup. Believer in decentralized everything. Weekend warrior and yoga enthusiast.',
    avatar_url: null,
    date_of_birth: '1991-11-08',
    interests: ['Crypto', 'Yoga', 'Fitness', 'Technology'],
    match_score: 85,
    match_reason: 'Shared passion for web3 and healthy lifestyle. Your product and tech perspectives would create great conversations.',
    icebreaker: 'I noticed you\'re into yoga too! Have you tried any blockchain-based fitness apps?'
  }
];

export function useMatchCandidates() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<MatchCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check for cached profile to personalize matches
      const addressKey = user?.wallet_address || 'dev';
      const cachedProfile = loadProfile(addressKey);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use cached profile interests to enhance mock data if available
      let enhancedCandidates = mockCandidates;
      if (cachedProfile?.interests?.length) {
        enhancedCandidates = mockCandidates.map(candidate => ({
          ...candidate,
          match_reason: `You both share interests in ${cachedProfile.interests.slice(0, 2).join(' and ')}. ${candidate.match_reason}`
        }));
      }
      
      setCandidates(enhancedCandidates);
    } catch (err) {
      setError('Failed to load candidates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return {
    candidates,
    isLoading,
    error,
    refetch: fetchCandidates
  };
}