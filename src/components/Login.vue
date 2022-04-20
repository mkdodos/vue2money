<template>
  <div @click="login">login</div>
</template>

<script>
import '../firebase/init';

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
let email = "mk123@gmail.com";
let password = "123456";

export default {
  methods: {
    login() {
      // firebase 登入
      signInWithEmailAndPassword(auth, email, password).then(userCredential => {        
        const user = userCredential.user; 
        console.log(user.email)       
        // 轉址
        this.$router.replace("stock-transaction");        
      });
    }
  } 
};
</script>

<style>
</style>