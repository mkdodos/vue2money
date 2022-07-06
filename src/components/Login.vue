<template>
  <div>
    <v-card elevation="2" class="mx-auto my-12" max-width="374">
      <v-card-title>Cafe Badilico</v-card-title>
      <v-card-text>
        <v-alert v-if="loginFail" dense outlined type="error" dismissible>登入失敗</v-alert>
        <!-- <v-row align="center"> -->
        <!-- <v-form> -->
        <v-text-field label="帳號" v-model="email"></v-text-field>
        <v-text-field label="密碼" v-model="password" hint="6個字元以上" persistent-hint></v-text-field>
        <!-- <v-row class="mb-6"> -->
        <!-- <v-col class="text-right"> -->
        <v-btn
          color="#003554"
          class="white--text mt-2"
          :disabled="loading"
          :loading="loading"
          @click="login"
        >登入</v-btn>
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

export default {
  data() {
    return {
      email: "mkdodos@gmail.com",
      password: "123456",
      loading: false,
      errorMessages: "",
      loginFail: false
    };
  },
  methods: {
    login() {
      this.loading = true;
      // 登入後轉址
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          // console.log(userCredential)
          this.$router.replace("/");
          this.loading = false;
        })
        .catch(error => {
          this.loginFail = true;
          // 2秒後提示文字消失
          setTimeout(() => {
            this.loginFail = false;
          }, "2000");
          console.log(error);
          this.loading = false;
        });
    }
  }
};
</script>

<style>
</style>