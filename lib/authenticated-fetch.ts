import { auth } from './firebase';

export async function authenticatedFetch(input: string, init: RequestInit = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error('Cloud sync requires a Firebase sign-in. Local data remains on this device.');
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${await user.getIdToken()}`);
  return fetch(input, { ...init, headers });
}
