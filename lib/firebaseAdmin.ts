import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccountKey from '@/config/serviceAccountKey.json';

const adminApp =
  getApps()[0] ??
  initializeApp({
    credential: cert(serviceAccountKey),
  });

export const db = getFirestore(adminApp);
export const auth = getAuth(adminApp);
