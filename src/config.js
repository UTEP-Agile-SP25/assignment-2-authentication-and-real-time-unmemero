// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAo0VSOJrUyhXAsj0cDUd2rpMqJU079klI",
  authDomain: "garcia-sandbox-c2bac.firebaseapp.com",
  projectId: "garcia-sandbox-c2bac",
  storageBucket: "garcia-sandbox-c2bac.firebasestorage.app",
  messagingSenderId: "337136444838",
  appId: "1:337136444838:web:5327ed6fac654342d9db67",
  measurementId: "G-PBJLM6VWT5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;   