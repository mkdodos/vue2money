<template>
  <div>
    <v-btn @click="openDialog" color="blue-grey" class="white--text">新增</v-btn>
    <!-- 編輯表單 -->
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 lighten-2">編輯</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field label="分類" v-model="editedItem.name"></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="順序" v-model="editedItem.prior" hide-details="auto"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="user id" v-model="editedItem.user_id"></v-text-field>
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

    <v-data-table :items="rows" @click:row="editItem" mobile-breakpoint="360" :headers="headers"></v-data-table>
    <v-data-table :items="rowsBalance" mobile-breakpoint="360" :headers="headersBalance"></v-data-table>
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
  where
  // orderBy
} from "firebase/firestore/lite";

import { getAuth } from "firebase/auth";

const collection_name = "accounts";
export default {
  data() {
    return {
      // 帳戶
      rows: [],
      // 帳戶餘額
      rowsBalance: [],
      headers: [
        {
          text: "名稱",
          value: "name"
        },
        {
          text: "順序",
          value: "prior"
        },
        {
          text: "User",
          value: "user_id"
        }
      ],
      headersBalance: [
        {
          text: "名稱",
          value: "name"
        },
        {
          text: "餘額",
          value: "total"
        }
      ],
      // 編輯表單
      dialog: false,
      defaultItem: {},
      editedItem: {},

      editedIndex: -1
    };
  },
  mounted() {
    this.getData();
    this.getBalance();
  },
  methods: {
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
      console.log(this.editedIndex);
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
        console.log(this.editedItem.id);
        const ref = doc(db, collection_name, this.editedItem.id);
        const auth = getAuth();
        const user = auth.currentUser;
        this.editedItem.user_id = user.uid;
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

        const docRef = await addDoc(
          collection(db, collection_name),
          this.editedItem
        );

        // 設定新增後取得的 id, 才可馬上做編輯
        this.editedItem.id = docRef.id;
        // 將項目加入到資料列
        this.rows.unshift(this.editedItem);
        // console.log(this.rows);
      }

      this.dialog = false;
    },
    async getData() {
      this.rows = [];
      const cates = collection(db, collection_name);
      
      // let q = query(cates, where('user_id','==','2'));
      const auth = getAuth();
      const user = auth.currentUser;
      let q = query(cates, where("user_id", "==", user.uid));
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        this.rows.push({ ...doc.data(), id: doc.id });
      });
      // this.rowsBalance = [];
      // const expenses = collection(db, 'expenses');
      // let q = query(expenses, orderBy("prior"));
      // this.rows.forEach(row => {

      // });
      // console.log(this.rowsBalance);
      // console.log(this.rows);

      // this.cates.unshift("");
    },

    // 帳戶餘額
    async getBalance() {
      this.rowsBalance = [];
      const expenses = collection(db, "expenses");
      // let q = query(expenses, orderBy("prior"));
      // this.rows.forEach(row => {
      // console.log(row);
      // let q = query(expenses, where("account_name", "==", "玉山"));
      // await 不能放在 forEach 中, 改為全部資料取回再用 filter
      const docSnapBig = await getDocs(expenses);

      // let totalIncome = 0;
      // let totalExpense = 0;
      let accountData = [];
      docSnapBig.forEach(doc => {
        // if (doc.data().income) totalIncome += doc.data().income * 1;
        // if (doc.data().expense) totalExpense += doc.data().expense * 1;
        accountData.push({ ...doc.data() });
      });
      console.log(accountData);
      this.rows.forEach(acc => {
        let u3 = accountData.filter(row => row.account_name == acc.name);
        // 收入
        let arrIncome = u3.filter(
          row => row.income != "" && row.income != null
        );
        let arrExpense = u3.filter(
          row => row.expense != "" && row.expense != null
        );
        // let arrExpense = u3.filter(row=>row.expense!=null)
        let totalIncome = 0;
        let totalExpense = 0;
        arrIncome.forEach(row => {
          totalIncome += row.income * 1;
        });

        arrExpense.forEach(row => {
          totalExpense += row.expense * 1;
        });

        // console.log(totalIncome);
        this.rowsBalance.push({
          name: acc.name,
          total: totalIncome - totalExpense
        });
        // console.log(expense);
      });

      // });
      // this.rows.forEach(row => {
      //   console.log(row.name);
      // });

      console.log(this.rowsBalance);
      // console.log(totalIncome-totalExpense)
      // console.log(totalExpense)
      // this.cates.unshift("");
    }
  }
};
</script>

<style>
</style>