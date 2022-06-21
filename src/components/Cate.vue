<template>
  <div>
    <v-data-table :items="rows" :headers="headers"></v-data-table>
  </div>
</template>

<script>
const collection_name = "cates";

import db from "../db.js";
import {
  collection,
  // updateDoc,
  // addDoc,
  // deleteDoc,
  // doc,
  query,
  getDocs,
  // limit,
  // where,
  orderBy
} from "firebase/firestore/lite";

export default {
  data() {
    return {
      rows: [],
      headers: [
        {
          text: "名稱",
          value: "name"
        },
        {
          text: "順序",
          value: "prior"
        }
      ]
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      this.rows = [];
      const cates = collection(db, collection_name);
      let q = query(cates, orderBy("prior"));
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        this.rows.push(doc.data());
      });
      // this.cates.unshift("");
    }
  }
};
</script>

<style>
</style>