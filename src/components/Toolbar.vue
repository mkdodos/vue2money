<template>
  <div>
    <v-toolbar dense>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Title</v-toolbar-title>

      <v-spacer></v-spacer>

      <router-link to="/stock">stock</router-link>
      <v-spacer></v-spacer>
      <router-link to="/spend">spend</router-link>
      <v-spacer></v-spacer>
      <router-link :to="{name:'StockTransactionAll'}">股票交易</router-link>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

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
</style>