import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD6j1qXmp3csFI2Bta6Oci5AThQuq04KjY",
    authDomain: "trendix-175bb.firebaseapp.com",
    projectId: "trendix-175bb",
    storageBucket: "trendix-175bb.appspot.com",
    messagingSenderId: "244583301155",
    appId: "1:244583301155:web:002dd29dfd1dd0736d3196",
    measurementId: "G-6Z3WQ4DVKC"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword };
