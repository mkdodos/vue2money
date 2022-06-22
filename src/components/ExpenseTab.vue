<template>
  <div>
    <!-- 編輯表單 -->
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

    <!-- 查詢 -->
    <v-row>
      <v-col>
        <v-text-field type="number" v-model="search.y" label="年"></v-text-field>
      </v-col>
      <v-col>
        <v-select :items="months" v-model="search.m"></v-select>
        <!-- <v-text-field type="number" v-model="search.m" label="月"></v-text-field> -->
      </v-col>
      <v-col>
       <!-- <v-btn @click="openDialog" color="blue-grey" class="white--text">
          新增          
        </v-btn> -->

      </v-col>
     
    </v-row>
    <v-row>
      <v-col>
        <v-select label="帳戶" :items="accounts" v-model="search.account_name"></v-select>
      </v-col>

      <v-col>
        <v-select
          label="分類"
          :items="cates"
          return-object
          item-text="name"
          item-value="id"
          v-model="search.cate_name"
        ></v-select>
      </v-col>
 <v-col>
        <v-btn @click="getDataYM2">查詢</v-btn>
      </v-col>
      <!-- <v-col>
        <v-btn @click="getDataByCate">分類查詢</v-btn>
      </v-col> -->
    </v-row>
    <v-row>
      <v-col cols="8">
        <v-text-field v-model="search.keyword" append-icon="mdi-magnify"></v-text-field>
      </v-col>
      <v-col>
        <v-btn @click="switchCols">切換欄位</v-btn>
      </v-col>
    </v-row>

<editDialog :rows="rows" />

    <!-- 表格 -->
    <v-row>
      <v-col cols="8"></v-col>
      <!-- 合計 -->
      <v-col cols="4">
        <v-btn outlined color="red" dark>{{ getTotal(rows) }}</v-btn>
        <!-- <v-chip class="ma-2" color="green" outlined label>合計: {{ getTotal(rows) }}</v-chip> -->
      </v-col>
    </v-row>
    <!-- <v-row> -->
    <!-- <v-col cols="2"></v-col> -->
    <!-- <v-col cols="12"> -->
    <v-data-table
      mobile-breakpoint="300"
      @click:row="editItem"
      :headers="headers"
      :items="rows"
      :search="search.keyword"
      :loading="loading"
      :items-per-page="100"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
    >
      <template v-slot:item.spend_date="{ item }">{{ item.spend_date.slice(5,10) }}</template>
    </v-data-table>
    <!-- </v-col> -->
    <!-- </v-row> -->
    
  </div>
</template>

<script>
// const collection_name = this.title;

const collection_name = "expenses";
import editDialog from '../components/expenseEditDialog.vue'
import db from "../db.js";
import {
  collection,
  updateDoc,
  addDoc,
  deleteDoc,
  doc,
  query,
  getDocs,
  limit,
  where,
  orderBy
} from "firebase/firestore/lite";
export default {
  // 編輯表單設計一個獨立元件,可在多個頁面使用,易於維謢
  components:{editDialog},
  // props: ["title", "text"],
  props: {
    title: {
      type: String,
      default: "expenses"
    }
  },
  data() {
    return {   
      sortBy: "spend_date",
      sortDesc: true,
      editedIndex: -1,
      dialog: false,
      defaultItem: {
        note: "",
        expense: "",
        spend_date: new Date().toISOString().slice(0, 10)
      },
      editedItem: {},
      // 查詢預設當年月
      search: { y: new Date().getFullYear(), m: new Date().getMonth() + 1 },
      months: [],
      accounts: ["", "現金", "信用卡","土銀"],
      cates: ["餐費", "加油", "旅遊", "水電"],
      // 資料
      rows: [],
      headers: [
        { text: "日期", value: "spend_date", width: "70" },
        // { text: "帳戶", value: "account_name", width: "100" },

        // { text: "類別", value: "cate_name", width: "60" },

        { text: "項目", value: "note", width: "120" },
        { text: "收入", value: "income", width: "90" },
        { text: "支出", value: "expense", width: "70" }
      ],
      loading: false,
      switchColsFlag: false
      // title:'expenses'
    };
  },
  created() {
    // console.log(this.title);
    this.monthData();
    this.getDataYM();
    this.getCates();
  },
  methods: {
    // 切換欄位顯示
    switchCols() {
      let account = { text: "帳戶", value: "account_name", width: "60" };
      let cate = { text: "分類", value: "cate_name", width: "60" };
      // 加入欄位
      if (!this.switchColsFlag) {
        this.headers.splice(0, 0, cate);
        this.headers.splice(0, 0, account);
      }
      // 移除欄位
      else {
        this.headers.splice(0, 1);
        this.headers.splice(0, 1);
      }

      this.switchColsFlag = !this.switchColsFlag;

      console.log("switch");
    },
    editItem(item) {
      this.dialog = true;
      this.editedIndex = this.rows.indexOf(item);
      this.editedItem = Object.assign({}, item);
    },
    // 合計
    getTotal(arr) {
      let total = Object.keys(arr).reduce(function(previous, key) {
        return previous + arr[key].expense * 1;
      }, 0);

      // Create our number formatter.
      var formatter = new Intl.NumberFormat("en-US", {
        // style: "currency",
        currency: "USD"
      });

      total = formatter.format(total); /* $2,500.00 */

      return total;
    },
    monthData() {
      for (let i = 1; i <= 12; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        this.months.push(i);
      }
      let m = new Date().getMonth() + 1;
      if (m < 10) {
        m = "0" + m;
      }
      this.months.unshift("");
      this.search.m = m;
    },
    async save() {
      //更新
      if (this.editedIndex > -1) {
        const ref = doc(db, collection_name, this.editedItem.id);

        await updateDoc(ref, this.editedItem);

        // Object.assign(target, ...sources)
        // 將表單的值傳回表格中
        Object.assign(this.rows[this.editedIndex], this.editedItem);

        console.log(this.editedItem);
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
    async deleteItem(id, index) {
      if (!confirm("確定刪除")) return;
      await deleteDoc(doc(db, collection_name, id));
      this.rows.splice(index, 1);
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      this.dialog = false;
    },

    async getCates() {
      this.cates = [];
      const cates = collection(db, "cates");
      let q = query(cates, orderBy("prior"));
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        this.cates.push(doc.data().name);
      });
      this.cates.unshift("");
      // console.log(this.cates);
    },

    async getDataByCate() {
      this.rows = [];
      this.loading = true;
      const citiesRef = collection(db, collection_name);

      //  分類查詢
      let q = "";
      // 判斷有無輸入類別帳戶,組合不同條件
      let cate = this.search.cate_name;
      let account = this.search.account_name;
      let cateT = cate != "" && cate != undefined;
      let accountT = account != "" && account != undefined;
      // 有選類別,沒選帳戶
      if (cateT && !accountT) {
        console.log("cate");
        q = query(
          citiesRef,
          where("cate_name", "==", this.search.cate_name),
          limit(100)
        );
      }

      // 沒選類別,有選帳戶
      if (!cateT && accountT) {
        console.log("acc");
        q = query(
          citiesRef,
          where("account_name", "==", this.search.account_name)
        );
      }
      // 二者都選
      if (cateT && accountT) {
        q = query(
          citiesRef,
          where("cate_name", "==", this.search.cate_name),
          where("account_name", "==", this.search.account_name)
        );
      }

      // 二者都沒選,不做查詢
      if (!cateT && !accountT) {
        this.loading = false;
        return;
      }

      // 資料
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        this.rows.push({ ...doc.data(), id: doc.id });
      });
      this.loading = false;
    },

    async getDataYM() {
      this.rows = [];
      this.loading = true;
      // const citiesCol = collection(db, collection_name);
      const citiesCol = collection(db, this.title);
      // 依年查詢
      let q = query(
        citiesCol,
        // orderBy("expense", "desc"),
        orderBy("spend_date", "desc"),
        where("spend_date", ">=", this.search.y + "-01-01"),
        where("spend_date", "<=", this.search.y + "-12-31"),
        // where("cate_name", "==", this.search.cate_name),
        // where('expense','!=',false),
        limit(100)
      );

      if (this.search.cate_name != "" && this.search.cate_name != undefined) {
        q = query(
          citiesCol,
          orderBy("spend_date", "desc"),
          where("spend_date", ">=", this.search.y + "-01-01"),
          where("spend_date", "<=", this.search.y + "-12-31"),
          where("cate_name", "==", this.search.cate_name),
          limit(100)
        );
      }
      // 依年月查詢 (有選擇月)
      if (this.search.m != "00")
        q = query(
          citiesCol,
          orderBy("spend_date", "desc"),
          where(
            "spend_date",
            ">=",
            this.search.y + "-" + this.search.m + "-01"
          ),
          where(
            "spend_date",
            "<=",
            this.search.y + "-" + this.search.m + "-31"
          ),
          //  orderBy("expense", "desc"),
          // where('expense','!=',false),
          limit(100)
        );
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        this.rows.push({ ...doc.data(), id: doc.id });
      });
      this.loading = false;
      // console.log(this.rows);
    },

    async getDataYM2() {
      this.loading = true;
      this.rows = [];
      const queryConstraints = [];

      // 判斷有無輸入類別帳戶,組合不同條件
      let cate = this.search.cate_name;
      let account = this.search.account_name;
      let y = this.search.y;
      let m = this.search.m;
      // https://stackoverflow.com/questions/48036975/firestore-multiple-conditional-where-clauses
      // if (group != null) queryConstraints.push(where("group", "==", group));
      // if (pro != null) queryConstraints.push(where("pro", "==", pro));
      // const q = query(collection(db, "videos"), ...queryConstraints);

      const citiesRef = collection(db, collection_name);

      if (y != null) {
        queryConstraints.push(orderBy("spend_date", "desc"));
        queryConstraints.push(where("spend_date", ">=", y + "-01-01"));
        queryConstraints.push(where("spend_date", "<=", y + "-12-31"));
      }

      if (m != null && m != "") {
        // queryConstraints.push( orderBy("spend_date", "desc"))
        queryConstraints.push(
          where("spend_date", ">=", this.search.y + "-" + m + "-01")
        );

        queryConstraints.push(
          where("spend_date", "<=", this.search.y + "-" + m + "-31")
        );
      }

      if (cate != null && cate != "")
        queryConstraints.push(where("cate_name", "==", this.search.cate_name));

      if (account != null && account != "")
        queryConstraints.push(
          where("account_name", "==", this.search.account_name)
        );

      const q = query(citiesRef, ...queryConstraints);
     
      // 資料
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        this.rows.push({ ...doc.data(), id: doc.id });
      });
      this.loading = false;
    }
  }
};
</script>

<style>
</style>