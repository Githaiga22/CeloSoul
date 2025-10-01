import { useState, useEffect } from 'react';

interface Match {
  id: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  wallet_address: string | null;
  last_message: string | null;
  matched_at: string;
}

// Mock data for MVP
const mockMatches: Match[] = [
  {
    id: 'match-1',
    display_name: 'Sarah Wilson',
    bio: 'Blockchain developer and crypto enthusiast. Love building dApps and exploring DeFi.',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    wallet_address: '0x742d35Cc6634C0532925a3b8D4C9db96590C6C87',
    last_message: 'Hey! Thanks for the tip 😊',
    matched_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'match-2',
    display_name: 'David Park',
    bio: 'Web3 product manager. Building the future of decentralized social networks.',
    avatar_url: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face',
    wallet_address: '0x8ba1f109551bD432803012645Hac136c22C501e5',
    last_message: null,
    matched_at: '2024-01-14T15:45:00Z'
  },
  {
    id: 'match-3',
    display_name: 'Luna Martinez',
    bio: 'Web3 community manager and event organizer. Building bridges in the crypto space.',
    avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face',
    wallet_address: '0x9cd2f109551bD432803012645Hac136c22C501f6',
    last_message: 'Looking forward to our coffee chat!',
    matched_at: '2024-01-13T09:20:00Z'
  }
];

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchMatches = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setMatches(mockMatches);
      setIsLoading(false);
    };

    fetchMatches();
  }, []);

  return {
    matches,
    isLoading
  };
}