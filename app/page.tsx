'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data?.session) {
        // Not logged in, go to login
        router.push('/auth/login');
        return;
      }

      // Logged in, redirect to dashboard
      const userId = data.session.user.id;
      const { data: user } = await supabase
        .from('dashboard_users')
        .select('role')
        .eq('id', userId)
        .single();

      if (user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/uqa-portal');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <p className="text-slate-400">Redirecting...</p>
    </div>
  );
}
