// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBukYB7ZjV5UiXAcQBsQRl9tDtp8D3DTnQ",
  authDomain: "textify-messages.firebaseapp.com",
  projectId: "textify-messages",
  storageBucket: "textify-messages.appspot.com",
  messagingSenderId: "794082867082",
  appId: "1:794082867082:web:418a33a04dd979ba727a73",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
