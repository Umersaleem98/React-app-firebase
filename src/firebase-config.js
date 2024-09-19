// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBxwMhV93pr27xLAKMrqKoaOguFQBHscGw",
    authDomain: "reactjs-crudfile.firebaseapp.com",
    projectId: "reactjs-crudfile",
    storageBucket: "reactjs-crudfile.appspot.com",
    messagingSenderId: "628096379133",
    appId: "1:628096379133:web:ce5faa89db263f49c2b694",
    measurementId: "G-SWC2R0RLCJ"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
