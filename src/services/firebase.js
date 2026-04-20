import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYYDjaDsbOXJMA9m_Zpjn3c_J0ykjZbq0",
  authDomain: "kaidoku-40993.firebaseapp.com",
  projectId: "kaidoku-40993",
  storageBucket: "kaidoku-40993.firebasestorage.app",
  messagingSenderId: "276112454727",
  appId: "1:276112454727:web:90f325b2c839d5e40bad62",
  measurementId: "G-TPC67SCE33"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
