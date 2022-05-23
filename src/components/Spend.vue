<template>
  <div>
    <!-- 輸入表單 -->
    <v-form>
      <v-text-field label="日期" v-model="editedItem.spend_date" type="date"></v-text-field>
      <v-text-field label="項目" v-model="editedItem.note" hide-details="auto"></v-text-field>
      <v-text-field label="金額" v-model="editedItem.expense" type="number"></v-text-field>

      <v-row class="mb-6">
        <v-col class="text-left">
          <v-icon
            v-if="editedIndex>-1"
            small
            @click="deleteItem(editedItem.id,editedIndex)"
          >mdi-delete</v-icon>
        </v-col>
        <v-col class="text-right">
          <v-btn color="green" class="white--text" @click="save">儲存</v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-text-field label="查詢" v-model="search" append-icon="mdi-magnify"></v-text-field>
    <v-data-table :loading="loading" :headers="headers" :items="rows" :search="search"></v-data-table>
  </div>
</template>

<script>
import db from "../db.js";
import {
  collection,
  query,
  orderBy,
  getDocs,
  where,
  addDoc
} from "firebase/firestore/lite";

const collection_name = "spends";
export default {
  data() {
    return {
      rows: [],
      headers: [
        { text: "日期", value: "spend_date", width: "150" },
        { text: "類別", value: "cate", width: "100" },
        { text: "項目", value: "note", width: "300" },
        { text: "收入", value: "income" },
        { text: "支出", value: "expense" },
        { text: "備註", value: "note_html" }
      ],
      loading: true,
      search: "",
      editedItem: {
        note: "",
        expense: "",
        // 2022-03-16 配合日期輸入框可用格式 yyyy-mm-dd
        spend_date: new Date().toISOString().slice(0, 10)
      },
       editedIndex: -1,
    };
  },
  mounted() {
    this.getMoney();
  },
  methods: {
    async save() {
 // 新增
        
        await addDoc(collection(db, collection_name), {
          spend_date: this.editedItem.spend_date,        
          note: this.editedItem.note,
          expense: this.editedItem.expense
        });        
       
       
        // 將項目加入到資料列 
        this.rows.unshift(this.editedItem);     
        console.log(this.rows)

    },
    async getMoney() {
      this.loading = true;
      const citiesCol = collection(db, collection_name);
      // const q = query(citiesCol, orderBy("spend_date", "desc"));
      // const q = query(citiesRef, where("state", "==", "CA"));
      const q = query(
        citiesCol,
        orderBy("spend_date", "desc"),
        where("spend_date", ">=", "2022-05-23"),
        where("spend_date", "<=", "2022-05-23")
      );
      const citySnapshot = await getDocs(q);
      citySnapshot.forEach(doc => {
        let row = doc.data();
        row.id = doc.id;
        this.rows.push(row);
      });
      this.loading = false;
      console.log(this.rows);
    }
  }
};
</script>

<style>
</style>