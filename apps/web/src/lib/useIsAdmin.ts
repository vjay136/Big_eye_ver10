import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { useAuth } from './auth';

export function useIsAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsAdmin(false);
    setLoading(true);
    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (!cancelled && !error && data) {
          setIsAdmin(data.is_admin || false);
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
    return () => { cancelled = true; };
  }, [user]);

  return { isAdmin, loading };
}
