---
title: 开始使用
---

# 开始使用

## 安装

安装 vue-dynamic-form 核心

```shell
# npm 
npm i @imengyu/vue-dynamic-form

# or yarn
yarn add @imengyu/vue-dynamic-form
```

## 绑定组件

因为 vue-dynamic-form，不与任何UI库耦合，内部只有几个基础组件（用于测试），不带复杂的表单组件，
所以若要搭建一个生产应用，推荐你使用现有的成熟的组件库，vue-dynamic-form 只作为动态生成器来使用，调用你的组件库。

您可以选择安装自己喜欢的UI框架或其他库。推荐：

* [Ant Design Vue](https://www.antdv.com/docs/vue/getting-started-cn)
* [arco.design Vue](https://arco.design/vue/docs/start)
* [Element plus](https://element-plus.gitee.io/zh-CN/guide/installation.html)

或者你也可以调用你自己的组件库，只需要注册即可。

接下来你需要绑定表单组件，将其注册，请参考 [👉 绑定组件](./register-controls.md)。
