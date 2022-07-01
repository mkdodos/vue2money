<template>
  <div>
    <v-row>
      <v-col>
        <v-card class="mx-auto" max-width="400">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="text-h5">本月支出</v-list-item-title>
              <v-list-item-subtitle>Mon, 12:30 PM, Mostly sunny</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-card-text>
            <v-row align="center">
              <v-col class="text-h2" cols="8">{{ rowsTotal[1]}}</v-col>
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

          <v-slider v-model="time" :max="6" :tick-labels="labels" class="mx-4" ticks></v-slider>
          <v-slider v-model="time" :max="6" :tick-labels="labels2" class="mx-4" ticks></v-slider>

          <v-list class="transparent">
            <v-list-item v-for="item in forecast" :key="item.day">
              <v-list-item-title>{{ item.day }}</v-list-item-title>

              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-subtitle class="text-right">{{ item.temp }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn text>Full Report</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col>
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
      </v-col>
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
      rowsTotal:[],
      months:['06','07'],
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
    this.getDataYM('2022','06');
   this.getDataYM('2022','07');
  },
  methods: {
    // 年月資料
    async getDataYM(y,m) {
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
        rows.push( {...doc.data()} );
      });

      // 排除轉帳和投資
      rows = rows.filter(row => row.trans_type != "轉帳");
      rows = rows.filter(row => row.trans_type != "投資");
      let total = 0
      rows.forEach(row=>{
        total+=row.expense*1
      })
       // Create our number formatter.
      var formatter = new Intl.NumberFormat("en-US", {
        // style: "currency",
        currency: "USD"
      });

      total = formatter.format(total); /* $2,500.00 */
      // console.log(this.rows)
      this.rowsTotal.push(total)
      console.log(total)
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
        this.rows.push( {...doc.data()} );
      });

      // 排除轉帳和投資
      this.rows = this.rows.filter(row => row.trans_type != "轉帳");
      this.rows = this.rows.filter(row => row.trans_type != "投資");
      let total = 0
      this.rows.forEach(row=>{
        total+=row.expense*1
      })
      console.log(this.rows)
      this.rowsTotal.push(total)
      console.log(total)
    },
    async getTotal() {}
  }
};
</script>

<style>
</style>