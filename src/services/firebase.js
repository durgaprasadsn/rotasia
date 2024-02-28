// firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCh57yMXhbMk0mgqYW9pl9D3I2lRiKSPrg",
  authDomain: "rotasia-tech.firebaseapp.com",
  databaseURL: "https://rotasia-tech-default-rtdb.firebaseio.com",
  projectId: "rotasia-tech",
  storageBucket: "rotasia-tech.appspot.com",
  messagingSenderId: "348614049409",
  appId: "1:348614049409:web:928e73e282e6d270381780",
  measurementId: "G-ZXDJMZ2BVN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };