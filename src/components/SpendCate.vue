<template>
  <div>
    <v-app>
      <v-container>
        <v-row>
          <v-col>
            <v-text-field v-model="search" append-icon="mdi-magnify"></v-text-field>
          </v-col>        
         
        </v-row>

        <!-- 表格 -->
        <v-row>
          <v-col>
            <v-data-table :headers="headers" :items="rows" :search="search">
              
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>

<script>
import db from "../db.js";
import {
  collection,
  getDocs, 
} from "firebase/firestore/lite";
const collection_name = "cates";
export default {
  data() {
    return {
      search: '',
      rows: [],
      headers: [       
        { text: "user", value: "user_sn", width: "100" },
        { text: "類別", value: "cate_id", width: "100" },
        { text: "cate", value: "cate_name", width: "100" },      
      ],  
    };
  },
  mounted() {
    this.getData();
   
  },
  methods: {     
    async getData() {     
      const citiesCol = collection(db, collection_name);    
    
      const docSnapBig = await getDocs(citiesCol);
      docSnapBig.forEach(doc => {
        this.rows.push({ ...doc.data(), id: doc.id });
      });
      // console.log(this.rows);
    }
  }
};
</script>

<style>
</style>