import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCeBVvetuJFzvXpmXd1TWWGK89JFtxgqdU",
  authDomain: "prodsnap.firebaseapp.com",
  projectId: "prodsnap",
  storageBucket: "prodsnap.appspot.com",
  messagingSenderId: "39641998402",
  appId: "1:39641998402:web:3cfc0333aa73b731a279db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
connectFunctionsEmulator(functions, "localhost", 5001);