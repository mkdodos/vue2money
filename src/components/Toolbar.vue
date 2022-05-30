<template>
  <div>
    <v-toolbar dense>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <!-- <v-toolbar-title>Title</v-toolbar-title> -->

      <v-spacer></v-spacer>
      <v-btn text to="/score">Score</v-btn>
      <v-spacer></v-spacer>
      <v-btn to="/stock" text>Stock</v-btn>
      <v-spacer></v-spacer>
        <v-btn to="/spend/cate" text>SpendCate</v-btn>
      <v-spacer></v-spacer>
      <v-btn to="/spend" text>Spend</v-btn>
      <v-spacer></v-spacer>
      <v-btn to="/spend-tab" text>SpendTab</v-btn>
      <v-spacer></v-spacer>
      <v-btn :to="{name:'StockTransactionAll'}" text>
        股票交易
        <!-- <router-link :to="{name:'StockTransactionAll'}">股票交易</router-link> -->
      </v-btn>
      <!-- <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn> -->
      <v-spacer></v-spacer>
      <v-btn @click="logout">登出</v-btn>
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
/* a {
  text-decoration: none;
}
.router-link-exact-active {
 
  padding: 5px 20px;
  background-color: rgba(255, 99, 132, 0.2);
  border: 1px rgba(255, 99, 132, 1) solid;
  border-radius: 5px;
}
.router-link-active {
  color: red;
} */
</style>