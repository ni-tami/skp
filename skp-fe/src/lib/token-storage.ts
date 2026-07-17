import * as SecureStore from 'expo-secure-store';

const AUTH_SESSION_KEY = 'auth_session';

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  display_name: string;
  status: string;
}

export interface StoredAuthSession {
  token: string;
  user: AuthUser;
}

export async function getStoredSession(): Promise<StoredAuthSession | null> {
  const raw = await SecureStore.getItemAsync(AUTH_SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function setStoredSession(session: StoredAuthSession): Promise<void> {
  await SecureStore.setItemAsync(AUTH_SESSION_KEY, JSON.stringify(session));
}

export async function clearStoredSession(): Promise<void> {
  await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
}
