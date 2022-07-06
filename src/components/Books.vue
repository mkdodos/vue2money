<template>
  <div>
    <v-container>
      <v-data-table :items="books" :headers="headers" mobile-breakpoint="300"></v-data-table>
    </v-container>
  </div>
</template>

<script>
// import books from '../fixtures/items.json'
import books from "../fixtures/data.json";
export default {
  data() {
    return {
      books: books,
      headers: [
        { text: "日期", value: "spend_date" },
        { text: "項目", value: "note" },
        { text: "支出", value: "expense" }
      ]
    };
  }
};
</script>

<style>
</style>