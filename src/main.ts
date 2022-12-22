import { createApp } from 'vue'
import router from './example/router'
import App from './App.vue'
import { DynamicFormItemRegistry } from './lib/main'

createApp(App).use(router).mount('#app')
