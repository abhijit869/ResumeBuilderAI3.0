import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  githubProvider,
  getLinkedInProvider,
} from './firebase';
import { validatePasswordStrength } from './password-validator';
import {
  isValidEmailAddress,
} from './security-utils';
export { validatePasswordStrength };

export interface AppUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  providerId?: string;
  plan: string;
  isAnonymous: boolean;
  createdAt?: string;
}

/**
 * Normalizes or creates the user record in Firestore under /users/{uid}
 */
async function syncUserProfileRecord(
  fbUser: FirebaseUser,
  providerLabel: string = 'password'
): Promise<AppUserProfile> {
  const userDocRef = doc(db, 'users', fbUser.uid);
  let displayName =
    fbUser.displayName ||
    fbUser.email?.split('@')[0] ||
    'Professional Candidate';
  let plan = 'ResumeBuilderAi 3.0 Pro';
  let photoURL = fbUser.photoURL || undefined;

  try {
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      displayName = data.displayName || displayName;
      plan = data.plan || plan;
      photoURL = data.photoURL || photoURL;
    } else {
      // First time user: create profile entity
      const newRecord = {
        id: fbUser.uid,
        email: (fbUser.email || '').slice(0, 254),
        displayName: displayName.slice(0, 120),
        photoURL: (photoURL || '').slice(0, 500),
        providerId: providerLabel.slice(0, 64),
        plan: plan.slice(0, 64),
        createdAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, newRecord);
    }
  } catch (err) {
    console.warn('Firestore user record sync notice:', err);
  }

  return {
    uid: fbUser.uid,
    email: fbUser.email || '',
    displayName,
    photoURL,
    providerId: providerLabel,
    plan,
    isAnonymous: false,
    createdAt: new Date().toISOString(),
  };
}

// Firebase is the sole authority for signed-in identities. Browser storage and
// local/demo profiles must never stand in for a successful provider sign-in.
export async function signUpUser(email: string, pass: string, fullName: string): Promise<AppUserProfile> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!isValidEmailAddress(normalizedEmail)) throw new Error('Please enter a valid email address.');
  const check = validatePasswordStrength(pass);
  if (!check.valid) throw new Error(check.message);
  const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
  const displayName = fullName.trim().slice(0, 120);
  if (displayName) await updateProfile(credential.user, { displayName });
  return syncUserProfileRecord(credential.user, 'password');
}

export async function signInUser(email: string, pass: string): Promise<AppUserProfile> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!isValidEmailAddress(normalizedEmail)) throw new Error('Please enter a valid email address.');
  if (!pass) throw new Error('Please enter your password.');
  const credential = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
  return syncUserProfileRecord(credential.user, 'password');
}

export async function sendPasswordReset(email: string): Promise<{ success: boolean }> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!isValidEmailAddress(normalizedEmail)) throw new Error('Please enter a valid email address.');
  await sendPasswordResetEmail(auth, normalizedEmail);
  return { success: true };
}

export async function signInWithGoogle(): Promise<AppUserProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  return syncUserProfileRecord(result.user, 'google.com');
}

export async function signInWithGithub(): Promise<AppUserProfile> {
  const result = await signInWithPopup(auth, githubProvider);
  return syncUserProfileRecord(result.user, 'github.com');
}

export async function signInWithLinkedIn(): Promise<AppUserProfile> {
  const result = await signInWithPopup(auth, getLinkedInProvider());
  return syncUserProfileRecord(result.user, 'linkedin.com');
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

export function subscribeToAuthChanges(callback: (user: AppUserProfile | null) => void): () => void {
  let active = true;
  const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser || fbUser.isAnonymous) {
      callback(null);
      return;
    }
    const profile = await syncUserProfileRecord(fbUser, fbUser.providerData?.[0]?.providerId || 'password');
    // A profile lookup may finish after sign-out or unmount.
    if (active && auth.currentUser?.uid === fbUser.uid) callback(profile);
  });
  return () => {
    active = false;
    unsubscribe();
  };
}
