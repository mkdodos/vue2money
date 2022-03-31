<template>
  <div>
      <v-container>
    <v-form>
      <v-text-field label="項目" v-model="stock_name"></v-text-field>
      <v-text-field label="股數" v-model="qty" type="number"></v-text-field>
      <v-text-field label="單價" v-model="price" type="number"></v-text-field>
      <v-row class="mb-6">
        <v-col class="text-right">
          <v-btn color="green" class="white--text" @click="create">儲存</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-data-table :headers="headers" :items="rows"></v-data-table>
    </v-container>
  </div>
</template>

<script>
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// const analytics = getAnalytics(app);
import { getFirestore } from "firebase/firestore/lite";

// const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

import { collection, getDocs, addDoc } from "firebase/firestore/lite";

// getMoney();

export default {
  data() {
    return {
      stock_name: "",
      qty: "",
      price: "",
      rows: [],
      headers: [
        { text: "名稱", value: "stock_name" },
        { text: "股數", value: "qty" },
        { text: "單價", value: "price" },
        
      ]
    };
  },
  created() {
    this.getMoney();
  },
  methods: {
    async getMoney() {
      const citiesCol = collection(db, "stocks");
      const citySnapshot = await getDocs(citiesCol);
      const cityList = citySnapshot.docs.map(doc => doc.data());
      this.rows = cityList;
      console.log(cityList);
    },
    async create() {
      await addDoc(collection(db, "stocks"), {
        date: new Date(),
        stock_name: this.stock_name,
        qty: this.qty,
        price: this.price
      });
    }
  }
};
</script>

<style>
</style>