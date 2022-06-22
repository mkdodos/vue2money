<template>
  <div>
    收支
    <v-row>
      <v-col><expense /></v-col>
      <v-col> <income /></v-col>
    </v-row>

    
   
  </div>
</template>

<script>
import expense from "../components/money/expense";
import income from "../components/money/income";
export default {
  components: {
    expense,
    income
  }
};
</script>

<style>
</style>