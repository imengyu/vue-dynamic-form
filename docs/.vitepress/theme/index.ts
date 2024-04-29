import '@arco-design/web-vue/dist/arco.css';
import 'ant-design-vue/dist/reset.css';
import 'element-plus/dist/index.css'
import 'vue-code-highlighter/dist/style.css'
import '../../assets/root.scss'
import DefaultTheme from 'vitepress/theme';
import { registerAllFormComponents } from '../../examples/ingrate/ArcoDesgin'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    registerAllFormComponents();
  },
}