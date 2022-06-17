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
    </v-row>-->
    
    <!-- 表格 -->
    <v-row>
      <v-col cols="8"></v-col>
      <!-- 合計 -->
      <!-- <v-col cols="4">
        <v-btn outlined color="red" dark>
          {{ getTotal(rows) }}
         
        </v-btn>
      </v-col>-->
    </v-row>

    <v-data-table
      :hide-default-footer="true"
      :items-per-page="100"
      @click:row="showDetail"
      mobile-breakpoint="300"
      :headers="headers2022"
      :items="rowsYM"
     
      :loading="loading"
      :sort-desc.sync="sortDesc"
    >
      <template v-slot:item.amt="{ item }">
        <v-btn outlined color="red" dark>{{ item.amt }}</v-btn>
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
    </v-data-table>-->
    <!-- </v-col> -->
    <!-- </v-row> -->
  </div>
</template>

<script>
// const collection_name = this.title;

// const collection_name = "expenses";
// import router from '../router/index';
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
      rowsYM: [],
      rowsMonthTotal: [],
      sortBy: "m",
      // sortByM: "m",
      sortDesc: true,
      editedIndex: -1,
      dialog: false,

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
      // headers: [
      //   { text: "日期", value: "spend_date", width: "70" },
      //   { text: "項目", value: "note", width: "120" },
      //   { text: "支出", value: "expense", width: "70" }
      // ],
      loading: false
      // title:'expenses'
    };
  },
  created() {
    this.getYearData("2022");

    this.getRows2022("2022", "03");
    this.getRows2022("2022", "04");
    this.getRows2022("2022", "05");
    this.getRows2022("2022", "06");
    this.loading = false;
    // console.log(this.rowsMonthTotal);
  },
  methods: {
    queryRows() {
      let filter_rows = this.rows.filter(row => row.date.includes("2022-05"));
      // this.rows.filter(row=>row.note.includes(this.search))
      console.log(this.rows);
      console.log(filter_rows);
      console.log("q");
    },

    // 取得整年加油資料
    async getYearData(y) {
      // 集合
      const expense = collection(db, "expenses");
      // 限定範圍
      let q = query(
        expense,
        orderBy("spend_date", "desc"),
        where("spend_date", ">=", y + "-" + "01-01"),
        where("spend_date", "<=", y + "-" + "12-31"),
        where("cate_name", "==", "加油"),
        limit(100)
      );
      // 文件
      const docExpense = await getDocs(q);

      docExpense.forEach(doc => {
        let row = {};
        row.date = doc.data().spend_date;
        row.amt = doc.data().expense;
        this.rows.push(row);
        // 可用簡化寫法 ... 展開 doc.data() 的 key-value
        // this.rows.push({...doc.data()});
      });

      // 篩選月資料並加總
      let filter_rows = [];
      for (let i = 1; i <= 12; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        let ym = y + "-" + i;
        filter_rows = this.rows.filter(element => element.date.includes(ym));
        let total = 0;
        filter_rows.forEach(row => {
          total += row.amt * 1;
        });
        console.log(total);
        let obj = {};
        obj.y = y;
        obj.m = i;
        obj.amt = total;
        if(total>0)
        this.rowsYM.push(obj);
      }

      // filter_rows = this.rows.filter(element =>
      //   element.date.includes("2022-05")
      // );

      // console.log(filter_rows);
    },
    showDetail(item) {
      this.$router.push({
        name: "ExpenseDetail",
        params: { y: item.y, m: item.m }
      });
      // this.$router.push({path: '/expense/detail/:y', params: { y:'2022' }})
      console.log(item);
      this.search.m = item.m;
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
    }
  }
};
</script>

<style>
</style>