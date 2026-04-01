'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // Get the session from the URL hash (magic link)
      const { data, error } = await supabase.auth.getSession();

      if (error || !data?.session) {
        // Redirect to login if no session
        router.push('/auth/login');
        return;
      }

      // Get user role from dashboard_users
      const userId = data.session.user.id;
      const { data: user } = await supabase
        .from('dashboard_users')
        .select('role')
        .eq('id', userId)
        .single();

      // Redirect based on role
      if (user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/uqa-portal');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Signing you in...</p>
      </div>
    </div>
  );
}
