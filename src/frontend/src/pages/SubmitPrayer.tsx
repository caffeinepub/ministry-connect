import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSubmitPrayer } from '../hooks/usePrayers';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, AlertCircle } from 'lucide-react';

export default function SubmitPrayer() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [prayerText, setPrayerText] = useState('');
  const submitPrayer = useSubmitPrayer();

  const isAuthenticated = !!identity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerText.trim()) return;

    try {
      const prayerId = await submitPrayer.mutateAsync(prayerText.trim());
      setPrayerText('');
      navigate({ to: '/prayer/$prayerId', params: { prayerId: prayerId.toString() } });
    } catch (error) {
      console.error('Failed to submit prayer:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container max-w-2xl px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please sign in to submit a prayer request. Click the "Sign In" button in the top right corner.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Submit a Prayer Request</CardTitle>
          <p className="text-sm text-muted-foreground">
            Share what's on your heart. Your prayer will be received with care and compassion.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prayer">Your Prayer</Label>
              <Textarea
                id="prayer"
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                placeholder="Share your prayer request here..."
                className="min-h-[200px] resize-none"
                disabled={submitPrayer.isPending}
              />
              <p className="text-xs text-muted-foreground">
                Take your time. There's no rush in prayer.
              </p>
            </div>

            {submitPrayer.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to submit prayer. Please try again.
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={!prayerText.trim() || submitPrayer.isPending}
              className="w-full gap-2"
              size="lg"
            >
              {submitPrayer.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Submit Prayer
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
