import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Send, BookOpen, Heart } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="container max-w-4xl px-4 py-8">
      {/* Hero Section */}
      <div className="relative mb-12 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
        <img
          src="/assets/generated/prayer-hero-bg.dim_1440x900.png"
          alt="Prayer background"
          className="h-64 w-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <img
            src="/assets/generated/ministry-mark.dim_512x512.png"
            alt="Ministry"
            className="mb-4 h-16 w-16 opacity-90"
          />
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Welcome to Prayer Ministry
          </h1>
          <p className="max-w-md text-sm text-muted-foreground sm:text-base">
            A sacred space to share your prayers and receive spiritual guidance
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mb-12 space-y-4">
        {isAuthenticated ? (
          <>
            <Button
              onClick={() => navigate({ to: '/submit' })}
              size="lg"
              className="w-full gap-2 text-base"
            >
              <Send className="h-5 w-5" />
              Submit a Prayer Request
            </Button>
            <Button
              onClick={() => navigate({ to: '/history' })}
              variant="outline"
              size="lg"
              className="w-full gap-2 text-base"
            >
              <BookOpen className="h-5 w-5" />
              View Prayer History
            </Button>
          </>
        ) : (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6 text-center">
              <p className="mb-4 text-sm text-muted-foreground">
                Please sign in to submit prayers and view your prayer history
              </p>
              <p className="text-xs text-muted-foreground">
                Click the "Sign In" button in the top right corner to get started
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Send className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">Share Your Heart</h3>
            <p className="text-sm text-muted-foreground">
              Submit your prayer requests and receive thoughtful, uplifting responses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">Reflect & Revisit</h3>
            <p className="text-sm text-muted-foreground">
              Access your prayer history anytime to reflect on your spiritual journey
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-border/40 pt-8 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Prayer Ministry •{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              window.location.hostname
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Built with <Heart className="inline h-3 w-3 fill-current" /> using caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
