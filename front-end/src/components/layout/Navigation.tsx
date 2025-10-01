import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, MessageSquare, User, Sparkles, Crown } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SubscriptionModal } from '../subscription/SubscriptionModal';
import { useSubscription } from '../../hooks/useSubscription';

export function Navigation() {
  const { plans, purchaseSubscription } = useSubscription();
  const [showPricingModal, setShowPricingModal] = useState(false);
  
  const navItems = [
    { to: '/app/discover', icon: Sparkles, label: 'Discover' },
    { to: '/app/matches', icon: MessageSquare, label: 'Matches' },
    { to: '/app/profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      <header className="bg-white border-b border-secondary-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <NavLink to="/app/discover" className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-primary-500 fill-primary-500" />
              <span className="text-2xl font-bold text-secondary-900 hidden sm:inline">
                CeloSoul
              </span>
            </NavLink>

            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-medium ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
              <button
                onClick={() => setShowPricingModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-medium text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50"
              >
                <Crown className="w-5 h-5" />
                <span>Pricing</span>
              </button>
            </nav>

            <div className="hidden md:block">
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-secondary-100 z-40">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors touch-target ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-secondary-500'
                }`
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <SubscriptionModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        plans={plans}
        onPurchase={(planId) => {
          purchaseSubscription(planId);
          setShowPricingModal(false);
        }}
      />
    </>
  );
}
