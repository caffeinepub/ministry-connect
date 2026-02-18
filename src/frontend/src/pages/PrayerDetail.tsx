import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetPrayer } from '../hooks/usePrayers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import PrayerResponseCard from '../components/PrayerResponseCard';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function PrayerDetail() {
  const navigate = useNavigate();
  const { prayerId } = useParams({ from: '/prayer/$prayerId' });
  const { data: prayer, isLoading, isError } = useGetPrayer(BigInt(prayerId));

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="container max-w-2xl px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/history' })}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to History
        </Button>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !prayer) {
    return (
      <div className="container max-w-2xl px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/history' })}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to History
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load prayer details. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/history' })}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to History
      </Button>

      <div className="space-y-6">
        {/* Prayer Request */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Your Prayer Request</CardTitle>
            <p className="text-xs text-muted-foreground">
              {formatDate(prayer.request.timestamp)}
            </p>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
              {prayer.request.text}
            </p>
          </CardContent>
        </Card>

        <Separator />

        {/* Prayer Response */}
        <PrayerResponseCard
          responseText={prayer.response.text}
          timestamp={prayer.response.timestamp}
        />
      </div>
    </div>
  );
}
