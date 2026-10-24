import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import {
  ResumeDocument,
  CoverLetterDocument,
  JobApplicationItem,
} from './resume-engine';
import { isValidFirestoreId } from './security-utils';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

function isFirebaseUserAuthenticated(userId: string): boolean {
  return Boolean(
    isValidFirestoreId(userId) &&
      auth.currentUser &&
      auth.currentUser.uid === userId
  );
}

/**
 * Persists a resume document into the user's private Firestore sub-collection:
 * /users/{userId}/resumes/{resumeId}
 */
export async function saveResumeToFirestore(
  userId: string,
  resume: ResumeDocument
): Promise<void> {
  if (
    !isFirebaseUserAuthenticated(userId) ||
    !resume?.id ||
    !isValidFirestoreId(resume.id)
  ) {
    return;
  }
  const path = `users/${userId}/resumes/${resume.id}`;
  try {
    const resumeRef = doc(db, 'users', userId, 'resumes', resume.id);
    const payload = {
      ...resume,
      id: resume.id.slice(0, 128),
      userId,
      title: String(resume.title || 'Untitled Resume').slice(0, 200),
      ownerEmail: String(resume.ownerEmail || '').slice(0, 254),
      updatedAt: String(resume.updatedAt || new Date().toISOString()).slice(
        0,
        64
      ),
    };
    await setDoc(resumeRef, payload, { merge: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }
}

/**
 * Loads all resume documents for an authenticated user from Firestore:
 * /users/{userId}/resumes
 */
export async function loadResumesFromFirestore(
  userId: string
): Promise<ResumeDocument[]> {
  if (!isFirebaseUserAuthenticated(userId)) return [];
  const path = `users/${userId}/resumes`;
  try {
    const resumesRef = collection(db, 'users', userId, 'resumes');
    const snapshot = await getDocs(query(resumesRef));
    const items: ResumeDocument[] = [];
    snapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        items.push(docSnap.data() as ResumeDocument);
      }
    });
    return items;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
    return [];
  }
}

/**
 * Deletes a resume document from the user's private Firestore sub-collection:
 * /users/{userId}/resumes/{resumeId}
 */
export async function deleteResumeFromFirestore(
  userId: string,
  resumeId: string
): Promise<void> {
  if (!isFirebaseUserAuthenticated(userId) || !resumeId) return;
  const path = `users/${userId}/resumes/${resumeId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'resumes', resumeId));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }
}

/**
 * Persists a cover letter into /users/{userId}/coverLetters/{clId}
 */
export async function saveCoverLetterToFirestore(
  userId: string,
  cl: CoverLetterDocument
): Promise<void> {
  if (!isFirebaseUserAuthenticated(userId) || !cl?.id) return;
  const path = `users/${userId}/coverLetters/${cl.id}`;
  try {
    const clRef = doc(db, 'users', userId, 'coverLetters', cl.id);
    await setDoc(clRef, { ...cl, userId }, { merge: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }
}

/**
 * Loads cover letters from /users/{userId}/coverLetters
 */
export async function loadCoverLettersFromFirestore(
  userId: string
): Promise<CoverLetterDocument[]> {
  if (!isFirebaseUserAuthenticated(userId)) return [];
  const path = `users/${userId}/coverLetters`;
  try {
    const clRef = collection(db, 'users', userId, 'coverLetters');
    const snapshot = await getDocs(query(clRef));
    const items: CoverLetterDocument[] = [];
    snapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        items.push(docSnap.data() as CoverLetterDocument);
      }
    });
    return items;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
    return [];
  }
}

/**
 * Persists a tracked job into /users/{userId}/jobs/{jobId}
 */
export async function saveJobToFirestore(
  userId: string,
  job: JobApplicationItem
): Promise<void> {
  if (!isFirebaseUserAuthenticated(userId) || !job?.id) return;
  const path = `users/${userId}/jobs/${job.id}`;
  try {
    const jobRef = doc(db, 'users', userId, 'jobs', job.id);
    await setDoc(jobRef, { ...job, userId }, { merge: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }
}

/**
 * Loads tracked jobs from /users/{userId}/jobs
 */
export async function loadJobsFromFirestore(
  userId: string
): Promise<JobApplicationItem[]> {
  if (!isFirebaseUserAuthenticated(userId)) return [];
  const path = `users/${userId}/jobs`;
  try {
    const jobsRef = collection(db, 'users', userId, 'jobs');
    const snapshot = await getDocs(query(jobsRef));
    const items: JobApplicationItem[] = [];
    snapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        items.push(docSnap.data() as JobApplicationItem);
      }
    });
    return items;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
    return [];
  }
}
