import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: 'daily' | 'monthly' | 'yearly';
  swipes: number;
  superLikes: number;
  features: string[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'daily-basic',
    name: 'Daily Basic',
    price: 3,
    duration: 'daily',
    swipes: 50,
    superLikes: 5,
    features: ['50 daily swipes', '5 super likes', 'Basic matching']
  },
  {
    id: 'daily-premium',
    name: 'Daily Premium',
    price: 5,
    duration: 'daily',
    swipes: 100,
    superLikes: 10,
    features: ['100 daily swipes', '10 super likes', 'Priority matching', 'See who liked you']
  },
  {
    id: 'daily-gold',
    name: 'Daily Gold',
    price: 7,
    duration: 'daily',
    swipes: -1, // unlimited
    superLikes: 20,
    features: ['Unlimited swipes', '20 super likes', 'Boost profile', 'Advanced filters']
  }
];

interface UserUsage {
  swipesUsed: number;
  superLikesUsed: number;
  tipsGiven: number;
  lastReset: string;
  subscription?: {
    planId: string;
    expiresAt: string;
  };
}

export function useSubscription() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UserUsage>({
    swipesUsed: 0,
    superLikesUsed: 0,
    tipsGiven: 0,
    lastReset: new Date().toDateString()
  });

  const storageKey = `celosoul_usage_${user?.wallet_address || 'dev'}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsedUsage = JSON.parse(stored);
      
      // Reset daily usage if it's a new day
      const today = new Date().toDateString();
      if (parsedUsage.lastReset !== today) {
        const resetUsage = {
          ...parsedUsage,
          swipesUsed: 0,
          superLikesUsed: 0,
          lastReset: today
          // Keep tipsGiven - it's lifetime count
        };
        setUsage(resetUsage);
        localStorage.setItem(storageKey, JSON.stringify(resetUsage));
      } else {
        setUsage(parsedUsage);
      }
    }
  }, [storageKey]);

  const updateUsage = (newUsage: Partial<UserUsage>) => {
    const updated = { ...usage, ...newUsage };
    setUsage(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const canSwipe = () => {
    const freeLimit = 8;
    if (usage.subscription) {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === usage.subscription?.planId);
      if (plan) {
        return plan.swipes === -1 || usage.swipesUsed < plan.swipes;
      }
    }
    return usage.swipesUsed < freeLimit;
  };

  const canSuperLike = () => {
    if (usage.subscription) {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === usage.subscription?.planId);
      if (plan) {
        return usage.superLikesUsed < plan.superLikes;
      }
    }
    return false; // No free super likes
  };

  const useSwipe = () => {
    updateUsage({ swipesUsed: usage.swipesUsed + 1 });
  };

  const useSuperLike = () => {
    updateUsage({ 
      superLikesUsed: usage.superLikesUsed + 1,
      tipsGiven: usage.tipsGiven + 1
    });
  };

  const purchaseSubscription = (planId: string) => {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) return;

    const expiresAt = new Date();
    if (plan.duration === 'daily') {
      expiresAt.setDate(expiresAt.getDate() + 1);
    } else if (plan.duration === 'monthly') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (plan.duration === 'yearly') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    updateUsage({
      subscription: {
        planId,
        expiresAt: expiresAt.toISOString()
      }
    });
  };

  const getRemainingSwipes = () => {
    const freeLimit = 8;
    if (usage.subscription) {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === usage.subscription?.planId);
      if (plan) {
        return plan.swipes === -1 ? -1 : plan.swipes - usage.swipesUsed;
      }
    }
    return Math.max(0, freeLimit - usage.swipesUsed);
  };

  return {
    usage,
    canSwipe: canSwipe(),
    canSuperLike: canSuperLike(),
    useSwipe,
    useSuperLike,
    purchaseSubscription,
    remainingSwipes: getRemainingSwipes(),
    plans: SUBSCRIPTION_PLANS,
    tipsGiven: usage.tipsGiven,
    hasActiveSubscription: !!usage.subscription
  };
}