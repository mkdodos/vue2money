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
                <v-select label="帳戶" :items="accounts" v-model="editedItem.account_name"></v-select>
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
        <v-btn @click="openDialog" color="blue-grey" class="white--text">新增</v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <v-row class="mb-1" cols="3" justify="space-between">
          <v-col @click="nextDay">{{ new Date(today).toISOString().slice(5, 10)}}</v-col>
          <!-- 合計 -->
          <v-col cols="4">
            <v-icon left>mdi-currency-usd</v-icon>
            {{ getTotal(rows) }}
          </v-col>
          <!-- 月合計 -->
          <v-col @click="dialogType=true" cols="5">
            <v-icon left>mdi-sigma</v-icon>
            {{ getTotal(rowsMonth) }}
          </v-col>
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
    <!-- 類別明細 -->
     <v-dialog v-model="dialogType" width="500">
     <v-data-table
     sort-by="total"
     :sort-desc="true"
          :items-per-page="100"
          :hide-default-footer="true"
          mobile-breakpoint="360"
          :loading="loading"
          :headers="headersType"
          :items="rowsMonthCates"        
         
        >
         
        </v-data-table>
     </v-dialog>

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
  addDoc,
  doc,
  updateDoc,
  deleteDoc
  // orderBy
} from "firebase/firestore/lite";

const collection_name = "expenses";
export default {
  data() {
    return {
      // 月資料
      rowsMonth: [],
      // 月資料依類別
      rowsMonthCates: [],
      // 單日資料
      rows: [],
      accounts: ["現金", "信用卡"],
      cates: ["餐費", "加油", "水電"],
      headers: [
        // { text: "帳戶", value: "account_name", width: "50" },
        // { text: "日期", value: "spend_date", width: "0" },
        // { text: "類別", value: "cate_name", width: "100" },
        { text: "項目", value: "note", width: "180" },
        // { text: "收入", value: "income" },
        { text: "金額", value: "expense", width: "60" },
        { text: "type", value: "trans_type" }
        // { text: "", value: "actions" }
      ],

       headersType: [
      
        { text: "項目", value: "cate", width: "180" },       
        { text: "金額", value: "total", width: "60" },
      
       
      ],
      dialog: false,
      dialogType: false,
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
        account_name: "現金",
        cate_name: "餐費",
        spend_date: new Date().toISOString().slice(0, 10)
      },
      editedIndex: -1,
      today: new Date().getTime(),
      total: 0
    };
  },
  mounted() {
    this.getMoney();
    this.getCates();
    this.getRowsMonth();
    // console.log(this.rows[0])
  },
  methods: {
    // 月資料
    async getRowsMonth() {
      this.rowsMonth = [];

      const citiesCol = collection(db, collection_name);
      const q = query(
        citiesCol,
        orderBy("spend_date", "desc"),
        where("spend_date", ">=", "2022-06-01"),
        where("spend_date", "<=", "2022-06-30")
        // where("trans_type","==","一般"),
      );

      //  where("spend_date", ">=", y + "-" + m + "-01"),
      //   where("spend_date", "<=", y + "-" + m + "-31"),
      //   where("cate_name", "==", "加油"),
      const citySnapshot = await getDocs(q);
      citySnapshot.forEach(doc => {
        let row = doc.data();
        row.id = doc.id;
        this.rowsMonth.push(row);
      });

      // 統計月支出,把轉帳和投資的資料排除
      // 使用 firestore 的 where 有一些限制, 沒法同時做二個欄位的 >= !=
      // 改用 javascript 的 filter
      this.rowsMonth = this.rowsMonth.filter(row => row.trans_type != "轉帳");
      this.rowsMonth = this.rowsMonth.filter(row => row.trans_type != "投資");
console.log(this.rowsMonth)
      // 統計該月每個分類金額
      this.cates.forEach(cate => {
        // 篩選資料
        let temp = this.rowsMonth.filter(row => row.cate_name == cate);
        let total = 0;
        // 計算加總
        temp.forEach(row => {
          total += row.expense * 1;
        });
        // this.rowsMonthCates.push({total:total,cate:cate});
        // 加到陣列
        if(total>0)
        this.rowsMonthCates.push({ total, cate });
      });

      console.log(this.rowsMonthCates);
    },
    // 類別下拉資料來源
    async getCates() {
      this.cates = [];
      const cates = collection(db, "cates");
      let q = query(cates, orderBy("prior"));
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        // this.cates.push({ ...doc.data(), id: doc.id });
        this.cates.push(doc.data().name);
      });
      // console.log(this.cates);
    },

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
          account_name: this.editedItem.account_name,
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
        where("spend_date", "==", this.theDate()),
        where("expense", "!=", "")
        // ,
        // where("spend_date", "<=", "2022-05-31")
      );
      const citySnapshot = await getDocs(q);
      citySnapshot.forEach(doc => {
        let row = doc.data();
        row.id = doc.id;
        this.rows.push(row);
      });

      // 排除轉帳和投資
      this.rows = this.rows.filter(row => row.trans_type != "轉帳");
      this.rows = this.rows.filter(row => row.trans_type != "投資");

      this.loading = false;
    }
  }
};
</script>

<style>
</style>