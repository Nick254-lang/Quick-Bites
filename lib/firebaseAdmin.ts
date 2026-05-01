import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error(
    'Missing Firebase Admin credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your environment variables.'
  );
  throw new Error('Firebase Admin SDK credentials not configured');
}

const adminApp =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

export const adminAuth = getAuth(adminApp);
