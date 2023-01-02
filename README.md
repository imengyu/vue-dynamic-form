# vue-dynamic-form

A data driven form component for vue3.

vue-dynamic-form 一个用数据驱动的 Vue3 动态表单组件。

## 文档

[查看文档](https://imengyu.top/pages/vue-dynamic-form-docs)。

## 安装

```shell
# npm 
npm i @imengyu/vue-dynamic-form

# or yarn
yarn add @imengyu/vue-dynamic-form
```

## 简介

设计参考了 [阿里的 XRender](https://xrender.fun/form-render)。

在中后台开发中，我们经常会使用表单提交数据，表单提交数据占据开发的多半时间，
当表单特别多时，手动写表单组件是一件非常麻烦的事情。vue-dynamic-form就是为了解决这个问题而写的，
vue-dynamic-form 支持你使用 JSON 数据动态生成表单，只需要传入一个包含各种描述信息的 JSON，就能渲染出一个完整的表单。

vue-dynamic-form 并不是开发中所必须的，它只是一个帮助你加快开发的小组件。

作者公司使用的中后台项目已经全部使用动态表单，省去了80%布局表单的时间，开发效率得到了不少提升（可以用更多时间摸鱼啦🤭）。现在将 vue-dynamic-form 开源，希望可以为你的开发提供便利。

> **本项目目前还处于早期发布阶段，可能会存在不少问题，如果遇到问题，欢迎在 [Github](https://github.com/imengyu/vue-dynamic-form/issues) 提出 Issue，我会尽量为你解决！**

下面是动态表单的优劣：

优点

* 省去了手动布局表单组件（加快开发速度，减少代码体积）。
* 比起手动布局组件结构清晰 (数据结构即表单结构)。
* 动态使用数据驱动，这意味着可以由后端动态下发配置实现表单的动态控制。
* 动态使用数据驱动，这意味着可以接入任何表单设计器。

缺点

* 写法可能不是特别直观，需要适应。
* 可能需要自己封装组件或者使用其他人的组件。
* 需要牺牲一些高度自定义的写法。
