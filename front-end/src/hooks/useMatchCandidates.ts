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
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
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
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
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
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    date_of_birth: '1991-11-08',
    interests: ['Crypto', 'Yoga', 'Fitness', 'Technology'],
    match_score: 85,
    match_reason: 'Shared passion for web3 and healthy lifestyle. Your product and tech perspectives would create great conversations.',
    icebreaker: 'I noticed you\'re into yoga too! Have you tried any blockchain-based fitness apps?'
  },
  {
    id: '4',
    display_name: 'Sophia Williams',
    bio: 'UX designer crafting beautiful interfaces for DApps. Coffee addict, bookworm, and weekend photographer.',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    date_of_birth: '1996-09-12',
    interests: ['Design', 'Photography', 'Coffee', 'Reading'],
    match_score: 90,
    match_reason: 'Creative minds think alike! Your tech background and her design skills would make a perfect team.',
    icebreaker: 'I love your approach to user experience! What\'s the most challenging DApp you\'ve designed?'
  },
  {
    id: '5',
    display_name: 'Marcus Thompson',
    bio: 'Blockchain researcher and crypto trader. Passionate about financial freedom and decentralized systems.',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    date_of_birth: '1992-04-18',
    interests: ['Crypto', 'Trading', 'Research', 'Finance'],
    match_score: 87,
    match_reason: 'Both deep into crypto research and trading. You share similar views on decentralized finance.',
    icebreaker: 'What\'s your take on the latest DeFi innovations? I\'d love to discuss market trends!'
  },
  {
    id: '6',
    display_name: 'Emma Davis',
    bio: 'DevOps engineer building scalable blockchain infrastructure. Love rock climbing and exploring new cities.',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    date_of_birth: '1994-11-25',
    interests: ['Technology', 'Rock Climbing', 'Travel', 'Infrastructure'],
    match_score: 89,
    match_reason: 'Both tech enthusiasts who love adventure. Your development skills complement her infrastructure expertise.',
    icebreaker: 'I see you\'re into rock climbing! Any favorite spots you\'d recommend for a fellow adventurer?'
  },
  {
    id: '7',
    display_name: 'David Park',
    bio: 'Crypto journalist and content creator. Explaining blockchain to the masses, one article at a time.',
    avatar_url: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face',
    date_of_birth: '1990-06-30',
    interests: ['Writing', 'Crypto', 'Content Creation', 'Education'],
    match_score: 84,
    match_reason: 'You both are passionate about crypto education and making blockchain accessible to everyone.',
    icebreaker: 'Your articles on crypto adoption are insightful! What\'s the next big trend you\'re covering?'
  },
  {
    id: '8',
    display_name: 'Luna Martinez',
    bio: 'Web3 community manager and event organizer. Building bridges between developers and users in the crypto space.',
    avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face',
    date_of_birth: '1997-02-14',
    interests: ['Community', 'Events', 'Web3', 'Networking'],
    match_score: 86,
    match_reason: 'Perfect match for building the future together! You create the tech, she builds the community.',
    icebreaker: 'I love how you bring people together in Web3! What\'s the most exciting event you\'ve organized?'
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