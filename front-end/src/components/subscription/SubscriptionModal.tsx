import { useState } from 'react';
import { Crown, Check, X } from 'lucide-react';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { SubscriptionPlan } from '../../hooks/useSubscription';
import { parseCUSD, ERC20_ABI } from '../../lib/celo';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: SubscriptionPlan[];
  onPurchase: (planId: string) => void;
}

export function SubscriptionModal({ isOpen, onClose, plans, onPurchase }: SubscriptionModalProps) {
  const { address, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    if (!selectedPlan || !walletClient || !address || !chain || !publicClient) return;
    
    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    setIsProcessing(true);
    try {
      const cUSDAddress = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1' as `0x${string}`;
      const contractAddress = '0xEc2B9dde309737CCaeC137939aCb4f8524876D1d' as `0x${string}`;
      const amountInWei = parseCUSD(plan.price.toString());
      
      console.log('Subscription purchase:', {
        plan: plan.name,
        price: plan.price,
        amountInWei: amountInWei.toString(),
        contractAddress
      });

      // Direct cUSD transfer to contract address for subscription
      const hash = await walletClient.writeContract({
        address: cUSDAddress,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [contractAddress, amountInWei],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      
      onPurchase(selectedPlan);
      onClose();
    } catch (error) {
      console.error('Subscription purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upgrade Your Experience" size="lg">
      <div className="space-y-6">
        <div className="text-center">
          <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-secondary-900 mb-2">
            You've used all your free swipes!
          </h3>
          <p className="text-secondary-600">
            Choose a plan to continue discovering amazing matches
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedPlan === plan.id
                  ? 'ring-2 ring-primary-500 bg-primary-50'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div className="p-6 text-center relative">
                {plan.id === 'daily-gold' && (
                  <Badge variant="primary" className="mb-3">
                    Most Popular
                  </Badge>
                )}
                
                <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                  {plan.name}
                </h4>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-secondary-900">
                    {plan.price}
                  </span>
                  <span className="text-secondary-600 ml-1">cUSD</span>
                  <p className="text-sm text-secondary-500 capitalize">
                    per {plan.duration.replace('ly', '')}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-secondary-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {selectedPlan === plan.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-secondary-50 rounded-xl p-4">
          <h4 className="font-medium text-secondary-900 mb-2">What you get:</h4>
          <ul className="text-sm text-secondary-700 space-y-1">
            <li>• Instant access to more profiles</li>
            <li>• Higher match rates with premium features</li>
            <li>• Support the CeloSoul community</li>
            <li>• Secure payments via Celo blockchain</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={onClose}
            className="flex-1"
            disabled={isProcessing}
          >
            <X className="w-4 h-4 mr-2" />
            Maybe Later
          </Button>
          
          <Button
            variant="primary"
            size="lg"
            onClick={handlePurchase}
            disabled={!selectedPlan || isProcessing}
            isLoading={isProcessing}
            className="flex-1"
          >
            <Crown className="w-4 h-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Purchase Plan'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}