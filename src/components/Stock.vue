<template>
  <div>
    <v-container>
      <v-form>
        <v-row>
          <v-col>
            <v-text-field label="名稱" v-model="editRow.stockName"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field label="股數" v-model="editRow.qty" type="number"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field label="單價" v-model="editRow.price" type="number"></v-text-field>
          </v-col>
        </v-row>

        <v-row class="mb-6">
          <v-col class="text-right">
            <v-btn color="green" class="white--text" @click="save">儲存</v-btn>
          </v-col>
        </v-row>
      </v-form>
      <v-data-table :headers="headers" :items="rows">
        
        <template v-slot:item.amt="{item}">{{ item.price * item.qty }}</template>
        <template v-slot:item.edit="{item}">         
          <v-icon @click="edit(item)">mdi-pencil</v-icon>
        </template>
        <template v-slot:item.del="{item}">
          <v-icon @click="destory(item)">mdi-delete</v-icon>         
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "firebase/firestore/lite";

import db from "../db.js";

const collection_name = "stocks";

export default {
  data() {
    return {     
      rows: [],//資料     
      editRow:{},//編輯列
      headers: [
        { text: "", value: "del" },
        { text: "名稱", value: "stockName" },
        { text: "股數", value: "qty" },
        { text: "單價", value: "price" },
        { text: "小計", value: "amt" },
        { text: "", value: "edit" }
      ],
      editedIndex: -1
    };
  },
  created() {
    this.getMoney();
  },
  methods: {
    // 編輯
    edit(item) {
      this.editedIndex = this.rows.indexOf(item);
      // 選取列 item 設定給編輯列
      this.editRow = Object.assign({},item)
      console.log(item);
    },
    // 儲存
    save() {
      // 判斷 editedIndex -1 為 新增
      if(this.editedIndex>-1){
        this.update(this.editRow)
        // console.log("edit")
        // 將表單清空
        this.editRow = {}
        this.editedIndex = -1;
      }else{
        this.create()
        // console.log("create")
      }
      
    },
    // 更新
    update(item) {
      // 將編輯列更新為表單的資料
      Object.assign(this.rows[this.editedIndex],this.editRow)
      //
      console.log(item)
    },
    // 刪除
    async destory(item) {
      this.editedIndex = this.rows.indexOf(item);
      await deleteDoc(doc(db, collection_name, item.id)).then(
        this.rows.splice(this.editedIndex, 1)
      );
    },
    del(item) {
      console.log(item.id);
    },
    async getMoney() {
      const citiesCol = collection(db, "stocks");
      const citySnapshot = await getDocs(citiesCol);
      let docs = citySnapshot.docs; //陣列
      docs.forEach(doc => {
        let row = doc.data(); //1筆資料(不含id)
        row.id = doc.id; //加入id
        this.rows.push(row);
        console.log(row);
      });
    },
    // 新增
    async create() {    
      await addDoc(collection(db, "stocks"), {
        date: new Date(),
        stockName: this.editRow.stockName,
        qty: this.editRow.qty,
        price: this.editRow.price       
      }).then(doc => {
        // 新增完,取得 ID ,才可立即做刪除
        this.editRow.id = doc.id
        this.rows.unshift(this.editRow);
        this.editRow = {};
        // Object.assign(this.row,{})
        console.log(doc.id);
      });
    }
  }
};
</script>

<style>
.v-data-table > .v-data-table__wrapper > table > thead > tr > th,
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-size: 16px !important;
}
</style>