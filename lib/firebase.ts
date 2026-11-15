import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import baseConfig from '../firebase-applet-config.json' with { type: 'json' };

export const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || baseConfig.projectId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || baseConfig.appId,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || baseConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || baseConfig.authDomain,
  firestoreDatabaseId: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || baseConfig.firestoreDatabaseId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || baseConfig.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || baseConfig.messagingSenderId,
  measurementId: baseConfig.measurementId || '',
  oAuthClientId: process.env.NEXT_PUBLIC_FIREBASE_OAUTH_CLIENT_ID || baseConfig.oAuthClientId,
};

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
