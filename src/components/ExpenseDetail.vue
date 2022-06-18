<template>
  <div>
    <!-- 返回 -->
    <v-row class="mt-2">
      <v-btn @click="goBack" class="ma-2" color="orange darken-2" dark>
        <v-icon dark left>mdi-arrow-left</v-icon>Back
      </v-btn>
    </v-row>

    <!-- 編輯表單 -->
    <v-row>
       <v-col>
        <v-text-field label="項目" v-model="editedRow.note"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field label="KM" v-model="editedRow.km"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field type="number" label="price" v-model="editedRow.price"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field type="number" label="qty" v-model="editedRow.qty"></v-text-field>
      </v-col>
      <v-col>
        <v-btn @click="save" class="ma-2" color="darken-2" dark>
          Save
        </v-btn>
      </v-col>
    </v-row>

    <!-- 資料表格 -->
    <v-row class="mt-3">
      <v-col>
 <v-data-table
        mobile-breakpoint="300"
        :headers="headers"
        :items="rows"
        @click:row="editItem"
        :items-per-page="100"
      >
        <template v-slot:item.spend_date="{ item }">{{ item.spend_date.slice(5,10) }}</template>
      </v-data-table>
      </v-col>
     
    </v-row>
  </div>
</template>

<script>
import db from "../db.js";
import {
  collection,
  doc,
  updateDoc,
  query,
  getDocs,
  limit,
  where,
  orderBy
} from "firebase/firestore/lite";
export default {
  data() {
    return {
      rows: [],
      headers: [
        { text: "日期", value: "spend_date", width: "70" },
        { text: "項目", value: "note", width: "80" },
        { text: "里程", value: "km", width: "50" },
        { text: "單價$", value: "price", width: "60" },
        { text: "公升", value: "qty", width: "20" },
        { text: "支出", value: "expense", width: "70" }
      ],
      editedRow: {},
      defaultItem: {},
      editedIndex: -1
    };
  },
  created() {
    this.getDataYM();
    // console.log(this.$route.params.m);
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.rows.indexOf(item);
      this.editedRow = Object.assign({}, item);
     
      console.log(item);
    },
    async save() {
      const docRef = doc(db, "expenses", this.editedRow.id);
      await updateDoc(docRef, this.editedRow);
      // 將表單的值傳回表格中
        Object.assign(this.rows[this.editedIndex], this.editedRow);

        this.$nextTick(() => {
          // 將表單的值設成預設值
          
          this.editedRow = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        });
    },
    goBack() {
      this.$router.go(-1);
    },
    async getDataYM() {
      this.rows = [];
      // this.loading = true;
      const citiesCol = collection(db, "expenses");
      // if(this.$route.params.m==undefined)
      console.log(this.$route.params.y);
      // 依年查詢
      let q = query(
        citiesCol,
        orderBy("spend_date", "desc"),
        where("spend_date", ">=", this.$route.params.y + "-01-01"),
        where("spend_date", "<=", this.$route.params.y + "-12-31"),
        where("cate_name", "==", "加油"),
        limit(100)
      );
      // 依年月查詢 (有選擇月)
      // if (this.search.m != "00")
      if (this.$route.params.m != undefined)
        q = query(
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