<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'
import FormEditor from './components/FormEditor.vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
</script>

<template>
  <ConfigProvider :locale="zhCN">
    <FormEditor />
  </ConfigProvider>
</template>

<style>
</style>
