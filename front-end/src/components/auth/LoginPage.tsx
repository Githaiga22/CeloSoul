import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Heart } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';

export function LoginPage() {
  const { loginTestMode, user } = useAuth();
  const navigate = useNavigate();
  const [isTestMode, setIsTestMode] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/app/discover');
    }
  }, [user, navigate]);

  const handleTestLogin = async () => {
    if (!testEmail.trim()) return;

    setIsLoading(true);
    try {
      await loginTestMode(testEmail);
      navigate('/app');
    } catch (error) {
      console.error('Test login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-12 h-12 text-primary-500 fill-primary-500" />
            <h1 className="text-4xl font-bold text-secondary-900">CeloSoul</h1>
          </div>
          <p className="text-lg text-secondary-600">
            Find meaningful connections through AI-curated matches
          </p>
        </div>

        <Card>
          <CardBody className="space-y-6">
            {!isTestMode ? (
              <>
                <div>
                  <h2 className="text-xl font-semibold text-secondary-900 mb-2">
                    Connect Your Wallet
                  </h2>
                  <p className="text-sm text-secondary-600 mb-4">
                    Connect with Valora, MetaMask, or any WalletConnect-compatible wallet
                  </p>
                  <div className="flex justify-center">
                    <ConnectButton />
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-secondary-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-secondary-500">or</span>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setIsTestMode(true)}
                >
                  Continue in Test Mode
                </Button>

                <p className="text-xs text-secondary-500 text-center">
                  Test mode allows you to explore the app without connecting a wallet
                </p>
              </>
            ) : (
              <>
                <div>
                  <h2 className="text-xl font-semibold text-secondary-900 mb-2">
                    Test Mode Login
                  </h2>
                  <p className="text-sm text-secondary-600 mb-4">
                    Enter any email to create a test account
                  </p>
                </div>

                <Input
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleTestLogin();
                    }
                  }}
                />

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => setIsTestMode(false)}
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleTestLogin}
                    isLoading={isLoading}
                    disabled={!testEmail.trim()}
                  >
                    Continue
                  </Button>
                </div>
              </>
            )}
          </CardBody>
        </Card>

        <div className="text-center text-sm text-secondary-500">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}
