import { defineConfig } from "vitepress";
import MarkdownPreview from 'vite-plugin-markdown-preview'

export default defineConfig({
  title: 'vue-dynamic-form',
  description: 'A data driven form component for vue3.',
  base: '/vue-dynamic-form-docs/',
  themeConfig: {
    socialLinks: [
      { 
        icon: {
          svg: '<svg role="img" viewBox="0 0 1024 1024"><path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z"/></svg>'
        },
        link: 'https://gitee.com/imengyu/vue-dynamic-form'
      },
      { icon: 'github', link: 'https://github.com/imengyu/vue-dynamic-form' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 imengyu.top'
    },
    nav: [
      { text: '教程', link: '/guide/about' },
      { text: 'API 参考', link: '/api/global' },
      { text: '更新日志', link: 'https://github.com/imengyu/vue-dynamic-form/blob/master/CHANGELOG.md' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '起步',
          items: [
            { text: '介绍', link: '/guide/about' },
            { text: '开始使用', link: '/guide/getting-started' },
            { text: '绑定组件', link: '/guide/register-controls', items: [
              { text: 'Ant Design Vue', link: '/guide/ingrate-ant-design' },
              { text: 'Arco Design Vue', link: '/guide/ingrate-arco-design' },
              { text: 'Element Plus', link: '/guide/ingrate-element' },
            ] },
            
            { text: '基础用法', link: '/guide/basic-useage' },
          ]
        },
        {
          text: '高级用法',
          items: [
            { text: '自定义渲染', link: '/guide/custom-render' },
            { text: '自定义组件', link: '/guide/custom-control' },
            { text: '表单联动', link: '/guide/form-linkage' },
            { text: '表单方法', link: '/guide/form-funs' },
            { text: '表单嵌套', link: '/guide/form-nest' },
            { text: '表单标签页', link: '/guide/tab' },
            { text: '错误提示与处理', link: '/guide/error-catch' },
          ]
        },
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '全局函数', link: '/api/global' },
            { text: 'DynamicForm', link: '/api/DynamicForm' },
            { text: 'DynamicFormOptions', link: '/api/DynamicFormOptions' },
            { text: '内置Form', link: '/api/internal-form' },
            { text: '内置组件', link: '/api/internal-controls' },
          ]
        },
      ]
    }
  },
  vite: {
    plugins: [ MarkdownPreview() as any ],
  },
});