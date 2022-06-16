<template>
  <div>
    <!-- 202206 加油錢 {{ getTotal2022() }} -->
   

    <!-- 查詢 -->
    <!-- <v-row>
      <v-col>
        <v-text-field type="number" v-model="search.y" label="年"></v-text-field>
      </v-col>
      <v-col>
        <v-select :items="months" v-model="search.m"></v-select>
        
      </v-col>
      <v-col>
        <v-btn @click="getDataYM">查詢</v-btn>
      </v-col>
    </v-row> -->

    <!-- 表格 -->
    <v-row>
      <v-col cols="8"></v-col>
      <!-- 合計 -->
      <!-- <v-col cols="4">
        <v-btn outlined color="red" dark>
          {{ getTotal(rows) }}
         
        </v-btn>
      </v-col> -->
    </v-row>

    <v-data-table 
    :hide-default-footer="true"
    @click:row="showDetail"
     mobile-breakpoint="300"
    :headers="headers2022" :items="rowsMonthTotal" :sort-by.sync="sortBy"
     :loading="loading"
    :sort-desc.sync="sortDesc"
    >
    
    <template v-slot:item.amt="{ item }">
       <v-btn outlined color="red" dark>
          {{ item.amt }}         
        </v-btn>
    </template>
    </v-data-table>

    <!-- <v-data-table
      mobile-breakpoint="300"
      :headers="headers"
      :items="rows"
      :search="search.keyword"
      :loading="loading"
      :items-per-page="100"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
    >
      <template v-slot:item.spend_date="{ item }">{{ item.spend_date.slice(5,10) }}</template>
    </v-data-table> -->
    <!-- </v-col> -->
    <!-- </v-row> -->
  </div>
</template>

<script>
// const collection_name = this.title;

const collection_name = "expenses";
// import router from '../router/index';
import db from "../db.js";
import {
  collection,
  updateDoc,
  addDoc,
  deleteDoc,
  doc,
  query,
  getDocs,
  limit,
  where,
  orderBy
} from "firebase/firestore/lite";
export default {
  // props: ["title", "text"],
  props: {
    title: {
      type: String,
      default: "expenses"
    }
  },
  data() {
    return {
      total: 0,
      rows2022: [],
      rowsMonthTotal: [],
      sortBy: "m",
      // sortByM: "m",
      sortDesc: true,
      editedIndex: -1,
      dialog: false,
      defaultItem: {
        note: "",
        expense: "",
        spend_date: new Date().toISOString().slice(0, 10)
      },
      editedItem: {},
      // 查詢預設當年月
      search: { y: new Date().getFullYear(), m: new Date().getMonth() + 1 },
      months: [],
      accounts: ["", "現金", "信用卡"],
      // cates: ["餐費", "加油", "旅遊", "水電"],
      // 資料
      rows: [],
      headers2022: [
        { text: "年", value: "y", width: "70" },
        { text: "月", value: "m", width: "70" },
        { text: "支出", value: "amt", width: "70" }
      ],
      headers: [
        { text: "日期", value: "spend_date", width: "70" },
        { text: "項目", value: "note", width: "120" },
        { text: "支出", value: "expense", width: "70" }
      ],
      loading: false
      // title:'expenses'
    };
  },
  created() {
    this.monthData();
    // this.getDataYM();
    // this.loading = true
    this.getRows2022("2022", "03");
    this.getRows2022("2022", "04");
    this.getRows2022("2022", "05");
    this.getRows2022("2022", "06");
    this.loading = false
    // console.log(this.rowsMonthTotal);
   
  },
  methods: { 
    showDetail(item) {
      this.$router.push({ name: 'ExpenseDetail', params: { y: item.y,m: item.m } })
      // this.$router.push({path: '/expense/detail/:y', params: { y:'2022' }})
      console.log(item)
      this.search.m = item.m
      // this.getDataYM()
    },
    // 合計
    getTotal(arr) {
      let total = Object.keys(arr).reduce(function(previous, key) {
        return previous + arr[key].expense * 1;
      }, 0);

      // Create our number formatter.
      var formatter = new Intl.NumberFormat("en-US", {
        // style: "currency",
        currency: "USD"
      });

      total = formatter.format(total); /* $2,500.00 */

      return total;
    },
    monthData() {
      for (let i = 0; i <= 12; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        this.months.push(i);
      }
      let m = new Date().getMonth() + 1;
      if (m < 10) {
        m = "0" + m;
      }
      this.search.m = m;
    },
    async save() {
      //更新
      if (this.editedIndex > -1) {
        const ref = doc(db, collection_name, this.editedItem.id);

        await updateDoc(ref, this.editedItem);

        // Object.assign(target, ...sources)
        // 將表單的值傳回表格中
        Object.assign(this.rows[this.editedIndex], this.editedItem);

        console.log(this.editedItem);
        this.$nextTick(() => {
          // 將表單的值設成預設值
          this.defaultItem.date = "";
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        });
      } else {
        // 新增

        const docRef = await addDoc(collection(db, collection_name), {
          spend_date: this.editedItem.spend_date,
          cate_name: this.editedItem.cate_name,
          note: this.editedItem.note,
          expense: this.editedItem.expense
        });

        // 設定新增後取得的 id, 才可馬上做編輯
        this.editedItem.id = docRef.id;
        // 將項目加入到資料列
        this.rows.unshift(this.editedItem);
        // console.log(this.rows);
      }

      this.dialog = false;
    },
    async deleteItem(id, index) {
      if (!confirm("確定刪除")) return;
      await deleteDoc(doc(db, collection_name, id));
      this.rows.splice(index, 1);
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      this.dialog = false;
    },

    async getCates() {
      this.cates = [];
      const cates = collection(db, "cates");
      let q = query(cates, orderBy("prior"));
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        this.cates.push(doc.data().name);
      });
      console.log(this.cates);
    },

    async getDataByCate() {
      this.rows = [];
      this.loading = true;
      const citiesCol = collection(db, collection_name);
      // 分類查詢
      let q = query(
        citiesCol,
        //  orderBy("spend_date"),
        where("cate_name", "==", this.search.cate_name),

        limit(100)
      );
      // console.log(this.search.account_name);
      // 如果有選帳戶,再加入帳戶條件查詢
      if (
        this.search.account_name != "" &&
        this.search.account_name != undefined
      ) {
        q = query(
          citiesCol,
          //  orderBy("spend_date"),
          where("cate_name", "==", this.search.cate_name),
          where("account_name", "==", this.search.account_name),
          limit(100)
        );
      }

      // console.log(this.search.cate_name)
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        this.rows.push({ ...doc.data(), id: doc.id });
      });
      // this.sortBy='expense'
      this.loading = false;
    },

    async getRows2022(y, m) {
      // this.loading = true
      const expense = collection(db, this.title);

      let q = query(
        expense,
        orderBy("spend_date", "desc"),

        where("spend_date", ">=", y + "-" + m + "-01"),
        where("spend_date", "<=", y + "-" + m + "-31"),
        where("cate_name", "==", "加油"),
        limit(100)
      );

      const docSnapBig = await getDocs(q);

      this.rows2022 = [];

      // 取得該月資料
      docSnapBig.forEach(doc => {
        this.rows2022.push(doc.data().expense);
      });

      // 月加總

      let total = 0;

      this.rows2022.forEach(obj => {
        total += obj * 1;
      });
      // 將各月加總數字放到陣列
      let obj = {};
      obj.y = y;
      obj.m = m;
      obj.amt = total;
      this.rowsMonthTotal.push(obj);

      // console.log(this.rows2022)
      // console.log(total)
    },

    
  }
};
</script>

<style>
</style>