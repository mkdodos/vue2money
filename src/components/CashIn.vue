<template>
  <div>
    <v-chip class="ma-2" color="orange" outlined>{{ getTotal(rows) }}</v-chip>
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
            </v-row>

            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="項目" v-model="editedItem.note" hide-details="auto"></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="金額"
                  append-icon="mdi-currency-usd"
                  v-model="editedItem.income"
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
    <v-col class="text-right">
    <v-btn @click="openDialog" color="blue-grey" class="white--text">新增</v-btn>
    </v-col>
    <v-data-table
      :items="rows"
      :headers="headers"
      :loading="loading"
      @click:row="editItem"
      mobile-breakpoint="300"
    ></v-data-table>
  </div>
</template>

<script>
import db from "../db.js";
import {
  collection,
  updateDoc,
  addDoc,
  deleteDoc,
  doc,
  query,
  getDocs,
  // limit,
  where,
  orderBy
} from "firebase/firestore/lite";

const coll = "incomes";

export default {
  data() {
    return {
      // 資料
      rows: [],
      headers: [
        { text: "日期", value: "spend_date", width: "120" },
        { text: "項目", value: "note", width: "150" },
        { text: "金額", value: "income", width: "90" }
      ],
      loading: false,
      dialog: false,
      defaultItem: {
        note: "",
        income: "",
        spend_date: new Date().toISOString().slice(0, 10)
      },
      editedItem: {
        note: "",
        income: "",
        spend_date: new Date().toISOString().slice(0, 10)
      },
      editedIndex: -1
    };
  },
  created() {
    this.getData();
  },
  methods: {
    editItem(item) {
      this.dialog = true;
      this.editedIndex = this.rows.indexOf(item);
      this.editedItem = Object.assign({}, item);
    },
    async deleteItem(id, index) {
      if (!confirm("確定刪除")) return;
      await deleteDoc(doc(db, coll, id));
      this.rows.splice(index, 1);
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      this.dialog = false;
    },
    // 合計
    getTotal(arr) {
      let total = Object.keys(arr).reduce(function(previous, key) {
        return previous + arr[key].income * 1;
      }, 0);

      var formatter = new Intl.NumberFormat("en-US", {
        // style: "currency",
        currency: "USD"
      });

      total = formatter.format(total);
      return total;
    },
    async getData() {
      this.rows = [];
      this.loading = true;
      const citiesCol = collection(db, coll);

      const q = query(
        citiesCol,
        where("income", "!=", 0),
        orderBy("income"),
        // where("income", ">", 0)
        //  orderBy("spend_date", "desc"),
      );

      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        this.rows.push({ ...doc.data(), id: doc.id });
      });
      this.loading = false;
      console.log(this.rows);
    },
    openDialog() {
      // 避免按下編輯鈕,沒有儲存,再按新增,欄位留下原本要編輯的值
      // 所以在此將值設為預設值
      this.editedItem = Object.assign({}, this.defaultItem);
      this.dialog = true;
    },
    async save() {
      //更新
      if (this.editedIndex > -1) {
        const ref = doc(db, coll, this.editedItem.id);

        let row = {
          spend_date: this.editedItem.spend_date,
          note: this.editedItem.note,
          // *1 讓字串變數值和原本 mysql 資料格式相同,之後才可一起做查詢統計
          income: this.editedItem.income * 1
        };
        await updateDoc(ref, row);

        // Object.assign(target, ...sources)
        // 將表單的值傳回表格中
        Object.assign(this.rows[this.editedIndex], this.editedItem);

        this.$nextTick(() => {
          // 將表單的值設成預設值
          // this.defaultItem.date = "";
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        });
      } else {
        // 新增
        console.log(this.editedItem);
        const docRef = await addDoc(collection(db, coll), {
          spend_date: this.editedItem.spend_date,
          note: this.editedItem.note,
          // *1 讓字串變數值和原本 mysql 資料格式相同,之後才可一起做查詢統計
          income: this.editedItem.income * 1
        });

        // 設定新增後取得的 id, 才可馬上做編輯
        this.editedItem.id = docRef.id;
        // 將項目加入到資料列
        this.rows.unshift(this.editedItem);
        // console.log(this.rows);
      }

      this.dialog = false;
    }
  }
};
</script>

<style>
</style>