// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzxd39gpsVv87DdMM5tZvTU4f0dh-07SY",
  authDomain: "pokemon-project-12586.firebaseapp.com",
  projectId: "pokemon-project-12586",
  storageBucket: "pokemon-project-12586.firebasestorage.app",
  messagingSenderId: "566324817104",
  appId: "1:566324817104:web:6a4a0d3f647d080c4a02d5",
  measurementId: "G-YVG8N2SE9Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const db = getFirestore(app);