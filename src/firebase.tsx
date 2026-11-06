import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYqXKZ1MK_PRq-rGUEI25PzWq15XhRqLA",
  authDomain: "flowboard-9f46b.firebaseapp.com",
  projectId: "flowboard-9f46b",
  storageBucket: "flowboard-9f46b.firebasestorage.app",
  messagingSenderId: "798630509600",
  appId: "1:798630509600:web:f819a55dcc476bd77b5045",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
export const fbFunctions = getFunctions(app);

