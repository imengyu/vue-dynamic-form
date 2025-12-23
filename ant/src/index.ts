export * from './components/dynamicf/index';
import 'ant-design-vue/dist/reset.css';
import '@vuemap/vue-amap/dist/style.css'

import Antd from 'ant-design-vue';
import VNodeRenderer from './components/VNodeRenderer.vue';
import 'tinymce/tinymce';
import 'tinymce/themes/silver/theme';
import 'tinymce/icons/default';

import {
  StateRenderer,
  ShowDateOrNull,
  ShowImageList,
  ShowValueOrNull,
  ShowInList,
  ShowImageOrNull,
  ShowTagList,
  SelectId,
  SelectTreeId,
  IdAsValueTree,
  Sign,
  PasswordStrengthMeter,
  PasswordWithStrengthInput,
  ActionRender,
  CheckBoxToInt,
  RadioValue,
  CascaderFormItem,
  NumberRange,
  MapPointPicker,
  RichText,
  CheckBoxList,
  RadioId,
  registerAllFormComponents,
} from './components/dynamicf/index';
import type { App, Plugin } from 'vue';
import VueAMap, { initAMapApiLoader } from '@vuemap/vue-amap';
export * from './components/dynamicf/Display/ShowImageList.vue';
export * from './components/dynamicf/Display/ShowDateOrNull.vue';
export * from './components/dynamicf/Display/ShowImageOrNull.vue';
export * from './components/dynamicf/Display/ShowTagList.vue';
export * from './components/dynamicf/Display/ShowValueOrNull.vue';
export * from './components/dynamicf/Display/StateRenderer.vue';
export * from './components/dynamicf/Dropdown/SelectId';
export * from './components/dynamicf/Dropdown/SelectTreeId.vue';
export * from './components/dynamicf/Map/AddressSercher.vue';
export * from './components/dynamicf/Display/StateRenderer.vue';
export * from './components/dynamicf/PasswordWithStrengthInput.vue';
export * from './components/dynamicf/ActionRender';
export * from './components/dynamicf/CascaderFormItem';
export * from './components/dynamicf/CheckBoxValue';
export * from './components/dynamicf/CheckBoxToInt.vue';
export * from './components/dynamicf/IdAsValueTree';
export * from './components/dynamicf/RadioValue';
export * from './components/dynamicf/RadioId';
export * from './components/dynamicf/SelectValue';
export * from './components/dynamicf/Sign.vue';
export * from './components/dynamicf/UploaderFormItem';
export * from './components/dynamicf/WhiteSpace';
export * from './components/dynamicf/CheckBoxValue';
export * from './components/dynamicf/CheckBoxList.vue';

export {
  VNodeRenderer,
  StateRenderer,
  ShowDateOrNull,
  ShowImageList,
  ShowValueOrNull,
  ShowInList,
  ShowImageOrNull,
  ShowTagList,
  SelectId,
  SelectTreeId,
  IdAsValueTree,
  Sign,
  PasswordWithStrengthInput,
  PasswordStrengthMeter,
  ActionRender,
  CheckBoxToInt,
  RadioValue,
  CascaderFormItem,
  NumberRange,
  MapPointPicker,
  RichText,
  CheckBoxList,
  RadioId,
}

const plugin : Plugin<{
  aMapApiKey: string,
  aMapApiSecurityJsCode: string,
  fullAntd?: boolean,
}> = {
  install(app, options) {
    app.component('StateRenderer', StateRenderer);
    app.component('ShowDateOrNull', ShowDateOrNull);
    app.component('ShowImageList', ShowImageList);
    app.component('ShowValueOrNull', ShowValueOrNull);
    app.component('ShowInList', ShowInList);
    app.component('ShowImageOrNull', ShowImageOrNull);
    app.component('ShowTagList', ShowTagList);
    app.use(VueAMap)
    if (options)  {
      if (options.aMapApiKey && options.aMapApiSecurityJsCode) {
        initAMapApiLoader({
          key: options.aMapApiKey,
          securityJsCode: options.aMapApiSecurityJsCode,
          plugins: ['AMap.MarkerCluster'],
        })
      }
      if (options.fullAntd !== false) {
        app.use(Antd);
      }
    }
    registerAllFormComponents();
  }
}

export default plugin