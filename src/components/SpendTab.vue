<template>
  <div>
    <v-app>
    <v-container>
      <v-row>
        <v-col>
          <v-text-field v-model="search" append-icon="mdi-magnify"></v-text-field>
        </v-col>
      </v-row>

      <!-- 表格 -->
      <v-row>
        <v-col>
          <v-data-table :headers="headers" :items="rows" :search="search"></v-data-table>
        </v-col>
      </v-row>
    </v-container>
    </v-app>
  </div>
</template>

<script>
import db from "../db.js";
import {
  collection,
  getDoc,
  doc,
  query,
  getDocs,
  startAt,
  // limit,
  // where,
  orderBy
} from "firebase/firestore/lite";
const collection_name = "spends";
export default {
  data() {
    return {
      rows: [],
      headers: [
        { text: "日期", value: "spend_date", width: "100" },
        { text: "項目", value: "note", width: "200" },
        { text: "金額", value: "expense", width: "90" }
      ],
      search: ""
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      // this.rows = [];
      const citiesCol = collection(db, collection_name);
      // const q = query(citiesCol, orderBy("spend_date", "desc"), limit(100));
      // const q = query(citiesCol, orderBy("expense", "desc"),where('expense','>',1000), limit(100));
      // const q = query(citiesCol, orderBy("expense", "desc"),where('expense','>',100000), limit(100));
      // const q = query(citiesCol, orderBy("expense"), startAt(1000000));
      
      // 找出某一筆資料 (假設該筆資料的 expense 為 3000)
      const docSnap = await getDoc(doc(citiesCol, "0WtHUapzuUGo2ao9C2Qh"));
      // 再用此資料為條件 => startAt(3000)
      // const q = query(citiesCol, orderBy("expense"), startAt(docSnap));
      const q = query(citiesCol, orderBy("expense"), startAt(4000));

      console.log(docSnap);
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        this.rows.push({ ...doc.data(), id: doc.id });
      });
      console.log(this.rows);
    }
  }
};
</script>

<style>
</style>