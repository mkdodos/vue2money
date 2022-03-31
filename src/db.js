// import firebase from "firebase/app";
// import "firebase/database";
// import "firebase/firestore";

// const config = {
//     apiKey: "AIzaSyBnsxe8kvHrgLNe0UQ1xuUz2oY2ESd5SOE",
//     authDomain: "score-96fcd.firebaseapp.com",
//     databaseURL: "https://score-96fcd-default-rtdb.firebaseio.com",
//     projectId: "score-96fcd",
//     storageBucket: "score-96fcd.appspot.com",
//     messagingSenderId: "17881397721",
//     appId: "1:17881397721:web:2c78f92ccee5fbd798c1c8",
//     measurementId: "G-8WYVCD8JNM"
// }

// const db = firebase.initializeApp(config);
// export default db;


import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";


const firebaseConfig = {
  apiKey: "AIzaSyClLeHQJMt3BzbrK_AHpWeq0nlqzY2r5ik",
  authDomain: "money-39797.firebaseapp.com",
  projectId: "money-39797",
  storageBucket: "money-39797.appspot.com",
  messagingSenderId: "142963352306",
  appId: "1:142963352306:web:ac3c09e593009a5175666b",
  measurementId: "G-012VKYDZ07"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;