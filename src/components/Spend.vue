<template>
  <div>
    <!-- 輸入表單 -->
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 lighten-2">編輯</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="日期" v-model="editedItem.spend_date" type="date"></v-text-field>
              </v-col>
              <v-col>
                <v-select label="分類" :items="cates" v-model="editedItem.cate_name"></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="項目" v-model="editedItem.note" hide-details="auto"></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="金額"
                  append-icon="mdi-currency-usd"
                  v-model="editedItem.expense"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-row class="mb-6">
            <v-col class="text-left">
              <!-- 刪除鈕 -->
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
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row justify="space-between">
      <v-col cols="12">
        <v-text-field label v-model="search" append-icon="mdi-magnify"></v-text-field>
      </v-col>
      <!-- <v-col cols="4">
        <v-btn color="cyan" class="white--text" @click="queryRows">
          查詢
          <v-icon right>mdi-magnify</v-icon>
        </v-btn>
      </v-col>-->
    </v-row>

    <v-row justify="space-between" class="mb-3">
      <v-col cols="4">
        <v-btn color="cyan" class="white--text" @click="preDay">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn color="cyan" class="white--text" @click="nextDay">
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="4">
        <!-- <v-btn color="cyan" class="white--text" @click="openDialog">新增</v-btn> -->
        <!-- <v-btn @click="openDialog" color="blue-grey" class="ma-2 white--text"> -->
        <v-btn @click="openDialog" color="blue-grey" class="white--text">
          新增
          <!-- <v-icon>mdi-plus-circle-outline</v-icon> -->
        </v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <v-row class="mb-1" cols="4" justify="space-between">
          <v-col @click="nextDay">{{ new Date(today).toISOString().slice(5, 10)}}</v-col>
          <!-- 合計 -->
          <v-col cols="4">{{ getTotal(rows) }}</v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <!-- 表格 -->
        <v-data-table
          :items-per-page="100"
          :hide-default-footer="true"
          mobile-breakpoint="360"
          :loading="loading"
          :headers="headers"
          :items="rows"
          :search="search"
          @click:row="editItem"
        >
          <template v-slot:item.spend_date="{ item }">{{ item.spend_date.slice(0,10) }}</template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import db from "../db.js";
import {
  collection,
  query,
  // orderBy,
  getDocs,
  where,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
  // orderBy
} from "firebase/firestore/lite";

const collection_name = "spends";
export default {
  data() {
    return {
      rows: [],
      cates: ["餐費", "加油", "水電"],
      headers: [
        // { text: "日期", value: "spend_date", width: "0" },
        // { text: "類別", value: "cate_name", width: "100" },
        { text: "項目", value: "note", width: "200" },
        // { text: "收入", value: "income" },
        { text: "金額", value: "expense", width: "90" }
        // { text: "備註", value: "note_html" },
        // { text: "", value: "actions" }
      ],
      dialog: false,
      loading: true,
      search: "",
      editedItem: {
        note: "",
        expense: "",
        // 2022-03-16 配合日期輸入框可用格式 yyyy-mm-dd
        spend_date: new Date().toISOString().slice(0, 10)
      },
      defaultItem: {
        note: "",
        expense: "",
        spend_date: new Date().toISOString().slice(0, 10)
      },
      editedIndex: -1,
      today: new Date().getTime(),
      total: 0
    };
  },
  mounted() {
    this.getMoney();
    // console.log(this.rows[0])
  },
  methods: {
    // 合計
    getTotal(arr) {      
      const total = Object.keys(arr).reduce(function(previous, key) {
        return previous + arr[key].expense * 1;
      }, 0);
      return total;
    },
    async queryRows() {
      this.headers.push({ text: "日期", value: "spend_date", width: "100" });
      this.rows = [];
      this.loading = true;
      const citiesCol = collection(db, collection_name);
      const q = query(
        citiesCol,
        where("note", ">=", this.search),
        where("note", "<=", this.search + "\uf8ff")
        // orderBy('note','desc'),
        // orderBy('spend_date','desc')
      );

      const citySnapshot = await getDocs(q);
      citySnapshot.forEach(doc => {
        let row = doc.data();
        row.id = doc.id;
        this.rows.push(row);
      });

      this.loading = false;
      console.log("query");
    },
    // 做為查詢的日期 2022-05-24
    theDate() {
      return new Date(this.today).toISOString().slice(0, 10);
    },
    nextDay() {
      this.today = this.today + 86400000;
      this.getMoney();
      this.headers.splice(2, 1);

      //  console.log(new Date(this.today))
    },
    preDay() {
      this.today = this.today - 86400000;
      this.getMoney();
      this.headers.splice(2, 1);

      //  console.log(new Date(this.today))
    },
    openDialog() {
      // 避免按下編輯鈕,沒有儲存,再按新增,欄位留下原本要編輯的值
      // 所以在此將值設為預設值
      this.editedItem = Object.assign({}, this.defaultItem);
      this.dialog = true;
    },
    async deleteItem(id, index) {
      if (!confirm("確定刪除")) return;
      await deleteDoc(doc(db, collection_name, id));
      this.rows.splice(index, 1);
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      this.dialog = false;
    },
    editItem(item) {
      this.dialog = true;
      this.editedIndex = this.rows.indexOf(item);
      this.editedItem = Object.assign({}, item);
    },

    async save() {
      //更新
      if (this.editedIndex > -1) {
        const ref = doc(db, collection_name, this.editedItem.id);

        await updateDoc(ref, this.editedItem);

        // Object.assign(target, ...sources)
        // 將表單的值傳回表格中
        Object.assign(this.rows[this.editedIndex], this.editedItem);

        this.$nextTick(() => {
          // 將表單的值設成預設值
          this.defaultItem.date = "";
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        });
      } else {
        // 新增

        const docRef = await addDoc(collection(db, collection_name), {
          spend_date: this.editedItem.spend_date,
          cate_name: this.editedItem.cate_name,
          note: this.editedItem.note,
          expense: this.editedItem.expense
        });

        // 設定新增後取得的 id, 才可馬上做編輯
        this.editedItem.id = docRef.id;
        // 將項目加入到資料列
        this.rows.unshift(this.editedItem);
        // console.log(this.rows);
      }

      this.dialog = false;
    },
    // 單日資料
    async getMoney() {
      this.rows = [];
      this.loading = true;
      const citiesCol = collection(db, collection_name);
      const q = query(
        citiesCol,
        // where 用 == 不能用 orderBy
        // orderBy("spend_date", "desc"),
        where("spend_date", "==", this.theDate())
        // ,
        // where("spend_date", "<=", "2022-05-31")
      );
      const citySnapshot = await getDocs(q);
      citySnapshot.forEach(doc => {
        let row = doc.data();
        row.id = doc.id;
        this.rows.push(row);
      });

      this.loading = false;
    }
  }
};
</script>

<style>
</style>