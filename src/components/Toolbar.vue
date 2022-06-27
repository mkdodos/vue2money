<template>
  <div>
    <v-toolbar dense>
     

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
      
      
      <v-app-bar-nav-icon v-bind="attrs" v-on="on"></v-app-bar-nav-icon>
      
          <!-- <v-btn color="primary" dark v-bind="attrs" v-on="on">Dropdown</v-btn> -->
        </template>
<!-- 下拉 -->
        <v-list>
          <v-list-item >
            <v-list-item-title>
              <v-btn to="/expense" text>支出</v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item >
            <v-list-item-title>
              <v-btn to="/cate" text>Cate</v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item >
            <v-list-item-title>
              <v-btn to="/spend" text>Spend</v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item >
            <v-list-item-title>
              <v-btn to="/spend-tab" text>SpendTab</v-btn>
            </v-list-item-title>
          </v-list-item>
           <v-list-item >
            <v-list-item-title>
              <v-btn to="/cash-in" text>Cash In</v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
       <v-btn to="/account" text>帳戶</v-btn>
       <v-btn to="/expense" text>支出</v-btn>
       <v-btn to="/expense-tab" text>支出明細</v-btn>
       <v-btn to="/expense/gas" text>加油</v-btn>
       <v-btn to="/views/balance" text>收支</v-btn>
     
       <!-- <v-btn to="/cash-in" text>Cash In</v-btn> -->
       <v-btn to="/spend" text>Spend</v-btn>
      <v-btn to="/spend-tab" text>SpendTab</v-btn>
     
    </v-toolbar>
  </div>
</template>

<script>
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyClLeHQJMt3BzbrK_AHpWeq0nlqzY2r5ik",
  authDomain: "money-39797.firebaseapp.com",
  projectId: "money-39797",
  storageBucket: "money-39797.appspot.com",
  messagingSenderId: "142963352306",
  appId: "1:142963352306:web:ac3c09e593009a5175666b",
  measurementId: "G-012VKYDZ07"
};

initializeApp(firebaseConfig);
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();
export default {
  methods: {
    // 登出
    logout() {
      console.log("log");
      signOut(auth).then(() => {
        // 轉址
        this.$router.replace("/login");
      });
    }
  }
};
</script>

<style>
</style>