// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeBVvetuJFzvXpmXd1TWWGK89JFtxgqdU",
  authDomain: "prodsnap.firebaseapp.com",
  projectId: "prodsnap",
  storageBucket: "prodsnap.appspot.com",
  messagingSenderId: "39641998402",
  appId: "1:39641998402:web:3cfc0333aa73b731a279db"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);