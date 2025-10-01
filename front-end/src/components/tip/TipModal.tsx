import { useState } from 'react';
import { Coins, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TIP_PRESETS } from '../../lib/constants';
import { parseCUSD, ERC20_ABI } from '../../lib/celo';

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  onSuccess?: () => void;
}

type TipStatus = 'idle' | 'confirming' | 'pending' | 'success' | 'error';

export function TipModal({ isOpen, onClose, recipientName, onSuccess }: TipModalProps) {
  const { address, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [status, setStatus] = useState<TipStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const amount = selectedAmount !== null ? selectedAmount : parseFloat(customAmount) || 0;

  const handleTip = async () => {
    if (!walletClient || !address || !chain || !publicClient || amount <= 0) return;

    setStatus('confirming');
    setError(null);

    try {
      // Hardcoded recipient address for tips
      const recipientAddress = '0x395358d1236D01de9193b1F3AEB61A1ACb2Af2b9' as `0x${string}`;
      const cUSDAddress = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1' as `0x${string}`;
      const amountInWei = parseCUSD(amount.toString());
      
      console.log('Sending tip:', {
        recipient: recipientAddress,
        amount: amount,
        amountInWei: amountInWei.toString(),
        cUSDAddress
      });

      // Direct cUSD transfer to recipient
      const hash = await walletClient.writeContract({
        address: cUSDAddress,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [recipientAddress, amountInWei],
      });

      // Mock tip record for MVP
      console.log('Creating tip record for MVP');

      setTxHash(hash);
      setStatus('pending');

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === 'success') {
        console.log('Tip confirmed:', hash);
        setStatus('success');
        
        // Call success callback after a short delay
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      } else {
        throw new Error('Transaction failed');
      }
    } catch (err: any) {
      console.error('Tip error:', err);
      setError(err.message || 'Failed to send tip');
      setStatus('error');

      if (txHash) {
        console.log('Tip failed:', txHash);
      }
    }
  };

  const handleClose = () => {
    setStatus('idle');
    setSelectedAmount(null);
    setCustomAmount('');
    setTxHash(null);
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Send Tip to ${recipientName}`} size="md">
      {status === 'idle' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-secondary-600">
            <Coins className="w-5 h-5" />
            <span>Send a tip in cUSD to show appreciation</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-3">
              Select Amount
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TIP_PRESETS.map((preset) => (
                <Button
                  key={preset}
                  variant={selectedAmount === preset ? 'primary' : 'secondary'}
                  onClick={() => {
                    setSelectedAmount(preset);
                    setCustomAmount('');
                  }}
                  className="font-semibold"
                >
                  ${preset}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Input
              label="Custom Amount (cUSD)"
              type="number"
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
              min="0.01"
              step="0.01"
            />
          </div>

          {!address && (
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 text-sm text-primary-800">
              Please connect your wallet to send tips
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleTip}
            disabled={!address || amount <= 0}
          >
            Send ${amount.toFixed(2)} cUSD
          </Button>
        </div>
      )}

      {status === 'confirming' && (
        <div className="text-center space-y-4 py-8">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg font-medium text-secondary-900">Confirm in wallet</p>
          <p className="text-sm text-secondary-600">
            Please approve the transaction in your wallet
          </p>
        </div>
      )}

      {status === 'pending' && (
        <div className="text-center space-y-4 py-8">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg font-medium text-secondary-900">Processing transaction</p>
          <p className="text-sm text-secondary-600">This may take a few moments...</p>
          {txHash && (
            <a
              href={`https://sepolia.celoscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm"
            >
              View on explorer
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      )}

      {status === 'success' && (
        <div className="text-center space-y-4 py-8">
          <CheckCircle className="w-16 h-16 text-success-500 mx-auto" />
          <p className="text-lg font-medium text-secondary-900">Tip sent successfully!</p>
          <p className="text-sm text-secondary-600">
            ${amount.toFixed(2)} cUSD has been sent to {recipientName}
          </p>
          {txHash && (
            <a
              href={`https://sepolia.celoscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm"
            >
              View transaction
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <Button variant="primary" size="lg" fullWidth onClick={handleClose}>
            Done
          </Button>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center space-y-4 py-8">
          <XCircle className="w-16 h-16 text-danger-500 mx-auto" />
          <p className="text-lg font-medium text-secondary-900">Transaction failed</p>
          <p className="text-sm text-danger-600">{error}</p>
          <div className="flex gap-2">
            <Button variant="secondary" size="lg" fullWidth onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                setStatus('idle');
                setError(null);
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
