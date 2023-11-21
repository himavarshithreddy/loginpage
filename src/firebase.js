// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider,GithubAuthProvider } from 'firebase/auth'


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
const database = getAuth(app)
const gprovider = new GoogleAuthProvider();
const ghprovider = new GithubAuthProvider();
export {database,gprovider,ghprovider};