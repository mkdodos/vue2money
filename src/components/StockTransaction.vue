<template>
  <div>
    <v-container>
      {{this.id}}
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">股票編輯</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field label="日期" v-model="editRow.date" type="date"></v-text-field>
              </v-col>

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
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- <v-btn color="primary" text @click="dialog = false">取消</v-btn> -->
            <v-btn color="primary" text @click="cancel">取消</v-btn>
            <v-btn color="green" class="white--text" @click="save">儲存</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-form>
        <v-row class="mb-6">
          <v-col>
            <v-btn color="cyan" class="white--text" @click="openDialog">新增</v-btn>
          </v-col>
          <v-col cols="6" md="4">
            <v-alert border="right" type="info" colored-border elevation="2">
              <h3 class="text-center">合計: {{ total }}</h3>
            </v-alert>
          </v-col>
        </v-row>
      </v-form>
      <v-data-table :headers="headers" :items="rows">
        <template v-slot:item.date="{item}">{{item.date.toDate().toISOString().slice(0, 10)}}</template>
        <template v-slot:item.stockName="{item}">
          <!-- <router-link to="/stock-transaction">{{item.stockName}}</router-link> -->
          <router-link :to="{name:'StockTransaction',params:{id:item.id}}">{{item.stockName}}</router-link>
        </template>
        <template v-slot:item.type="{item}">
          <v-chip dark :color="getTypeColor(item)">{{ getType(item) }}</v-chip>
        </template>
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
  updateDoc,
  doc,
  Timestamp,
  query,
  where
} from "firebase/firestore/lite";

import db from "../db.js";

const collection_name = "stockTransaction";

export default {
  data() {
    return {
      dialog: false,
      id: this.$route.params.id,
      rows: [], //資料
      editRow: {
        // 2022-03-16 配合日期輸入框可用格式 yyyy-mm-dd
        date: new Date().toISOString().slice(0, 10)
      }, //編輯列
      headers: [
        { text: "", value: "del" },
        { text: "日期", value: "date" },
        { text: "交易類別", value: "type" },
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
    // console.log(this.id);
    this.getMoney();
  },
  computed: {
    total() {
      let sum = 0;
      this.rows.forEach(row => {
        sum += row.price * row.qty;
      });
      return sum;
    }
  },
  methods: {
    // 編輯取消
    cancel() {
      this.dialog = false;
      this.editRow = {};
      this.editedIndex = -1;
    },
    // 交易類別文字
    getType(item) {
      if (item.qty > 0) {
        return "買進";
      }
      return "賣出";
    },
    // 交易類別文字顏色
    getTypeColor(item) {
      if (item.qty > 0) {
        return "orange";
      }
      return "green";
    },
    // 開啟編輯視窗
    openDialog() {
      this.dialog = true;
    },
    // 編輯
    edit(item) {
      // console.log(item.date);
      this.editedIndex = this.rows.indexOf(item);
      console.log(this.editedIndex);
      // 選取列 item 設定給編輯列
      this.editRow = Object.assign({}, item);
      // 轉成日期輸入框可接受格式
      this.editRow.date = this.editRow.date
        .toDate()
        .toISOString()
        .slice(0, 10);
      this.dialog = true;
    },
    // 儲存
    save() {
      // 判斷 editedIndex -1 為 新增
      if (this.editedIndex > -1) {
        this.update(this.editRow);
        // this.editedIndex = -1;
        //  Uncaught (in promise) TypeError:
        //  Cannot convert undefined or null to object at Function.assign
        //  如果放在這邊會出問題
        //  因為 update 函數設成是 async 非同步,在還沒處理完Object.assign(this.rows[this.editedIndex], item)
        //  就先跑 editedIndex 設為 -1 導致錯誤
      } else {
        this.create();
        // console.log("create")
      }
    },
    // 新增
    async create() {
      // console.log(Timestamp.fromDate(new Date(this.editRow.date)))
      let newDate = Timestamp.fromDate(new Date(this.editRow.date));
      await addDoc(collection(db, collection_name), {
        date: newDate,
        stockName: this.editRow.stockName,
        qty: this.editRow.qty,
        price: this.editRow.price
      }).then(doc => {
        // 新增完,取得 ID ,才可立即做刪除
        this.editRow.id = doc.id;
        this.dialog = false;
        this.editRow.date = newDate;
        this.rows.unshift(this.editRow);
        this.editRow = {};
        this.editRow.date = new Date().toISOString().slice(0, 10);
        // Object.assign(this.row,{})
        console.log(doc.id);
      });
    },
    // 更新
    async update(item) {
      // 將編輯列更新為表單的資料

      // this.editRow.date = Timestamp.fromDate(new Date(this.editRow.date));

      // this.editedItem.date = Timestamp.fromDate(
      //           new Date(this.editedItem.date)
      //         );

      item.date = Timestamp.fromDate(new Date(item.date));
      const docRef = doc(db, collection_name, item.id);
      await updateDoc(docRef, item).then(() => {
        // item.date = item.date
        // .toDate()
        // .toISOString()
        // .slice(0, 10);
        Object.assign(this.rows[this.editedIndex], item);
        this.dialog = false;
        this.editRow = {};
        this.editedIndex = -1;
      });
      // 轉成日期輸入框可接受格式

      // this.editRow.date = item.date
      //   .toDate()
      //   .toISOString()
      //   .slice(0, 10);
      // console.log(item.date)
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
      let q = "";
      if (this.id != null) {
        q = query(
          collection(db, collection_name),
          where("stockID", "==", this.id)
        );
        console.log("ddd");
      } else {
        q = collection(db, collection_name);
      }

      // console.log(this.$route.params);

      // const querySnapshot = await getDocs(q);

      // const citiesCol = collection(db, "stocks");
      // const citySnapshot = await getDocs(citiesCol);
      const citySnapshot = await getDocs(q);
      let docs = citySnapshot.docs; //陣列
      docs.forEach(doc => {
        let row = doc.data(); //1筆資料(不含id)
        row.id = doc.id; //加入id
        this.rows.push(row);
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