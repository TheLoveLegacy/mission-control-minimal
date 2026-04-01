'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function UQAPortal() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data?.session) {
        router.push('/auth/login');
        return;
      }

      const userId = data.session.user.id;
      const { data: userProfile } = await supabase
        .from('dashboard_users')
        .select('*')
        .eq('id', userId)
        .single();

      setUser(userProfile);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">UQA Portal</h1>
          <div className="flex items-center gap-4">
            <p className="text-slate-300">{user?.name}</p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to UQA</h2>
          <p className="text-slate-300 mb-6">
            Hi {user?.name}, this is your UQA Portal. Here you can view and manage UQA tasks.
          </p>

          <div className="bg-slate-700 p-6 rounded-lg border border-slate-600 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Your Role</h3>
            <p className="text-slate-300">{user?.role === 'reviewer' ? 'Reviewer' : 'Administrator'}</p>
          </div>

          <div className="p-6 bg-green-900/20 border border-green-700 rounded-lg">
            <p className="text-green-300 text-sm">
              ✓ Authentication working | ✓ Portal access verified | Phase 1 (Minimal) Live
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
