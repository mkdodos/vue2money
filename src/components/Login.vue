<template>
  <div>
    <v-card elevation="2" class="mx-auto my-12" max-width="374">
      <v-card-title>Cafe Badilico</v-card-title>
      <v-card-text>
        <!-- <v-row align="center"> -->
        <!-- <v-form> -->
        <v-text-field label="帳號" v-model="email"></v-text-field>
        <v-text-field label="密碼" v-model="password"></v-text-field>
        <!-- <v-row class="mb-6"> -->
        <!-- <v-col class="text-right"> -->
        <v-btn color="#003554" class="white--text" @click="login">登入</v-btn>
        <!-- </v-col> -->
        <!-- </v-row> -->
        <!-- </v-form> -->
        <!-- </v-row> -->
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import "../firebase/init";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
// let email = "mk123@gmail.com";
// let password = "123456";

export default {
  data() {
    return {
      email: "mk123@gmail.com",
      password: "123456"
    };
  },
  methods: {
    login() {
      // firebase 登入
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(userCredential => {
          // 轉址
          // this.$router.push('/');
          // if(userCredential){

            
          const user = userCredential.user;
          
          // 記錄使用者 ID
          // localStorage.setItem('token', user.uid)
          console.log(user.uid);
          this.$router.push("stock-transaction");
          //  }

          // else
          // alert('error')
          // this.$router.replace("stock-transaction");
        })
        .catch(error => {
          // const errorCode = error.code;
          // const errorMessage = error.message;
          alert(error.message)
        });
    }
  }
};
</script>

<style>
</style>