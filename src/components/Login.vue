<template>
  <div @click="login">login</div>
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

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
let email = "mk123@gmail.com";
let password = "123456";

// const user = auth.currentUser;

export default {
  methods: {
    login() {
      // firebase 登入
      signInWithEmailAndPassword(auth, email, password).then(userCredential => {        
        const user = userCredential.user;
        console.log(user.email);
        // 轉址
        this.$router.replace("stock-transaction");
        //     // ...
      });
    }
  },
  mounted() {
    // console.log('abc')
  }
};
</script>

<style>
</style>