<template>
  <div>
    <v-app>
      <v-container>
        <v-row>
          <v-col>
            <v-text-field v-model="search.keyword" append-icon="mdi-magnify"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="search.y" label="年"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="search.m" label="月"></v-text-field>
          </v-col>
          <v-col>
            <v-btn @click="getDataYM">查詢</v-btn>
          </v-col>
        </v-row>

        <!-- 表格 -->
        <v-row>
          <v-col>
            <v-data-table :headers="headers" :items="rows" :search="search.keyword">
              <template v-slot:item.cateCht="{ item }">{{ getCateCht(item.cate) }}</template>
            </v-data-table>
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
  // getDoc,
  // doc,
  query,
  getDocs,
  // startAt,
  limit,
  where,
  orderBy
} from "firebase/firestore/lite";
const collection_name = "spends";
export default {
  data() {
    return {
      rows: [],
      headers: [
        { text: "帳戶", value: "account", width: "100" },
        { text: "類別", value: "cate", width: "100" },
        { text: "cate", value: "cateCht", width: "100" },
        { text: "日期", value: "spend_date", width: "100" },
        { text: "項目", value: "note", width: "200" },
        { text: "收入", value: "income", width: "90" },
        { text: "支出", value: "expense", width: "90" }
      ],
      search: { y: 2021 },
      cates: [
        { cate_id: 256, cate_name: "中文" },
        { cate_id: 250, cate_name: "寶" },
        { cate_id: 44, cate_name: "試試" }
      ]
      // cates: [{cate_id:256,cate_name:'中文'}]
    };
  },
  mounted() {
    // this.getData();
    this.getDataYM();
  },
  methods: {
    // 取得類別名稱
    getCateCht(cate) {
      let name = "";
      this.cates.forEach(row => {
        if (row.cate_id == cate) name = row.cate_name;
        console.log(row.cate_name);
      });
      return name;
      // let id = this.cates.filter(row => (row.cate_id = cate));

      // if (id.length > 0) return id[1].cate_name;
      // else console.log(0);

      // return "";

      // let found = this.cates.find(element => element.cate_id = cate);
      // console.log(found);
      // if(found)
      // return found.cate_name
      // return ''

      // var index = this.cates.indexOf();
      // return cate+this.cates[0].cate_name
    },

    async getDataYM() {
      this.rows = [];
      const citiesCol = collection(db, collection_name);
      const q = query(
        citiesCol,
        orderBy("spend_date", "desc"),
        where(
          "spend_date",
          "<",
          this.search.y + "-" + this.search.m + "-" + "01"
        ),
        limit(10)
      );
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        this.rows.push({ ...doc.data(), id: doc.id });
      });
      // console.log(this.rows);
    },
    async getData() {
      // this.rows = [];
      const citiesCol = collection(db, collection_name);
      const q = query(citiesCol, orderBy("spend_date", "desc"), limit(100));
      // const q = query(citiesCol, orderBy("expense", "desc"),where('expense','>',1000), limit(100));
      // const q = query(citiesCol, orderBy("expense", "desc"),where('expense','>',100000), limit(100));
      // const q = query(citiesCol, orderBy("expense"), startAt(1000000));

      // 找出某一筆資料 (假設該筆資料的 expense 為 3000)
      // const docSnap = await getDoc(doc(citiesCol, "0WtHUapzuUGo2ao9C2Qh"));
      // 再用此資料為條件 => startAt(3000)
      // const q = query(citiesCol, orderBy("expense"), startAt(docSnap));
      // const q = query(citiesCol, orderBy("expense"), startAt(4000));

      // console.log(docSnap);
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        this.rows.push({ ...doc.data(), id: doc.id });
      });
      // console.log(this.rows);
    }
  }
};
</script>

<style>
</style>