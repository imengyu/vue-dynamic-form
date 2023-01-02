<script setup lang="ts">
</script>

<template>
  <main>
    <div class="side">
      <h1>Vue3 Dynamic Form</h1>
      <router-link :to="{ name: 'BasicUseage' }">基础使用</router-link>
      <router-link :to="{ name: 'NestArray' }">嵌套对象与数组</router-link>
      <router-link :to="{ name: 'IngrateUI' }">与其他UI库组件使用</router-link>
      <router-link :to="{ name: 'CustomRender' }">自定义渲染条目</router-link>
      <router-link :to="{ name: 'FormLinkage' }">表单联动</router-link>
      <router-link :to="{ name: 'CustomControl' }">注册自定义组件</router-link>
    </div>
    <div class="demo">
      <RouterView />
    </div>
  </main>
</template>

<style lang="scss">
@import './example/assets/main.scss';
</style>
