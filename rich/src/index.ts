export * from './components/dynamicf/index';
import '@vuemap/vue-amap/dist/style.css'

import VNodeRenderer from './components/VNodeRenderer.vue';
import 'tinymce/tinymce';
import 'tinymce/themes/silver/theme';
import 'tinymce/icons/default';

import {
  Sign,
  MapPointPicker,
  RichText,
  registerAllFormComponents,
} from './components/dynamicf/index';
import type { Plugin } from 'vue';
import VueAMap, { initAMapApiLoader } from '@vuemap/vue-amap';
export * from './components/dynamicf/Map/AddressSercher.vue';
export * from './components/dynamicf/Sign.vue';

export {
  VNodeRenderer,
  Sign,
  MapPointPicker,
  RichText,
}

const plugin : Plugin<{
  aMapApiKey?: string,
  aMapApiSecurityJsCode?: string,
}> = {
  install(app, options) {
    app.use(VueAMap)
    if (options)  {
      if (options.aMapApiKey && options.aMapApiSecurityJsCode) {
        initAMapApiLoader({
          key: options.aMapApiKey,
          securityJsCode: options.aMapApiSecurityJsCode,
          plugins: ['AMap.MarkerCluster'],
        })
      }
    }
    registerAllFormComponents();
  }
}

export default plugin