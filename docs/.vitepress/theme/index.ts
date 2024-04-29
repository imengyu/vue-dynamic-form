import '@arco-design/web-vue/dist/arco.css';
import 'ant-design-vue/dist/reset.css';
import 'element-plus/dist/index.css'
import '../../assets/root.scss'
import DefaultTheme from 'vitepress/theme';
import { registerAllFormComponents } from '../../examples/ingrate/ArcoDesgin'

export default {
  ...DefaultTheme,
  async enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    if (!import.meta.env.SSR) {
      const plugin = await import('vue-codemirror')
      ctx.app.use(plugin.default)
      registerAllFormComponents();
    }
  }
}