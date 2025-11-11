"use client";

import { authClient } from '@/lib/auth-client';

export const HomeView = () => {
  const { data: session } = authClient.useSession();

  if (!session) {
    return (
      <div>Please sign in to access the application.</div>
    );
  }

  return (
    <div>Home page</div>
  );
};
