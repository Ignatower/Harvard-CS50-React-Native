// Your web app's Firebase configuration
import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "YOUR-FIREBASE-API-KEY",
  authDomain: "YOUR-FIREBASE-DOMAIN",
  databaseURL: "YOUR-FIREBASE-DATABASE",
  projectId: "YOUR-FIREBASE-PROJECT-ID",
  storageBucket: "YOUR-FIREBASE-STORAGE",
  messagingSenderId: "YOUR-FIREBASE-MASSAGING",
  appId: "YOUR-FIREBASE-APP-ID",
  measurementId: "YOUR-FIREBASE-MEASUREMENT-ID",
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export default firebase
