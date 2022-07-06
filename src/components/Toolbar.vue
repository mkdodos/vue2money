<template>
  <div>
    <v-toolbar dense >
    
      <v-btn to="/" text v-if="loggedIn">{{ user.email.slice(0,1)}}</v-btn>
      <v-btn to="/account" text>帳戶</v-btn>
      <v-btn to="/expense" text>支出</v-btn>
      <v-btn to="/expense-tab" text>支出明細</v-btn>
      <!-- <v-btn to="/expense/gas" text>加油</v-btn> -->
      <!-- <v-btn to="/views/balance" text>收支</v-btn> -->

      <v-btn icon v-if="loggedIn" @click="logout">
          <v-icon>mdi-export</v-icon>
      </v-btn>
      <v-spacer></v-spacer>    
      <!-- {{user.email}} -->

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-app-bar-nav-icon v-bind="attrs" v-on="on"></v-app-bar-nav-icon>

          <!-- <v-btn color="primary" dark v-bind="attrs" v-on="on">Dropdown</v-btn> -->
        </template>
        <!-- 下拉 -->
        <v-list>
          <v-list-item>
            <v-list-item-title>
              <v-btn to="/expense" text>支出</v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <v-btn to="/cate" text>Cate</v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
               <v-btn to="/expense/gas" text>加油</v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <v-btn to="/spend-tab" text>SpendTab</v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <v-btn to="/cash-in" text>Cash In</v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
     
     
     
      </v-menu>

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
  data() {
    return {
      user: {},
      loggedIn: false
    };
  },
  created() {
    this.setupFirebase();
    // if (auth.currentUser) {
    //   console.log(auth.currentUser.email);
    //   this.user = auth.currentUser;
    // }
  },

  computed: {},
  methods: {
    setupFirebase() {
      // 登入登出狀態有改變時,依此做一些設定(顯示登出鈕和使用者email)
      auth.onAuthStateChanged(user => {
        if (user) {
          // User is signed in.
          // console.log("signed in");
          this.loggedIn = true;
          this.user = user;
        } else {
          // No user is signed in.
          this.loggedIn = false;
          this.user = {};
          // console.log("signed out", this.loggedIn);
        }
      });
    },

    // 登出
    async logout() {
      console.log("log");
      await signOut(auth).then(() => {
        // 轉址
        this.$router.replace("/login");
      });
    }
  }
};
</script>

<style>
</style>