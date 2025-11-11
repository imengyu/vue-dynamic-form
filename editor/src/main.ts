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

const app = createApp(App)

app.use(Antd)
app.use(DynamicForm as Plugin)
app.use(VueScrollRect as Plugin)
app.use(VueDynamicFormAnt as Plugin, {})

app.mount('#app')
