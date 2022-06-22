<template>
  <div>
    <v-btn @click="openDialog" color="blue-grey" class="white--text">新增</v-btn>
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
  </div>
</template>

<script>
const collection_name = "expenses";
import db from "../db.js";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy
} from "firebase/firestore/lite";
export default {
  props: { rows: Array },
  data() {
    return {
      accounts: ["現金", "信用卡"],
      cates: [],
      dialog: false,
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
      editedIndex: -1
    };
  },
  mounted() {
    this.getCates();
  },
  methods: {
    openDialog() {
      this.dialog = true;
      this.editedItem = Object.assign({}, this.defaultItem);
    },
    async getCates() {
      this.cates = [];
      const cates = collection(db, "cates");
      let q = query(cates, orderBy("prior"));
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        this.cates.push(doc.data().name);
      });
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
    async deleteItem(id, index) {
      if (!confirm("確定刪除")) return;
      await deleteDoc(doc(db, collection_name, id));
      this.rows.splice(index, 1);
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      this.dialog = false;
    }
  }
};
</script>

<style>
</style>