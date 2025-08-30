import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { SplashScreen } from './SplashScreen';
import { useAuth } from '@/app/hooks/useAuth';

type Props = { children: React.ReactNode };

export function AppGate({ children }: Props) {
  const router = useRouter();
  const { loading, authenticated } = useAuth();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.replace('/login');
    }
  }, [loading, authenticated, router]);

  if (loading || !authenticated) {
    return <SplashScreen message="Checking session…" />;
  }

  return <>{children}</>;
}
