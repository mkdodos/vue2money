<template>
  <v-app>
    
    
      <Toolbar />
   

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import Toolbar from "./components/Toolbar";
export default {
  name: "App",

  components: {
    Toolbar
  },

  data: () => ({
    //
  })
};
</script>
