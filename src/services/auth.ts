import { createClient } from '@supabase/supabase-js';
import { jwtDecode } from 'jwt-decode';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
}

export const auth = {
  async login(email: string, password: string): Promise<AuthTokens> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      access_token: data.session?.access_token || '',
      refresh_token: data.session?.refresh_token || '',
    };
  },

  async register(email: string, password: string): Promise<AuthTokens> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      access_token: data.session?.access_token || '',
      refresh_token: data.session?.refresh_token || '',
    };
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },

  async refreshToken(refresh_token: string): Promise<AuthTokens> {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      throw new Error(error.message);
    }

    return {
      access_token: data.session?.access_token || '',
      refresh_token: data.session?.refresh_token || '',
    };
  },

  decodeToken(token: string): JWTPayload {
    return jwtDecode(token);
  },

  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw new Error(error.message);
    }

    return user;
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { data };
  }
};