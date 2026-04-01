import { supabase } from './supabase';

/**
 * Send magic link to user email
 */
export const sendMagicLink = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Magic link error:', error);
    return { success: false, error };
  }
};

/**
 * Get user profile from dashboard_users table
 */
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('dashboard_users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error fetching profile:', error);
    return null;
  }
};
