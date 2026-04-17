import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔴 REPLACE WITH YOUR CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyC75w6lBo9nGLaKrkzp0PLLfQVi3d9rPdk",
  authDomain: "mrchef254.firebaseapp.com",
  projectId: "mrchef254",
  storageBucket: "mrchef254.firebasestorage.app",
  messagingSenderId: "974102315479",
  appId: "1:974102315479:web:ad39c07e3b664bb8f60b92",
  measurementId: "G-K4R7BMENMY"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);