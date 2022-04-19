<template>
  <div>
    <v-toolbar dense>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Title</v-toolbar-title>

      <v-spacer></v-spacer>

      <router-link to="/stock">stock</router-link>
       <v-spacer></v-spacer>
      <router-link :to="{name:'StockTransactionAll'}">股票交易</router-link>

      <v-btn icon>
       
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>