import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserSessionPersistence, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, setDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyCatH-G_1hvZvuKz3oHr-U38aLcdwxlOL8",
    authDomain: "pantry-89653.firebaseapp.com",
    projectId: "pantry-89653",
    storageBucket: "pantry-89653.appspot.com",
    messagingSenderId: "631520277933",
    appId: "1:631520277933:web:9015f1f20cc7a9a2745d24"
};



const app = initializeApp(firebaseConfig)
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { db, collection, doc, setDoc, auth, deleteDoc, onSnapshot, googleProvider, signInWithPopup, setPersistence, browserSessionPersistence, onAuthStateChanged };