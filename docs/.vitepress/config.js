/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  title: 'vue-dynamic-form',
  description: 'A data driven form component for vue3.',
  themeConfig: {
    sidebar: [
      {
        text: '教程',
        items: [
          { text: '什么是 vue-dynamic-form?', link: '/guide/index' },
          { text: '开始使用', link: '/guide/getting-started' },
          { text: '绑定组件', link: '/guide/register-controls' },
        ]
      }
    ]
  }
}

export default config