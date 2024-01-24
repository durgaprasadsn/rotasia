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
  apiKey: "AIzaSyBOhis9S5zvTr2WEVW3vrYfUEpoIQQzLTY",
  authDomain: "rotasia.firebaseapp.com",
  projectId: "rotasia",
  storageBucket: "rotasia.appspot.com",
  messagingSenderId: "634135864945",
  appId: "1:634135864945:web:f6a6fef18bb3573608ddd0",
  measurementId: "G-G39NJ82X1S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };