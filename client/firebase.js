// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHjjMKcTRo6kFunFEC9eZAWVaTYNPoSto",
  authDomain: "gifted-harmony-506.firebaseapp.com",
  projectId: "gifted-harmony-506",
  storageBucket: "gifted-harmony-506.appspot.com",
  messagingSenderId: "586386303450",
  appId: "1:586386303450:web:8cfbd170fdbbd00ee938e3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);