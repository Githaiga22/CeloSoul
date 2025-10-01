import { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { ProfileCard } from '../components/discover/ProfileCard';
import { Button } from '../components/ui/Button';
import { useMatchCandidates } from '../hooks/useMatchCandidates';

export function DiscoverPage() {
  const { candidates, isLoading, error, refetch } = useMatchCandidates();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCandidate = candidates[currentIndex];

  const handleApprove = () => {
    console.log('Approved:', currentCandidate?.id);
    // TODO: Send tip or create match
    nextCandidate();
  };

  const handleReject = () => {
    console.log('Rejected:', currentCandidate?.id);
    nextCandidate();
  };

  const handleSkip = () => {
    console.log('Skipped:', currentCandidate?.id);
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
          <p className="text-secondary-600">
            {candidates.length - currentIndex} matches remaining
          </p>
        </div>

        <ProfileCard
          candidate={currentCandidate}
          onApprove={handleApprove}
          onReject={handleReject}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
}