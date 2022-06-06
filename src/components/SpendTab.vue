<template>
  <div>
    <v-row>
      <v-col>
        <v-text-field type="number" v-model="search.y" label="年"></v-text-field>
      </v-col>
      <v-col>
        <v-select :items="months" v-model="search.m"></v-select>
        <!-- <v-text-field type="number" v-model="search.m" label="月"></v-text-field> -->
      </v-col>
      <v-col>
        <v-btn @click="getDataYM">查詢</v-btn>
      </v-col>
    </v-row>
    <!-- 表格 -->
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="rows" :loading="loading"></v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import db from "../db.js";
import {
  collection,
  query,
  getDocs,
  limit,
  where,
  orderBy
} from "firebase/firestore/lite";
export default {
  data() {
    return {
      // 查詢預設當年月
      search: { y: new Date().getFullYear(), m: new Date().getMonth() + 1 },
      months:[],
      // 資料
      rows: [],
      headers: [
        { text: "帳戶", value: "account", width: "100" },
        { text: "cate", value: "cate", width: "100" },
        { text: "類別", value: "cateCht", width: "100" },
        { text: "日期", value: "spend_date", width: "100" },
        { text: "項目", value: "note", width: "200" },
        { text: "收入", value: "income", width: "90" },
        { text: "支出", value: "expense", width: "90" }
      ],
      loading: false
    };
  },
  created() {
    
    for(let i=1;i<=12;i++){
      if(i<10){
        i='0'+i
      }
      this.months.push(i)      
    }
    let m = new Date().getMonth() + 1
    if(m<10){
      m='0'+m
    }
    this.search.m = m
    
    
  },
  methods: {

    async getDataYM() {
      this.rows = [];
      this.loading = true
      const citiesCol = collection(db, "spends");
      const q = query(
        citiesCol,
        orderBy("spend_date", "desc"),       
        where(
          "spend_date",
          ">=",
          this.search.y+"-"+this.search.m+"-01"
        ),
        where(
          "spend_date",
          "<=",
          this.search.y+"-"+this.search.m+"-31"
        ),
        limit(1000)
      );
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        this.rows.push({ ...doc.data(), id: doc.id });
      });
      this.loading = false
      console.log(this.rows);
    }
  }
};
</script>

<style>
</style>