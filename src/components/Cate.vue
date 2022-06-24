<template>
  <div>
    <v-btn @click="openDialog" color="blue-grey" class="white--text">新增</v-btn>
    <!-- 輸入表單 -->
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
  </div>
</template>

<script>
const collection_name = "cates";

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
  // where,
  orderBy
} from "firebase/firestore/lite";

// const collection_name = "cates"
export default {
  data() {
    return {
      rows: [],
      headers: [
        {
          text: "名稱",
          value: "name"
        },
        {
          text: "順序",
          value: "prior"
        }
      ],
      // 編輯表單
      dialog: false,
      defaultItem: {},
      editedItem: {},

      editedIndex: -1
    };
  },
  created() {
    this.getData();
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
      console.log(this.editedIndex)
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
        console.log(this.editedItem.id)
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
      let q = query(cates, orderBy("prior"));
      const docSnapBig = await getDocs(q);
      docSnapBig.forEach(doc => {
        this.rows.push({...doc.data(),id:doc.id});
      });
      // this.cates.unshift("");
    }
  }
};
</script>

<style>
</style>