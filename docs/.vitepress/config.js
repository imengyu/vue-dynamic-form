/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  title: 'vue-dynamic-form',
  description: 'A data driven form component for vue3.',
  base: '/pages/vue-dynamic-form-docs/',
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/imengyu/vue-dynamic-form' },
    ],
    nav: [
      { text: '教程', link: '/guide/about' },
      { text: 'API 参考', link: '/api/' },
      { text: '更新日志', link: 'https://github.com/imengyu/vue-dynamic-form/CHANGELOG.md' }
    ],
    sidebar: [
      {
        text: '起步',
        items: [
          { text: '什么是 vue-dynamic-form?', link: '/guide/about' },
          { text: '开始使用', link: '/guide/getting-started' },
        ]
      },
      {
        text: '高级用法',
        items: [
          { text: '绑定组件', link: '/guide/register-controls' },
          { text: '自定义组件', link: '/guide/custom-control' },
          { text: '表单联动', link: '/guide/form-linkage' },
          { text: '表单方法', link: '/guide/form-funs' },
          { text: '表单嵌套', link: '/guide/form-nest' },
        ]
      },
    ]
  }
}

export default config