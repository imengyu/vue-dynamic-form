import { createApp, type Plugin } from 'vue';
import 'ant-design-vue/dist/reset.css';
import '@imengyu/vue-scroll-rect/lib/vue-scroll-rect.css'
import '../../dist/vue-dynamic-form.css';
import './assets/fonts/iconfont.css';
import './style.scss';
import App from './App.vue';
import Antd from 'ant-design-vue';
import DynamicForm from '@imengyu/vue-dynamic-form';
import VueScrollRect from '@imengyu/vue-scroll-rect';
import VueDynamicFormAnt from '@imengyu/vue-dynamic-form-ant';
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'

const app = createApp(App)

app.use(Antd)
app.use(DynamicForm as Plugin)
app.use(VueScrollRect as Plugin)
app.use(VueDynamicFormAnt as Plugin, {})
app.use(VueMonacoEditorPlugin, {
  paths: {
    // You can change the CDN config to load other versions
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.54.0/min/vs'
  },
})

app.mount('#app')
