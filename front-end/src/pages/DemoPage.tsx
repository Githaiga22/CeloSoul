import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import { TipModal } from '../components/tip/TipModal';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { getCUSDAddress } from '../lib/celo';

export function DemoPage() {
  const { address, isConnected, chain } = useAccount();
  const [showTipModal, setShowTipModal] = useState(false);
  
  const { data: celoBalance } = useBalance({
    address,
  });
  
  const { data: cusdBalance } = useBalance({
    address,
    token: chain ? getCUSDAddress(chain.id) : undefined,
  });

  const demoRecipient = '0x742d35Cc6634C0532925a3b8D4C9db96590C6C87';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-secondary-900">
            CeloSoul Demo
          </h1>
          <p className="text-lg text-secondary-600">
            Wallet-native AI dating for web3 devs
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-secondary-900">
                Wallet Connection
              </h2>
              <ConnectButton />
            </div>

            {isConnected && address && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-secondary-50 rounded-lg p-4">
                    <h3 className="font-medium text-secondary-700 mb-2">
                      CELO Balance
                    </h3>
                    <p className="text-2xl font-bold text-secondary-900">
                      {celoBalance ? `${parseFloat(celoBalance.formatted).toFixed(4)} CELO` : '0 CELO'}
                    </p>
                  </div>
                  
                  <div className="bg-primary-50 rounded-lg p-4">
                    <h3 className="font-medium text-primary-700 mb-2">
                      cUSD Balance
                    </h3>
                    <p className="text-2xl font-bold text-primary-900">
                      {cusdBalance ? `${parseFloat(cusdBalance.formatted).toFixed(2)} cUSD` : '0 cUSD'}
                    </p>
                  </div>
                </div>

                <div className="bg-secondary-50 rounded-lg p-4">
                  <h3 className="font-medium text-secondary-700 mb-2">
                    Connected Address
                  </h3>
                  <p className="font-mono text-sm text-secondary-600 break-all">
                    {address}
                  </p>
                  <p className="text-sm text-secondary-500 mt-1">
                    Network: {chain?.name || 'Unknown'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {isConnected && (
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-secondary-900">
                Test Tipping Feature
              </h2>
              <p className="text-secondary-600">
                Send a tip using the CeloSoulPayments contract
              </p>
              
              <div className="bg-secondary-50 rounded-lg p-4">
                <h3 className="font-medium text-secondary-700 mb-2">
                  Demo Recipient
                </h3>
                <p className="font-mono text-sm text-secondary-600 break-all">
                  {demoRecipient}
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowTipModal(true)}
                disabled={!cusdBalance || parseFloat(cusdBalance.formatted) < 1}
              >
                Send Tip (Requires cUSD)
              </Button>

              {(!cusdBalance || parseFloat(cusdBalance.formatted) < 1) && (
                <p className="text-sm text-danger-600">
                  You need cUSD to send tips. Get testnet cUSD from a faucet.
                </p>
              )}
            </div>
          </Card>
        )}

        <TipModal
          isOpen={showTipModal}
          onClose={() => setShowTipModal(false)}
          recipientId={demoRecipient}
          recipientName="Demo User"
        />
      </div>
    </div>
  );
}