<template>
  <v-app>
    <Toolbar />

    <v-main>
      <v-container>
        <router-view name="nav"></router-view>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// import { getAuth } from "firebase/auth";
// import HelloWorld from './components/HelloWorld';
import Toolbar from "./components/Toolbar";
// import BarChart from './components/BarChart'
export default {
  name: "App",

  components: {
    Toolbar
    // BarChart
  },

  // data() {
  //   return {
  //     user: null
  //   };
  // },
   created() {
    //  this.$store.dispatch('user',localStorage.getItem("email"))
    // const auth =  getAuth();
    // this.user = auth.currentUser.email;
    // console.log(this.user)
    // this.user = localStorage.getItem("email");
  }

  // data: () => ({

  // })
};
</script>
