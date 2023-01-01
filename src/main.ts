import { createApp } from 'vue'
import router from './example/router'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import { registerAllFormComponents } from './example/views/IngrateArcoDesgin'



createApp(App)
  .use(router)
  .use(ArcoVue)
  .mount('#app')
  .$nextTick(() => {
    registerAllFormComponents();
  });
