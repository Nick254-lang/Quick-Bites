import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ================= REGISTER =================
const registerForm = document.getElementById("registerForm");

registerForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", userCred.user.uid), {
      name,
      username,
      email,
      role,
      createdAt: new Date()
    });

    alert("Registered successfully! Please login.");

    // ✅ Redirect to login
    window.location.href = "login.html";

  } catch (err) {
    alert(err.message);
  }
});

// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    const userDoc = await getDoc(doc(db, "users", userCred.user.uid));

    // ❌ If no profile → redirect to register
    if (!userDoc.exists()) {
      alert("No account found. Please register.");
      window.location.href = "register.html";
      return;
    }

    const role = userDoc.data().role;

    redirectUser(role);

  } catch (err) {
    alert("Invalid login. Redirecting to register...");
    window.location.href = "register.html";
  }
});

// ================= GOOGLE LOGIN =================
const googleBtn = document.getElementById("googleLogin");

googleBtn?.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);

    const userRef = doc(db, "users", result.user.uid);
    const userSnap = await getDoc(userRef);

    // If first time user → save profile
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: result.user.displayName,
        email: result.user.email,
        role: "customer",
        createdAt: new Date()
      });
    }

    redirectUser("customer");

  } catch (err) {
    alert(err.message);
  }
});

// ================= REDIRECT =================
function redirectUser(role) {
  if (role === "admin") {
    window.location.href = "/client/pages/admin/dashboard.html";
  } else if (role === "rider") {
    window.location.href = "/client/pages/rider/dashboard.html";
  } else {
    window.location.href = "/client/pages/home.html";
  }
}