'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
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

      if (userProfile?.role !== 'admin') {
        router.push('/uqa-portal');
        return;
      }

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
          <h1 className="text-2xl font-bold text-white">Mission Control</h1>
          <div className="flex items-center gap-4">
            <p className="text-slate-300">Welcome, {user?.name}</p>
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
          <h2 className="text-3xl font-bold text-white mb-4">Admin Dashboard</h2>
          <p className="text-slate-300 mb-6">
            Welcome to Mission Control, {user?.name}. This is the admin dashboard.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700 p-6 rounded-lg border border-slate-600">
              <h3 className="text-lg font-semibold text-white mb-2">UQA Portal</h3>
              <p className="text-slate-400 text-sm mb-4">Manage UQA tasks and projects</p>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                Open UQA
              </button>
            </div>

            <div className="bg-slate-700 p-6 rounded-lg border border-slate-600">
              <h3 className="text-lg font-semibold text-white mb-2">Trade Central</h3>
              <p className="text-slate-400 text-sm mb-4">View trading metrics and performance</p>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                Open Trading
              </button>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-900/20 border border-blue-700 rounded-lg">
            <p className="text-blue-300 text-sm">
              ✓ Authentication working | ✓ Admin access verified | Phase 1 (Minimal) Live
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
