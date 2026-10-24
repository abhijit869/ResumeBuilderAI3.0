import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json' with { type: 'json' };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

export const githubProvider = new GithubAuthProvider();
githubProvider.addScope('read:user');
githubProvider.addScope('user:email');

export function getLinkedInProvider() {
  const provider = new OAuthProvider('oidc.linkedin');
  provider.addScope('openid');
  provider.addScope('profile');
  provider.addScope('email');
  return provider;
}

export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'system', 'ping'));
  } catch {
    // Expected permission/not-found on empty collection; confirms network/SDK init
  }
}

export default app;
