<template>
  <div>
    <v-row class="mb-6">
      <v-col>
        <v-btn color="cyan" class="white--text" @click="openDialog">新增</v-btn>
      </v-col>
    </v-row>

    <!-- 輸入表單 -->
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 lighten-2">編輯</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="日期" v-model="editedItem.spend_date" type="date"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="項目" v-model="editedItem.note" hide-details="auto"></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field label="金額" v-model="editedItem.expense" type="number"></v-text-field>
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
    <v-text-field label="查詢" v-model="search" append-icon="mdi-magnify"></v-text-field>

    <!-- 表格 -->
    <v-data-table
      mobile-breakpoint="360"
      :loading="loading"
      :headers="headers"
      :items="rows"
      :search="search"
    >
      <template v-slot:item.spend_date="{ item }">{{ item.spend_date.slice(5,10) }}</template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      </template>
    </v-data-table>
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
} from "firebase/firestore/lite";

const collection_name = "spends";
export default {
  data() {
    return {
      rows: [],
      headers: [
        { text: "日期", value: "spend_date", width: "90" },
        // { text: "類別", value: "cate", width: "100" },
        { text: "項目", value: "note", width: "110" },
        // { text: "收入", value: "income" },
        { text: "支出", value: "expense", width: "90" },
        // { text: "備註", value: "note_html" },
        { text: "", value: "actions" }
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
      editedIndex: -1
    };
  },
  mounted() {
    this.getMoney();
  },
  methods: {
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
          note: this.editedItem.note,
          expense: this.editedItem.expense
        });

        // 設定新增後取得的 id, 才可馬上做編輯
        this.editedItem.id = docRef.id;
        // 將項目加入到資料列
        this.rows.unshift(this.editedItem);
        console.log(this.rows);
      }

      this.dialog = false;
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