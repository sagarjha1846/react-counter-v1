// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore"
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcpXBKESmnw97FxacH0bZ6m2Mllavmuqw",
  authDomain: "react-counter-app-7a016.firebaseapp.com",
  projectId: "react-counter-app-7a016",
  storageBucket: "react-counter-app-7a016.appspot.com",
  messagingSenderId: "289686947921",
  appId: "1:289686947921:web:92af994fa2aa7f0f3d1070",
  measurementId: "G-FFT76J1TNT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getFirestore(app)
const analytics = getAnalytics(app);

export { app, analytics, database }