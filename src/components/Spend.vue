<template>
  <div>
    <v-text-field label="查詢" v-model="search" append-icon="mdi-magnify"></v-text-field>
    <v-data-table :loading="loading" :headers="headers" :items="rows" :search="search"></v-data-table>
  </div>
</template>

<script>
import db from "../db.js";
import { collection, query, orderBy, getDocs } from "firebase/firestore/lite";

const collection_name = "spends";
export default {
  data() {
    return {
      rows: [],
      headers: [
        { text: "日期", value: "spend_date", width: "150" },
        { text: "類別", value: "cate", width: "100" },
        { text: "項目", value: "note", width: "300" },
        { text: "收入", value: "income" },
        { text: "支出", value: "expense" },
        { text: "備註", value: "note_html" },

      ],
      loading: true,
      search: ""
    };
  },
  mounted() {
    
    this.getMoney();
    
  },
  methods: {
    async getMoney() {
      this.loading = true;
      const citiesCol = collection(db, collection_name);
      const q = query(citiesCol, orderBy("spend_date", "desc"));
      const citySnapshot = await getDocs(q);
      citySnapshot.forEach(doc => {
        let row = doc.data();
        row.id = doc.id;
        this.rows.push(row);
      });
      this.loading = false;
      console.log(this.rows);
    }
  }
};
</script>

<style>
</style>