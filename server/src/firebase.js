// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAbEdEUAB1ZGMeAGnOYxP2prXNRQA3RdsI",
  authDomain: "cuelume.firebaseapp.com",
  projectId: "cuelume",
  storageBucket: "cuelume.firebasestorage.app",
  messagingSenderId: "919937396389",
  appId: "1:919937396389:web:39e16a6aa8bddbaafd674c",
  measurementId: "G-6W73C35Q4C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
