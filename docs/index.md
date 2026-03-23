---
title: vue-dynamic-form 一个用数据驱动的 Vue3 动态表单组件。
layout: home

hero:
  name: vue-dynamic-form
  text: Vue 动态表单
  tagline: 一个用数据驱动的 Vue3 动态表单组件, 加快开发的一个小工具
  actions:
    - theme: brand
      text: 立即开始
      link: /guide/about
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/imengyu/vue-dynamic-form
features:
  - icon: 💎
    title: 简单易用
    details: 用数据来写表单，就像搭积木一样简单
  - icon: 🛠️
    title: 可拓展性强
    details: 可以与你喜欢的UI库搭配，AntDesgin、Element...
  - icon: ❤
    title: 可视化表单生成器
    details: 加快开发速度，解放双手！
---

<script setup>
import './assets/root.scss'
import DocHome from './examples/DocHome.vue';
</script>

<ClientOnly>
  <DocHome />
</ClientOnly>
