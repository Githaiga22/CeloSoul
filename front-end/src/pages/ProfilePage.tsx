import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Settings, LogOut, Wallet, Heart } from 'lucide-react';
import { useAccount, useBalance } from 'wagmi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProfileEditModal } from '../components/profile/ProfileEditModal';
import { useAuth } from '../contexts/AuthContext';
import { getCUSDAddress } from '../lib/celo';

export function ProfilePage() {
  const { user, logout, isTestMode } = useAuth();
  const { address, chain } = useAccount();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: celoBalance } = useBalance({
    address,
  });

  const { data: cusdBalance } = useBalance({
    address,
    token: chain ? getCUSDAddress(chain.id) : undefined,
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-secondary-900">Profile</h1>
        </div>

        {/* Profile Card */}
        <Card className="overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-secondary-200 to-secondary-300 relative max-w-xs mx-auto">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-secondary-400">
                👤
              </div>
            )}
          </div>

          <div className="p-6 space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-secondary-900 mb-1">
                {user.display_name}
              </h2>
              <p className="text-secondary-600">{user.bio}</p>
            </div>

            {user.interests && user.interests.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {user.interests.map((interest) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            )}

            <Button
              variant="primary"
              fullWidth
              onClick={() => setShowEditModal(true)}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Wallet Info */}
        {!isTestMode && address && (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-secondary-900">
                Wallet
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary-50 rounded-lg p-4">
                <p className="text-sm text-secondary-600 mb-1">Address</p>
                <p className="font-mono text-sm text-secondary-900 break-all">
                  {address}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary-50 rounded-lg p-4">
                  <p className="text-sm text-secondary-600 mb-1">CELO</p>
                  <p className="text-lg font-semibold text-secondary-900">
                    {celoBalance ? parseFloat(celoBalance.formatted).toFixed(4) : '0'}
                  </p>
                </div>
                <div className="bg-primary-50 rounded-lg p-4">
                  <p className="text-sm text-primary-600 mb-1">cUSD</p>
                  <p className="text-lg font-semibold text-primary-900">
                    {cusdBalance ? parseFloat(cusdBalance.formatted).toFixed(2) : '0'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Test Mode Info */}
        {isTestMode && (
          <Card className="p-6 bg-primary-50 border-primary-200">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-primary-900">
                Test Mode
              </h3>
            </div>
            <p className="text-sm text-primary-700">
              You're using CeloSoul in test mode. Connect a wallet for full functionality.
            </p>
          </Card>
        )}

        {/* Stats */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-5 h-5 text-danger-500" />
            <h3 className="text-lg font-semibold text-secondary-900">
              Activity
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-secondary-900">0</p>
              <p className="text-sm text-secondary-600">Matches</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">0</p>
              <p className="text-sm text-secondary-600">Tips Sent</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">0</p>
              <p className="text-sm text-secondary-600">Tips Received</p>
            </div>
          </div>
        </Card>

        {/* Logout */}
        <Button
          variant="danger"
          fullWidth
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          {isTestMode ? 'Exit Test Mode' : 'Disconnect Wallet'}
        </Button>
      </div>

      <ProfileEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
}