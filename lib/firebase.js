// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔐 Konfigurasi dari Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCYGPPz05AZRRhduLhWKKOxIMribuF8DNM",
  authDomain: "finscope-auth.firebaseapp.com",
  projectId: "finscope-auth",
  storageBucket: "finscope-auth.appspot.com", // <== ada typo di punyamu tadi
  messagingSenderId: "345759217196",
  appId: "1:345759217196:web:fe06a6b6223a87a6a20389",
  measurementId: "G-CQHNR9Y49R"
};

// ✅ Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth & Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Export hanya SEKALI
export { auth, db };
