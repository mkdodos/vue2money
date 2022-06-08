<template>
  <div>
    <v-data-table :items="rows"
     :headers="headers"
      :loading="loading"
    ></v-data-table>
  </div>
</template>

<script>
import db from "../db.js";
import {
  collection,
  // updateDoc,
  // addDoc,
  // deleteDoc,
  // doc,
  // query,
  getDocs,
  // limit,
  // where,
  // orderBy
} from "firebase/firestore/lite";
export default {
  data() {
    return {
       // 資料
      rows: [],
      headers: [
       
        { text: "日期", value: "date", width: "60" },
        { text: "項目", value: "title", width: "150" },       
        { text: "金額", value: "amt", width: "90" }
      ],
      loading: false
    };
  },
  created() {
    this.getData()
  },
  methods:{
    async getData() {
      this.rows = [];
      this.loading = true;
      const citiesCol = collection(db, "cash_in");
     
     
      const docSnapBig = await getDocs(citiesCol);
      docSnapBig.forEach(doc => {
        this.rows.push({ ...doc.data(), id: doc.id });
      });
      this.loading = false;
      console.log(this.rows);
    }
  }
};
</script>

<style>
</style>