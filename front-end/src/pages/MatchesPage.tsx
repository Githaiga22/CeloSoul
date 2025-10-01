import { useState } from 'react';
import { MessageSquare, Heart, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ChatModal } from '../components/chat/ChatModal';
import { TipModal } from '../components/tip/TipModal';
import { useMatches } from '../hooks/useMatches';

export function MatchesPage() {
  const { matches, isLoading } = useMatches();
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showTip, setShowTip] = useState(false);

  const handleStartChat = (matchId: string) => {
    setSelectedMatch(matchId);
    setShowChat(true);
  };

  const handleSendTip = (matchId: string) => {
    setSelectedMatch(matchId);
    setShowTip(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <Heart className="w-16 h-16 text-secondary-300 mx-auto" />
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">
              No matches yet
            </h2>
            <p className="text-secondary-600">
              Start swiping to find your perfect matches!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const selectedMatchData = matches.find(m => m.id === selectedMatch);

  return (
    <div className="min-h-screen bg-secondary-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">
            Your Matches
          </h1>
          <p className="text-secondary-600">
            {matches.length} mutual connections
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <Card key={match.id} className="overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-secondary-200 to-secondary-300 relative">
                {match.avatar_url ? (
                  <img
                    src={match.avatar_url}
                    alt={match.display_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-secondary-400">
                    👤
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant="success" className="text-xs">
                    <Heart className="w-3 h-3 mr-1" />
                    Match
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-secondary-900">
                    {match.display_name}
                  </h3>
                  <p className="text-sm text-secondary-600 line-clamp-2">
                    {match.bio}
                  </p>
                </div>

                {match.last_message ? (
                  <div className="text-xs text-secondary-500 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span className="truncate">{match.last_message}</span>
                  </div>
                ) : (
                  <div className="text-xs text-secondary-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>New match</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => handleStartChat(match.id)}
                    className="gap-1"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSendTip(match.id)}
                    className="gap-1 px-3"
                  >
                    <Heart className="w-4 h-4" />
                    Tip
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedMatchData && (
        <>
          <ChatModal
            isOpen={showChat}
            onClose={() => {
              setShowChat(false);
              setSelectedMatch(null);
            }}
            matchId={selectedMatch!}
            matchName={selectedMatchData.display_name}
          />
          <TipModal
            isOpen={showTip}
            onClose={() => {
              setShowTip(false);
              setSelectedMatch(null);
            }}
            recipientId={selectedMatchData.wallet_address || selectedMatch!}
            recipientName={selectedMatchData.display_name}
          />
        </>
      )}
    </div>
  );
}