import { useState, useRef } from 'react';
import { Heart, X, Sparkles, MessageCircle, Star } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface ProfileCardProps {
  candidate: {
    id: string;
    display_name: string;
    bio: string;
    avatar_url: string | null;
    date_of_birth: string | null;
    interests: string[];
    match_score: number;
    match_reason: string;
    icebreaker: string;
  };
  onApprove: () => void;
  onReject: () => void;
  onSkip: () => void;
  onSuperLike: () => void;
}

export function ProfileCard({ candidate, onApprove, onReject, onSkip, onSuperLike }: ProfileCardProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(candidate.date_of_birth);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setSwipeDirection('left');
      setTimeout(() => {
        onReject();
        setSwipeDirection(null);
      }, 300);
    } else if (isRightSwipe) {
      setSwipeDirection('right');
      setTimeout(() => {
        onApprove();
        setSwipeDirection(null);
      }, 300);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <Card
      ref={cardRef}
      className={`overflow-hidden transition-all duration-300 ${
        swipeDirection === 'left'
          ? 'translate-x-[-100%] opacity-0'
          : swipeDirection === 'right'
          ? 'translate-x-[100%] opacity-0'
          : ''
      }`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative">
        <div className="aspect-[3/4] bg-gradient-to-br from-secondary-200 to-secondary-300 relative">
          {candidate.avatar_url ? (
            <img
              src={candidate.avatar_url}
              alt={candidate.display_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl text-secondary-400">
              👤
            </div>
          )}
          <div className="absolute top-4 right-4">
            <Badge variant="primary" className="text-base font-semibold shadow-lg">
              {candidate.match_score}% Match
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-1">
              {candidate.display_name}
              {age && <span className="text-secondary-600">, {age}</span>}
            </h2>
            <p className="text-secondary-600 leading-relaxed">{candidate.bio}</p>
          </div>

          {candidate.interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {candidate.interests.slice(0, 6).map((interest) => (
                <Badge key={interest} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          )}

          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-primary-800 font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Why you match</span>
            </div>
            <p className="text-secondary-700 text-sm">{candidate.match_reason}</p>
          </div>

          {candidate.icebreaker && (
            <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-secondary-700 font-medium">
                <MessageCircle className="w-4 h-4" />
                <span>Ice breaker</span>
              </div>
              <p className="text-secondary-600 text-sm italic">"{candidate.icebreaker}"</p>
            </div>
          )}

          <div className="space-y-3 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={onSuperLike}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold"
              aria-label="Super Like"
            >
              <Star className="w-5 h-5 mr-2" />
              Super Like (Tip)
            </Button>
            
            <div className="flex gap-3">
              <Button
                variant="danger"
                size="lg"
                onClick={onReject}
                className="flex-1"
                aria-label="Reject"
              >
                <X className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={onSkip}
                className="px-6"
                aria-label="Skip"
              >
                Skip
              </Button>
              <Button
                variant="success"
                size="lg"
                onClick={onApprove}
                className="flex-1"
                aria-label="Approve"
              >
                <Heart className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
