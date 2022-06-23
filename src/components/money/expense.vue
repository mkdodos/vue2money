<template>
  <div>
    <expenseEditDialog :rows="rows" :dialog="dialog"
    :editedIndex="editedIndex"
    :editedItem="editedItem"
    :defaultItem="defaultItem"
     incomeOrExpense="expense" />
    <v-data-table
     @click:row="editItem"
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
import db from "../../db.js";
import expenseEditDialog from "../../components/expenseEditDialog.vue";
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
  // orderBy,
  // orderBy
} from "firebase/firestore/lite";
export default {
  components: {
    expenseEditDialog
  },
  data() {
    return {
       defaultItem: {
        note: "",
        expense: "",
        account_name: "現金",
        cate_name: "餐費",
        spend_date: new Date().toISOString().slice(0, 10)
      },
       editedItem: {
        note: "",
        expense: "",
        // 2022-03-16 配合日期輸入框可用格式 yyyy-mm-dd
        spend_date: new Date().toISOString().slice(0, 10)
      },
      editedIndex: -1,
      sortBy: "spend_date",
      sortDesc: true,
      // 資料
      rows: [],
      headers: [
        { text: "日期", value: "spend_date", width: "70" },
        { text: "項目", value: "note", width: "120" },
        // { text: "收入", value: "income", width: "90" },
        { text: "支出", value: "expense", width: "70" }
      ],
      loading: false,
      dialog: false
    };
  },
  methods: {
    editItem(item) {
      this.dialog = true
      this.editedIndex = this.rows.indexOf(item);
      this.editedItem = Object.assign({}, item);
      // console.log(this.dialogFrom)
      // console.log(item.id)
    },
    async getDataYM() {
      this.rows = [];
      this.loading = true;
      const ref = collection(db, "expenses");

      let q = query(
        ref,
        // orderBy("spend_date","desc"),
        where("expense", "!=", ""),
        limit(100)
      );
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