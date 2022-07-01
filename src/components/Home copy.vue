

<template>
<div>
   <h1>Home
    {{ user }}
    </h1>  
    <div v-if="!user">abc</div>
</div>
 
</template>

<script>
export default {
  data() {
    return {
      user: null
    }
  },
  created() {
    this.user = localStorage.getItem('email')
  }
}
</script>

<style>

</style>