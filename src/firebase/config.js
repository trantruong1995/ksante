import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyDdch_K9OzJyECwcyw4fv8MFac9oXsJdLQ",
    authDomain: "chat-app-fe682.firebaseapp.com",
    projectId: "chat-app-fe682",
    storageBucket: "chat-app-fe682.appspot.com",
    messagingSenderId: "508345851448",
    appId: "1:508345851448:web:6a41ccb44c4c58bedf10cd",
    measurementId: "G-GLM6NVX2HV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore();
export const storage = getStorage();


