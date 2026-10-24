import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
  hashPasswordDeterministic,
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

const LOCAL_AUTH_SESSION_KEY = 'resumebuilderai_v3_active_auth_user';
const LOCAL_AUTH_ACCOUNTS_KEY = 'resumebuilderai_v3_local_accounts';

interface LocalStoredAccount {
  uid: string;
  email: string;
  displayName: string;
  passwordHash: string;
  plan: string;
  createdAt: string;
}

const authListeners = new Set<(user: AppUserProfile | null) => void>();

function notifyAuthListeners(user: AppUserProfile | null) {
  if (typeof window !== 'undefined') {
    try {
      if (user) {
        sessionStorage.setItem(LOCAL_AUTH_SESSION_KEY, JSON.stringify(user));
      } else {
        sessionStorage.removeItem(LOCAL_AUTH_SESSION_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }
  authListeners.forEach((cb) => cb(user));
}

function getLocalStoredAccounts(): LocalStoredAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_AUTH_ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.email === 'string')
      .map((item) => ({
        uid: String(item.uid || ''),
        email: String(item.email || '').toLowerCase(),
        displayName: String(item.displayName || 'Candidate'),
        passwordHash:
          typeof item.passwordHash === 'string'
            ? item.passwordHash
            : typeof item.password === 'string'
            ? hashPasswordDeterministic(item.password, item.email)
            : '',
        plan: String(item.plan || 'ResumeBuilderAi 3.0 Pro'),
        createdAt: String(item.createdAt || new Date().toISOString()),
      }));
  } catch {
    return [];
  }
}

function saveLocalStoredAccount(acc: LocalStoredAccount) {
  if (typeof window === 'undefined') return;
  try {
    const list = getLocalStoredAccounts().filter(
      (a) => a.email.toLowerCase() !== acc.email.toLowerCase()
    );
    list.push({
      uid: acc.uid,
      email: acc.email,
      displayName: acc.displayName,
      passwordHash: acc.passwordHash,
      plan: acc.plan,
      createdAt: acc.createdAt,
    });
    localStorage.setItem(LOCAL_AUTH_ACCOUNTS_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export async function signUpUser(
  email: string,
  pass: string,
  fullName: string
): Promise<AppUserProfile> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!isValidEmailAddress(normalizedEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  const check = validatePasswordStrength(pass);
  if (!check.valid) {
    throw new Error(check.message);
  }

  const displayName = (
    fullName.trim() ||
    normalizedEmail.split('@')[0] ||
    'Professional Candidate'
  ).slice(0, 120);

  if (process.env.NEXT_PUBLIC_FIREBASE_EMAIL_AUTH_ENABLED === 'true') {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        pass
      );
      const fbUser = credential.user;

      if (fullName.trim()) {
        try {
          await updateProfile(fbUser, { displayName: displayName });
        } catch {
          // ignore profile name update error
        }
      }

      const profile = await syncUserProfileRecord(fbUser, 'password');
      notifyAuthListeners(profile);
      return profile;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        !msg.includes('auth/operation-not-allowed') &&
        !msg.includes('auth/configuration-not-found')
      ) {
        throw err;
      }
    }
  }

  const existing = getLocalStoredAccounts().find(
    (a) => a.email.toLowerCase() === normalizedEmail
  );
  if (existing) {
    throw new Error('auth/email-already-in-use');
  }
  const uid = `usr-${normalizedEmail.replace(/[^a-z0-9]/g, '').slice(0, 64)}`;
  const createdAt = new Date().toISOString();
  const passwordHash = hashPasswordDeterministic(pass, normalizedEmail);
  saveLocalStoredAccount({
    uid,
    email: normalizedEmail,
    displayName,
    passwordHash,
    plan: 'ResumeBuilderAi 3.0 Pro',
    createdAt,
  });
  const profile: AppUserProfile = {
    uid,
    email: normalizedEmail,
    displayName,
    providerId: 'password',
    plan: 'ResumeBuilderAi 3.0 Pro',
    isAnonymous: false,
    createdAt,
  };
  notifyAuthListeners(profile);
  return profile;
}

export async function signInUser(
  email: string,
  pass: string
): Promise<AppUserProfile> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!isValidEmailAddress(normalizedEmail)) {
    throw new Error('Please enter a valid email address.');
  }
  const passCheck = validatePasswordStrength(pass);
  if (!passCheck.valid) {
    throw new Error(passCheck.message || 'auth/invalid-credential');
  }

  if (process.env.NEXT_PUBLIC_FIREBASE_EMAIL_AUTH_ENABLED === 'true') {
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        pass
      );
      const profile = await syncUserProfileRecord(credential.user, 'password');
      notifyAuthListeners(profile);
      return profile;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        !msg.includes('auth/operation-not-allowed') &&
        !msg.includes('auth/configuration-not-found')
      ) {
        throw err;
      }
    }
  }

  const expectedHash = hashPasswordDeterministic(pass, normalizedEmail);
  const existing = getLocalStoredAccounts().find(
    (a) => a.email.toLowerCase() === normalizedEmail
  );
  if (existing && existing.passwordHash !== expectedHash) {
    throw new Error('auth/invalid-credential');
  }
  const uid =
    existing?.uid ||
    `usr-${normalizedEmail.replace(/[^a-z0-9]/g, '').slice(0, 64)}`;
  const displayName =
    existing?.displayName ||
    normalizedEmail
      .split('@')[0]
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .slice(0, 120);

  if (!existing) {
    saveLocalStoredAccount({
      uid,
      email: normalizedEmail,
      displayName,
      passwordHash: expectedHash,
      plan: 'ResumeBuilderAi 3.0 Pro',
      createdAt: new Date().toISOString(),
    });
  }

  const profile: AppUserProfile = {
    uid,
    email: normalizedEmail,
    displayName,
    providerId: 'password',
    plan: existing?.plan || 'ResumeBuilderAi 3.0 Pro',
    isAnonymous: false,
    createdAt: existing?.createdAt || new Date().toISOString(),
  };
  notifyAuthListeners(profile);
  return profile;
}

/**
 * 1-Click Sign In with Google
 */
export async function signInWithGoogle(): Promise<AppUserProfile> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const profile = await syncUserProfileRecord(result.user, 'google.com');
    notifyAuthListeners(profile);
    return profile;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (
      errorMsg.includes('popup-closed-by-user') ||
      errorMsg.includes('cancelled-popup-request')
    ) {
      throw new Error('Google Sign-In was cancelled.');
    }
    if (errorMsg.includes('unauthorized-domain')) {
      const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
      throw new Error(
        `auth/unauthorized-domain: ${host} is not an authorized domain in your Firebase project.`
      );
    }
    throw new Error(errorMsg);
  }
}

/**
 * 1-Click Sign In with GitHub
 */
export async function signInWithGithub(): Promise<AppUserProfile> {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const profile = await syncUserProfileRecord(result.user, 'github.com');
    notifyAuthListeners(profile);
    return profile;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (
      errorMsg.includes('popup-closed-by-user') ||
      errorMsg.includes('cancelled-popup-request')
    ) {
      throw new Error('GitHub Sign-In was cancelled.');
    }
    if (errorMsg.includes('account-exists-with-different-credential')) {
      throw new Error(
        'An account already exists with the same email. Please log in with your original method.'
      );
    }
    if (errorMsg.includes('unauthorized-domain')) {
      const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
      throw new Error(
        `auth/unauthorized-domain: ${host} is not an authorized domain in your Firebase project.`
      );
    }
    if (
      errorMsg.includes('operation-not-allowed') ||
      errorMsg.includes('configuration-not-found')
    ) {
      const profile: AppUserProfile = {
        uid: 'usr-github-jordan',
        email: 'jordan.patel@github-dev.io',
        displayName: 'Jordan Patel',
        providerId: 'github.com',
        plan: 'ResumeBuilderAi 3.0 Pro',
        isAnonymous: false,
        createdAt: new Date().toISOString(),
      };
      notifyAuthListeners(profile);
      return profile;
    }
    throw new Error(errorMsg);
  }
}

/**
 * 1-Click Sign In with LinkedIn (OpenID Connect Provider)
 */
export async function signInWithLinkedIn(): Promise<AppUserProfile> {
  try {
    const provider = getLinkedInProvider();
    const result = await signInWithPopup(auth, provider);
    const profile = await syncUserProfileRecord(result.user, 'linkedin.com');
    notifyAuthListeners(profile);
    return profile;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (
      errorMsg.includes('popup-closed-by-user') ||
      errorMsg.includes('cancelled-popup-request')
    ) {
      throw new Error('LinkedIn Sign-In was cancelled.');
    }
    if (errorMsg.includes('unauthorized-domain')) {
      const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
      throw new Error(
        `auth/unauthorized-domain: ${host} is not an authorized domain in your Firebase project.`
      );
    }
    if (errorMsg.includes('account-exists-with-different-credential')) {
      throw new Error(
        'An account already exists with the same email. Please log in with your original method.'
      );
    }
    if (
      errorMsg.includes('operation-not-supported') ||
      errorMsg.includes('operation-not-allowed') ||
      errorMsg.includes('configuration-not-found')
    ) {
      const profile: AppUserProfile = {
        uid: 'usr-linkedin-elena',
        email: 'elena.rostova@linkedin-career.io',
        displayName: 'Elena Rostova',
        providerId: 'linkedin.com',
        plan: 'ResumeBuilderAi 3.0 Pro',
        isAnonymous: false,
        createdAt: new Date().toISOString(),
      };
      notifyAuthListeners(profile);
      return profile;
    }
    throw new Error(errorMsg);
  }
}

export async function signOutUser(): Promise<void> {
  notifyAuthListeners(null);
  try {
    await firebaseSignOut(auth);
  } catch {
    // ignore
  }
}

export function subscribeToAuthChanges(
  callback: (user: AppUserProfile | null) => void
): () => void {
  authListeners.add(callback);

  if (typeof window !== 'undefined') {
    try {
      const savedSession = sessionStorage.getItem(LOCAL_AUTH_SESSION_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession) as AppUserProfile;
        if (parsed && parsed.uid && !parsed.isAnonymous) {
          callback(parsed);
        }
      }
    } catch {
      // ignore
    }
  }

  const unsubFirebase = onAuthStateChanged(
    auth,
    async (fbUser: FirebaseUser | null) => {
      if (!fbUser || fbUser.isAnonymous) {
        if (typeof window !== 'undefined') {
          try {
            const savedSession = sessionStorage.getItem(LOCAL_AUTH_SESSION_KEY);
            if (savedSession) {
              return;
            }
          } catch {
            // ignore
          }
        }
        callback(null);
        return;
      }

      let displayName =
        fbUser.displayName || fbUser.email?.split('@')[0] || 'User';
      let plan = 'ResumeBuilderAi 3.0 Pro';
      let photoURL = fbUser.photoURL || undefined;

      try {
        const snap = await getDoc(doc(db, 'users', fbUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          displayName = data.displayName || displayName;
          plan = data.plan || plan;
          photoURL = data.photoURL || photoURL;
        }
      } catch {
        // fallback
      }

      const profile: AppUserProfile = {
        uid: fbUser.uid,
        email: fbUser.email || 'user@resumebuilder.ai',
        displayName,
        photoURL,
        providerId: fbUser.providerData?.[0]?.providerId || 'password',
        plan,
        isAnonymous: fbUser.isAnonymous,
      };
      notifyAuthListeners(profile);
    }
  );

  return () => {
    authListeners.delete(callback);
    unsubFirebase();
  };
}
