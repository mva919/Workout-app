// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJc_uznnF4-qJoml8zcs3QWDTsDUz3SjY",
  authDomain: "workout-app-c6931.firebaseapp.com",
  projectId: "workout-app-c6931",
  storageBucket: "workout-app-c6931.appspot.com",
  messagingSenderId: "213357098068",
  appId: "1:213357098068:web:871208c86619dec535e9c1",
  measurementId: "G-CX1X92X8V0"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize auth, firestore && storage with the "firebaseApp" property
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);