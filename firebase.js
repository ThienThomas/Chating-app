// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword  } from "firebase/auth";
import { getStorage} from "firebase/storage";
import {initializeFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuxt4lPpOB354_Wzlqm3gW51q_XcTbDno",
  authDomain: "nativefirebase-2b9b8.firebaseapp.com",
  projectId: "nativefirebase-2b9b8",
  storageBucket: "nativefirebase-2b9b8.appspot.com",
  messagingSenderId: "722506971967",
  appId: "1:722506971967:web:ae6e6a6ebedb89a501718a",
  measurementId: "G-DSJB665ZZ5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = initializeFirestore(app, 
    {experimentalAutoDetectLongPolling: true,
});
export function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}
export function signUp(email, password, password1){
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === true){
        if (password === password1){
            return createUserWithEmailAndPassword(auth, email, password);
        }
    }
}