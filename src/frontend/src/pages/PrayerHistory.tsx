import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetPrayerHistory } from '../hooks/usePrayers';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ChevronRight } from 'lucide-react';

export default function PrayerHistory() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: prayers, isLoading, isError } = useGetPrayerHistory();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container max-w-2xl px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please sign in to view your prayer history. Click the "Sign In" button in the top right corner.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Prayer History</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="mb-2 h-4 w-32" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container max-w-2xl px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load prayer history. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const sortedPrayers = [...(prayers || [])].sort(
    (a, b) => Number(b.request.timestamp) - Number(a.request.timestamp)
  );

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="container max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Prayer History</h1>

      {sortedPrayers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              You haven't submitted any prayers yet.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Visit the Submit tab to share your first prayer request.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedPrayers.map((prayer) => (
            <Card
              key={prayer.prayerId.toString()}
              className="cursor-pointer transition-colors hover:bg-accent/50"
              onClick={() =>
                navigate({
                  to: '/prayer/$prayerId',
                  params: { prayerId: prayer.prayerId.toString() },
                })
              }
            >
              <CardContent className="flex items-start justify-between gap-4 pt-6">
                <div className="flex-1 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {formatDate(prayer.request.timestamp)}
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {truncateText(prayer.request.text, 150)}
                  </p>
                </div>
                <ChevronRight className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
