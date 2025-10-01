import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

interface User {
  id: string;
  wallet_address: string | null;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  date_of_birth: string | null;
  interests: string[];
  profileCompleted?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isTestMode: boolean;
  login: (walletAddress: string) => Promise<void>;
  loginTestMode: (email: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  completeProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestMode, setIsTestMode] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const fetchUser = async (walletAddress: string) => {
    // Check if user has completed profile onboarding
    const hasCompletedProfile = localStorage.getItem(`profile_completed_${walletAddress.toLowerCase()}`);
    
    return {
      id: walletAddress.toLowerCase(),
      wallet_address: walletAddress.toLowerCase(),
      display_name: `User ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      bio: hasCompletedProfile ? 'Web3 developer and crypto enthusiast' : '',
      avatar_url: null,
      date_of_birth: null,
      interests: hasCompletedProfile ? ['Crypto', 'DeFi', 'Technology'] : [],
      profileCompleted: !!hasCompletedProfile,
    };
  };

  const login = async (walletAddress: string) => {
    setIsLoading(true);
    try {
      const userData = await fetchUser(walletAddress);
      setUser(userData);
      setIsTestMode(false);
      localStorage.setItem('auth_mode', 'wallet');
      localStorage.setItem('wallet_address', walletAddress.toLowerCase());
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginTestMode = async (email: string) => {
    setIsLoading(true);
    try {
      const testUserId = `test-${email}`;
      const mockUser = {
        id: testUserId,
        wallet_address: testUserId,
        display_name: email.split('@')[0],
        bio: 'Test mode user',
        avatar_url: null,
        date_of_birth: null,
        interests: ['Testing', 'Demo'],
      };
      
      setUser(mockUser);
      setIsTestMode(true);
      localStorage.setItem('auth_mode', 'test');
      localStorage.setItem('test_user_id', testUserId);
    } catch (error) {
      console.error('Test mode login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsTestMode(false);
    localStorage.removeItem('auth_mode');
    localStorage.removeItem('wallet_address');
    localStorage.removeItem('test_user_id');
    
    // Disconnect wallet if connected
    if (isConnected && !isTestMode) {
      disconnect();
    }
  };

  const refreshUser = async () => {
    if (!user) return;

    const identifier = isTestMode
      ? localStorage.getItem('test_user_id')
      : localStorage.getItem('wallet_address');

    if (!identifier) return;

    const userData = await fetchUser(identifier);
    if (userData) {
      setUser(userData);
    }
  };

  const completeProfile = () => {
    if (user) {
      const identifier = user.wallet_address || user.id;
      localStorage.setItem(`profile_completed_${identifier}`, 'true');
      setUser({ ...user, profileCompleted: true });
    }
  };

  // Handle wallet disconnection
  useEffect(() => {
    if (!isConnected && user && !isTestMode) {
      // Wallet was disconnected, logout user
      setUser(null);
      localStorage.removeItem('auth_mode');
      localStorage.removeItem('wallet_address');
    }
  }, [isConnected, user, isTestMode]);

  // Handle wallet connection
  useEffect(() => {
    if (isConnected && address && !user && !isTestMode) {
      login(address);
    }
  }, [isConnected, address, user, isTestMode]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const authMode = localStorage.getItem('auth_mode');

      if (authMode === 'wallet') {
        const savedAddress = localStorage.getItem('wallet_address');
        if (savedAddress && isConnected && address?.toLowerCase() === savedAddress) {
          const userData = await fetchUser(address);
          setUser(userData);
          setIsTestMode(false);
        } else if (!isConnected) {
          // Wallet not connected but we have saved wallet auth, clear it
          localStorage.removeItem('auth_mode');
          localStorage.removeItem('wallet_address');
        }
      } else if (authMode === 'test') {
        const testUserId = localStorage.getItem('test_user_id');
        if (testUserId) {
          const userData = await fetchUser(testUserId);
          if (userData) {
            setUser(userData);
            setIsTestMode(true);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [address, isConnected]);



  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isTestMode,
        login,
        loginTestMode,
        logout,
        refreshUser,
        completeProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
