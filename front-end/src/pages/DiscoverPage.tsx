import { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { ProfileCard } from '../components/discover/ProfileCard';
import { Button } from '../components/ui/Button';
import { TipModal } from '../components/tip/TipModal';
import { SubscriptionModal } from '../components/subscription/SubscriptionModal';
import { useMatchCandidates } from '../hooks/useMatchCandidates';
import { useSubscription } from '../hooks/useSubscription';

export function DiscoverPage() {
  const { candidates, isLoading, error, refetch } = useMatchCandidates();
  const { canSwipe, canSuperLike, useSwipe, useSuperLike, purchaseSubscription, remainingSwipes, plans, tipsGiven, hasActiveSubscription } = useSubscription();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  const currentCandidate = candidates[currentIndex];

  const handleApprove = () => {
    if (!canSwipe) {
      setShowSubscriptionModal(true);
      return;
    }
    console.log('Approved:', currentCandidate?.id);
    useSwipe();
    nextCandidate();
  };

  const handleReject = () => {
    if (!canSwipe) {
      setShowSubscriptionModal(true);
      return;
    }
    console.log('Rejected:', currentCandidate?.id);
    useSwipe();
    nextCandidate();
  };

  const handleSkip = () => {
    if (!canSwipe) {
      setShowSubscriptionModal(true);
      return;
    }
    console.log('Skipped:', currentCandidate?.id);
    useSwipe();
    nextCandidate();
  };

  const handleSuperLike = () => {
    if (!canSuperLike) {
      setShowSubscriptionModal(true);
      return;
    }
    if (currentCandidate) {
      setSelectedCandidate(currentCandidate.id);
      setShowTipModal(true);
    }
  };

  const handleTipComplete = () => {
    useSuperLike();
    useSwipe();
    setShowTipModal(false);
    setSelectedCandidate(null);
    nextCandidate();
  };

  const nextCandidate = () => {
    if (currentIndex < candidates.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Reached end, refetch more candidates
      refetch();
      setCurrentIndex(0);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-secondary-600">Finding your perfect matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-danger-600">Failed to load matches</p>
          <Button variant="primary" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!currentCandidate) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <Sparkles className="w-16 h-16 text-primary-500 mx-auto" />
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">
              No more matches
            </h2>
            <p className="text-secondary-600">
              Check back later for new AI-curated matches!
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => refetch()}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">
            Discover
          </h1>
          <div className="space-y-1">
            <p className="text-secondary-600">
              {candidates.length - currentIndex} matches remaining
            </p>
            <div className="space-y-1">
              <p className="text-sm text-primary-600 font-medium">
                {hasActiveSubscription 
                  ? (remainingSwipes === -1 ? 'Unlimited swipes' : `${remainingSwipes} swipes left`) 
                  : `${remainingSwipes} free swipes left`}
              </p>
              {hasActiveSubscription && (
                <p className="text-xs text-green-600">
                  ✨ Premium Active
                </p>
              )}
              <p className="text-xs text-secondary-500">
                Tips given: {tipsGiven}
              </p>
            </div>
          </div>
        </div>

        <ProfileCard
          candidate={currentCandidate}
          onApprove={handleApprove}
          onReject={handleReject}
          onSkip={handleSkip}
          onSuperLike={handleSuperLike}
        />

        {selectedCandidate && (
          <TipModal
            isOpen={showTipModal}
            onClose={() => {
              setShowTipModal(false);
              setSelectedCandidate(null);
            }}
            recipientId={selectedCandidate}
            recipientName={currentCandidate?.display_name || 'User'}
            onSuccess={handleTipComplete}
          />
        )}

        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          plans={plans}
          onPurchase={(planId) => {
            purchaseSubscription(planId);
            setShowSubscriptionModal(false);
          }}
        />
      </div>
    </div>
  );
}