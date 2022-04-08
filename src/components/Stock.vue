<template>
  <div>
    <!-- <ul v-for="row in rows" :key="row.id">
        <li>{{ row.name }}</li>
    </ul>-->
<v-container>
    <v-data-table :headers="headers" :items="rows">
      <template v-slot:item.name="{item}">
        <router-link :to="{name:'StockTransaction',params:{id:item.id}}">
        {{ item.name }}
        </router-link>
        
        </template>
    </v-data-table>
</v-container>
    <!-- {{$route.params.id}} -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "代碼",
          value: "id"
        },
        {
          text: "名稱",
          value: "name"
        }
      ],
      rows: [
        {
          id: "2002",
          name: "中鋼"
        },
        {
          id: "2603",
          name: "長榮"
        },
        {
          id: "2330",
          name: "台積電"
        },
        {
          id: "2412",
          name: "中華電"
        }
      ]
    };
  }
};
</script>

<style>
</style>