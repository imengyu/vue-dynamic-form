export * from './components/dynamicf/index';
import '@arco-design/web-vue/dist/arco.css';
import ArcoDesign, { type FormInstance, type FormItemInstance } from '@arco-design/web-vue';
import VNodeRenderer from './components/VNodeRenderer.vue';

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
  TreeValue,
  PasswordStrengthMeter,
  PasswordWithStrengthInput,
  ActionRender,
  CheckBoxToInt,
  RadioValue,
  CascaderFormItem,
  NumberRange,
  CheckBoxList,
  RadioId,
  registerAllFormComponents,
} from './components/dynamicf/index';
import type { Plugin } from 'vue';
import type { IDynamicFormPropsMap } from '@imengyu/vue-dynamic-form';
export * from './components/dynamicf/Display/ShowImageList.vue';
export * from './components/dynamicf/Display/ShowDateOrNull.vue';
export * from './components/dynamicf/Display/ShowImageOrNull.vue';
export * from './components/dynamicf/Display/ShowTagList.vue';
export * from './components/dynamicf/Display/ShowValueOrNull.vue';
export * from './components/dynamicf/Display/StateRenderer.vue';
export * from './components/dynamicf/Dropdown/SelectId';
export * from './components/dynamicf/Dropdown/SelectTreeId.vue';
export * from './components/dynamicf/Display/StateRenderer.vue';
export * from './components/dynamicf/PasswordWithStrengthInput.vue';
export * from './components/dynamicf/ActionRender';
export * from './components/dynamicf/CascaderFormItem';
export * from './components/dynamicf/CheckBoxValue';
export * from './components/dynamicf/CheckBoxToInt.vue';
export * from './components/dynamicf/TreeValue';
export * from './components/dynamicf/RadioValue';
export * from './components/dynamicf/RadioId';
export * from './components/dynamicf/SelectValue';
export * from './components/dynamicf/UploaderFormItem';
export * from './components/dynamicf/WhiteSpace';
export * from './components/dynamicf/CheckBoxValue';
export * from './components/dynamicf/CheckBoxList.vue';

export interface IArcoDynamicFormPropsMap extends IDynamicFormPropsMap {
  Form: Partial<Omit<FormInstance['$props'], 'model' | 'rules'>>;
  FormItem: Partial<Omit<FormItemInstance['$props'], 'rules'>>;
  FormEvents: Partial<Record<string, Function>>;
  Rules: Partial<FormInstance['$props']['rules']>;
  ItemRules: Partial<Omit<FormItemInstance['$props']['rules'], 'required'>>;
  ItemEvents: Record<string, Function>;
}

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
  TreeValue,
  PasswordWithStrengthInput,
  PasswordStrengthMeter,
  ActionRender,
  CheckBoxToInt,
  RadioValue,
  CascaderFormItem,
  NumberRange,
  CheckBoxList,
  RadioId,
}

const plugin : Plugin<{
  fullArcoDesign?: boolean,
}> = {
  install(app, options) {
    app.component('StateRenderer', StateRenderer);
    app.component('ShowDateOrNull', ShowDateOrNull);
    app.component('ShowImageList', ShowImageList);
    app.component('ShowValueOrNull', ShowValueOrNull);
    app.component('ShowInList', ShowInList);
    app.component('ShowImageOrNull', ShowImageOrNull);
    app.component('ShowTagList', ShowTagList);
    if (options)  {
      if (options.fullArcoDesign !== false) {
        app.use(ArcoDesign);
      }
    }
    registerAllFormComponents();
  }
}

export default plugin