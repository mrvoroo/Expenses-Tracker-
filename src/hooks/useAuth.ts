import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { subscribeToAuth, signOut as authSignOut } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signOut() {
    await authSignOut();
  }

  return { user, loading, signOut };
}
