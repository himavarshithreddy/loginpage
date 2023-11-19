// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBmtx-aK4oTbmebfxyDgsrNiRmLNFmksoM",
  authDomain: "loginproject-c7d6b.firebaseapp.com",
  projectId: "loginproject-c7d6b",
  storageBucket: "loginproject-c7d6b.appspot.com",
  messagingSenderId: "399133044141",
  appId: "1:399133044141:web:5dfcf59aa870890dce4524",
  measurementId: "G-GFP22K5X6E"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getAuth(app)