'use client';

import { useState } from 'react';
import { sendMagicLink } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const result = await sendMagicLink(email);

    if (result.success) {
      setMessage(`Magic link sent to ${email}. Check your email!`);
      setEmail('');
    } else {
      setError('Failed to send magic link. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md p-8 bg-slate-800 rounded-lg border border-slate-700 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-2">Mission Control</h1>
        <p className="text-slate-400 mb-8">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium rounded-md transition-colors"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded-md text-green-400 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-md text-red-400 text-sm">
            {error}
          </div>
        )}

        <p className="text-xs text-slate-500 mt-6 text-center">
          Check your email for a magic link to sign in. The link expires in 24 hours.
        </p>
      </div>
    </div>
  );
}
