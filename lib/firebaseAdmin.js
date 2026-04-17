import admin from 'firebase-admin';
import path from 'path';

if (!admin.apps.length) {
  const serviceAccountKey = require('../config/serviceAccountKey.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
