---
title: 介绍
---

<script setup>
import DynamicFormBasicUseage from '../examples/BasicUseageDoc.vue'
</script>

# 介绍

## 什么是 vue-dynamic-form?

vue-dynamic-form 是一个中后台表单组件，可以用动态数据驱动生成表单组件。
并不是开发中所必须的，它只是一个帮助你加快开发的小组件。
设计参考了 [阿里的 XRender](https://xrender.fun/form-render)。

在中后台开发中，我们经常会使用表单提交数据，表单提交数据占据开发的多半时间，
当表单特别多时，手动写表单组件是一件非常麻烦的事情。vue-dynamic-form就是为了解决这个问题而写的，
vue-dynamic-form 支持你使用 JSON 数据动态生成表单，只需要传入一个包含各种描述信息的 JSON，就能渲染出一个完整的表单。

**TODO: vue-dynamic-form 还支持你使用可视化编辑器，通过鼠标拖拉来生成表单。**

作者公司使用的中后台项目已经全部使用动态表单，省去了80%布局表单的时间，开发效率得到了不少提升（可以用更多时间摸鱼啦🤭）。现在将 vue-dynamic-form 开源，希望可以为你的开发提供便利。

::: warning
**本项目目前还处于早期发布阶段，可能会存在不少问题，如果遇到问题，欢迎在 [Github](https://github.com/imengyu/vue-dynamic-form/issues) 提出 Issue，我会尽量为你解决！**
:::

## 效果

<DynamicFormBasicUseage />

上面的效果是使用了默认的组件，功能比较简陋，仅用于测试和展示。
实际你可以在表单中嵌入使用你喜欢的 UI 组件库，例如 [Ant Design Vue](https://www.antdv.com/docs/vue/getting-started-cn)、[arco.design Vue](https://arco.design/vue/docs/start)、[Element plus](https://element-plus.gitee.io/zh-CN/guide/installation.html) 等等，嵌入其他UI组件库的最终效果你可以[查看这里](ingrate-ui.md)。

## 开始之前

文档中所示案例，你都可在 [Github 仓库](https://github.com/imengyu/vue-dynamic-form/tree/master/src/example/views) 中找到完整的源代码。

作者开发不易，如果这个项目对您有帮助，希望你可以去 [Github](https://github.com/imengyu/vue-dynamic-form) 或者 [Gitee](https://gitee.com/imengyu/vue-dynamic-form) 帮我点个 ⭐ ，这将是对我极大的鼓励。谢谢啦 (●'◡'●)

如果你准备好了，那我们就开始吧~

[👉 立即开始](./getting-started.md)
