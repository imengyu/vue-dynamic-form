<script setup lang="ts">
</script>

<template>
  <main>
    <div class="side">
      <h1>Vue3 Dynamic Form</h1>
      <router-link :to="{ name: 'BasicUseage' }">Base useage</router-link>
    </div>
    <div class="demo">
      <RouterView />
    </div>
  </main>
</template>

<style lang="scss">
@import './example/assets/main.scss';
</style>
