import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAlB8wKOxhbTsBflmneZM8T9spGv8cZsuk",
    authDomain: "my-habit-tracker-4d426.firebaseapp.com",
    projectId: "my-habit-tracker-4d426",
    storageBucket: "my-habit-tracker-4d426.firebasestorage.app",
    messagingSenderId: "131083893159",
    appId: "1:131083893159:web:616295a2c82067fca71e82",
    measurementId: "G-V7ERYDDD0W"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export db;