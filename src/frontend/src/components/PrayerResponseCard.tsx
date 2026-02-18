import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PrayerResponseCardProps {
  responseText: string;
  timestamp?: bigint;
}

export default function PrayerResponseCard({ responseText, timestamp }: PrayerResponseCardProps) {
  const formatDate = (ts: bigint) => {
    const date = new Date(Number(ts) / 1_000_000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="pt-6">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-primary" />
          <span className="text-xs font-medium uppercase tracking-wider text-primary">
            Prayer Response
          </span>
        </div>
        <Separator className="mb-4 bg-primary/20" />
        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
          {responseText}
        </p>
        {timestamp && (
          <p className="mt-4 text-xs text-muted-foreground">
            {formatDate(timestamp)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
