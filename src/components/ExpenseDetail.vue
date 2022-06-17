<template>
  <div>
   
      <v-row class="mt-2">
        <!-- <v-icon @click="goBack" right >mdi-arrow-left</v-icon> -->
        <v-btn
        @click="goBack"
        class="ma-2"
        color="orange darken-2"
        dark
      >
        <v-icon
          dark
          left
        >
          mdi-arrow-left
        </v-icon>Back
      </v-btn>
      </v-row>
      
     
    <!-- {{$route.params.m}} -->
    <v-row class="mt-3">
     <v-data-table
      mobile-breakpoint="300"
      :headers="headers"
      :items="rows"
     
     
      :items-per-page="100"
      
    >
      <template v-slot:item.spend_date="{ item }">{{ item.spend_date.slice(5,10) }}</template>
    </v-data-table>
    </v-row>
    </div>

</template>

<script>
import db from "../db.js";
import {
  collection,
  // doc,
  query,
  getDocs,
  limit,
  where,
  orderBy
} from "firebase/firestore/lite";
export default {
  data(){
    return {
      rows: [],
        headers: [
        { text: "日期", value: "spend_date", width: "70" },
        { text: "項目", value: "note", width: "120" },
        { text: "支出", value: "expense", width: "70" }
      ],
    }
  },
  created() {
    this.getDataYM()
    console.log(this.$route.params.m);
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    async getDataYM() {
      this.rows = [];
      // this.loading = true;
      const citiesCol = collection(db, 'expenses');
      // 依年查詢
      // let q = query(
      //   citiesCol,
      //   orderBy("spend_date", "desc"),
      //   where("spend_date", ">=", this.search.y + "-01-01"),
      //   where("spend_date", "<=", this.search.y + "-12-31"),
      //   where("cate_name", "==", "加油"),
      //   limit(100)
      // );
      // 依年月查詢 (有選擇月)
      // if (this.search.m != "00")
      let q = query(
          citiesCol,
          orderBy("spend_date", "desc"),
          where(
            "spend_date",
            ">=",
            this.$route.params.y + "-" + this.$route.params.m + "-01"
          ),
          where(
            "spend_date",
            "<=",
            this.$route.params.y + "-" + this.$route.params.m + "-31"
          ),
          where("cate_name", "==", "加油"),
          limit(100)
        );
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