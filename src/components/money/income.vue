<template>
  <div>
    <expenseEditDialog :rows="rows" incomeOrExpense="income" />
    <v-data-table
     
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :loading="loading"
      mobile-breakpoint="300"
      :headers="headers"
      :items="rows"
    ></v-data-table>
  </div>
</template>

<script>
import expenseEditDialog from "../../components/expenseEditDialog.vue";
import db from "../../db.js";
import {
  collection,
  // updateDoc,
  // addDoc,
  // deleteDoc,
  // doc,
  query,
  getDocs,
  limit,
  where
  // orderBy
} from "firebase/firestore/lite";
export default {
  components: {
    expenseEditDialog
  },
  data() {
    return {
      sortBy: "spend_date",
      sortDesc: true,
      // 資料
      rows: [],
      headers: [
        { text: "日期", value: "spend_date", width: "70" },
        { text: "項目", value: "note", width: "120" },
        { text: "收入", value: "income", width: "90" }
        // { text: "支出", value: "expense", width: "70" }
      ],
      loading: false
    };
  },
  methods: {
    async getDataYM() {
      this.rows = [];
      this.loading = true;
      const ref = collection(db, "expenses");
      let q = query(ref, where("income", "!=", ""), limit(100));
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        this.rows.push({ ...doc.data(), id: doc.id });
      });
      this.loading = false;
    }
  },
  created() {
    this.getDataYM();
  }
};
</script>

<style>
</style>