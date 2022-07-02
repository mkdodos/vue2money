<template>
  <div>    
    <v-row>
      <v-col v-for="card in cardData" :key="card.m">
        <v-card  class="mx-auto" max-width="400">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="text-h5">{{card.m}}月支出</v-list-item-title>
              <v-list-item-subtitle>Mon, 12:30 PM, Mostly sunny</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-card-text>
            <v-row align="center">
              <v-col class="text-h2" cols="8">{{ card.total}}</v-col>
              <v-col cols="4">
                <v-img
                  src="https://cdn.vuetifyjs.com/images/cards/sun.png"
                  alt="Sunny image"
                  width="82"
                ></v-img>
              </v-col>
            </v-row>
          </v-card-text>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home-analytics</v-icon>
            </v-list-item-icon>
            <v-list-item-subtitle class="subtitle-1">17,891</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-car</v-icon>
            </v-list-item-icon>
            <v-list-item-subtitle class="subtitle-1">10,100</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-food</v-icon>
            </v-list-item-icon>
            <v-list-item-subtitle class="subtitle-1">4,850</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-tree-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-subtitle class="subtitle-1">2,587</v-list-item-subtitle>
          </v-list-item>

        
        </v-card>
      </v-col>

      <!-- <v-col>
        <v-card class="mx-auto" max-width="344">
          <v-card-text>
            <div>上月支出</div>
            <p class="text-h4 text--primary">{{ rowsTotal[0]}}</p>
            <p>adjective</p>
            <div class="text--primary">
              well meaning and kindly.
              <br />"a benevolent smile"
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="deep-purple accent-4">Learn More</v-btn>
          </v-card-actions>
        </v-card>
      </v-col> -->
    </v-row>
    
  </div>
</template>

<script>
import db from "../db.js";
import {
  collection,
  query,
  // orderBy,
  getDocs,
  where
  // addDoc,
  // doc,
  // updateDoc,
  // deleteDoc
  // orderBy
} from "firebase/firestore/lite";

export default {
  data() {
    return {
      rows: [],
      rowsTotal: [],
      cardData:[],
      months: ["06", "07"],
      labels: ["日", "一", "TU", "WED", "TH", "FR", "SA"],
      labels2: ["180", "414", "TU", "WED", "TH", "FR", "SA"],
      time: 0,
      forecast: [
        {
          day: "180",
          icon: "mdi-white-balance-sunny",
          temp: "Tue"
        },
        {
          day: "Wednesday",
          icon: "mdi-white-balance-sunny",
          temp: "414"
        },
        { day: "Thursday", icon: "mdi-cloud", temp: "314" }
      ]
    };
  },
  created() {
    //  this.rows = [];
    // this.getDataYM(y,m);
    // this.getDataYM2();
    //  this.rows = [];
    //   this.getDataYM('2022','06');
    //  this.getDataYM('2022','07');
    this.getData();
  },
  methods: {
    // 資料
    async getData() {
      let rows = [];
      const ref = collection(db, "expenses");
      let y = "2022";
      let m = "06";
      let m2 = "07";
      const q = query(
        ref,
        where("spend_date", ">=", y + "-" + m + "-01"),
        where("spend_date", "<=", y + "-" + m2 + "-31")
      );

      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        rows.push({ ...doc.data() });
      });

      // 排除轉帳和投資
      rows = rows.filter(row => row.trans_type != "轉帳");
      rows = rows.filter(row => row.trans_type != "投資");

      // 月份迴圈
      let months = ["06", "07"];
      let data = [];
      months.forEach(m => {
        let arrMonth = rows.filter(row =>
          row.spend_date.startsWith("2022-" + m)
        );
        // 月份加總
        let total = 0;
        arrMonth.forEach(row => {
          total += row.expense * 1;
        });
        // 類別
        let cates = ["餐費", "日常用品"];
        let detail = [];
        cates.forEach(cate => {
          let arrCate = arrMonth.filter(row => row.cate_name == cate);
          let cateTotal = 0;
          arrCate.forEach(t => {
            cateTotal += t.expense * 1;
          });
          detail.push({ cate: cate, amt: cateTotal });
          console.log(arrCate)
        });
        data.push({
          m: m,
          total: total,
          detail: detail
        });
      });
      this.cardData = data;
      console.log(data);
      // rows = rows.filter(row => row.spend_date.startsWith("2022-06"));

      // 加總
      // console.log(rows);
      // let total = 0;
      // rows.forEach(row => {
      //   total += row.expense * 1;
      // });
      // let cates = ["餐費", "日常用品"];
      // let arrCate = [];
      // 篩選類別資料
      // cates.forEach(cate => {
      //   let temp = rows.filter(row => row.cate_name == cate);
      //   let cateTotal = 0;
      //   temp.forEach(t => {
      //     cateTotal += t.expense * 1;
      //   });
      // arrCate.push({ cate: cate, amt: cateTotal });
      // console.log(cate)
      // });
      // console.log(arrCate);
      // let data = [
      //   {
      //     m: "06",
      //     total: total,
      //     detail: arrCate         
      //   }
      // ];

      
    },
    // 年月資料
    async getDataYM(y, m) {
      let rows = [];
      // let y = "2022";
      // let m = "06";
      const ref = collection(db, "expenses");

      const q = query(
        ref,
        where("spend_date", ">=", y + "-" + m + "-01"),
        where("spend_date", "<=", y + "-" + m + "-31")
      );

      // 資料
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        // this.rows.push({ ...doc.data(), id: doc.id });
        rows.push({ ...doc.data() });
      });

      // 排除轉帳和投資
      rows = rows.filter(row => row.trans_type != "轉帳");
      rows = rows.filter(row => row.trans_type != "投資");
      let total = 0;
      rows.forEach(row => {
        total += row.expense * 1;
      });
      // Create our number formatter.
      var formatter = new Intl.NumberFormat("en-US", {
        // style: "currency",
        currency: "USD"
      });

      total = formatter.format(total); /* $2,500.00 */
      // console.log(this.rows)
      this.rowsTotal.push(total);
      console.log(total);
    },
    async getDataYM2() {
      let y = "2022";
      let m = "07";
      const ref = collection(db, "expenses");

      const q = query(
        ref,
        where("spend_date", ">=", y + "-" + m + "-01"),
        where("spend_date", "<=", y + "-" + m + "-31")
      );

      // 資料
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        // this.rows.push({ ...doc.data(), id: doc.id });
        this.rows.push({ ...doc.data() });
      });

      // 排除轉帳和投資
      this.rows = this.rows.filter(row => row.trans_type != "轉帳");
      this.rows = this.rows.filter(row => row.trans_type != "投資");
      let total = 0;
      this.rows.forEach(row => {
        total += row.expense * 1;
      });
      console.log(this.rows);
      this.rowsTotal.push(total);
      console.log(total);
    },
    async getTotal() {}
  }
};
</script>

<style>
</style>