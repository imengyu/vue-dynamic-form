<script setup lang="ts">
</script>

<template>
  <main>
    <div class="side">
      <h1>Vue3 Dynamic Form</h1>
      <router-link :to="{ name: 'BasicUseage' }">基础使用</router-link>
      <router-link :to="{ name: 'NestArray' }">嵌套对象与数组</router-link>
    </div>
    <div class="demo">
      <RouterView />
    </div>
  </main>
</template>

<style lang="scss">
@import './example/assets/main.scss';
</style>
