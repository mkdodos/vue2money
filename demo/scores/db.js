import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import {
    getFirestore, collection,
    addDoc,
    deleteDoc,
    doc, getDocs
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyClLeHQJMt3BzbrK_AHpWeq0nlqzY2r5ik",
    authDomain: "money-39797.firebaseapp.com",
    projectId: "money-39797",
    storageBucket: "money-39797.appspot.com",
    messagingSenderId: "142963352306",
    appId: "1:142963352306:web:ac3c09e593009a5175666b",
    measurementId: "G-012VKYDZ07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let rows = [];


const col = collection(db, "scores");

const snapshot = await getDocs(col);
const docs = snapshot.docs;



docs.forEach(doc => {
    let row = doc.data() //1筆資料(不含id)
    row.id = doc.id //加入id    
    rows.push(row)
});


export  {db,rows};