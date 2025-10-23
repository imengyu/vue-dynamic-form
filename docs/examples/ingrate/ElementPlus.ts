import { markRaw } from "vue";
import { 
  ElAlert, ElCheckbox, ElDatePicker, ElForm, 
  ElFormItem, ElImage, ElInput, ElInputNumber, 
  ElRate, ElSwitch, ElTimePicker
} from "element-plus";
import { DynamicFormItemRegistry, type IDynamicFormOptions, configDefaultDynamicFormOptions } from "@imengyu/vue-dynamic-form";

export const defaultConfig = {
  internalWidgets: {
    Form: {
      component: markRaw(ElForm),
      propsMap: {
        rules: 'rules',
        //element 不支持设置wrapper宽度
        //wrapperCol: 'wrapper-col-props',
        labelCol: 'label-width',
      },
    },
    FormItem: {
      component: markRaw(ElFormItem),
      propsMap: {
        name: 'prop',
        labelCol: 'label-width',
      },
    },
  },
} as IDynamicFormOptions

export function registerAllFormComponents() {
  configDefaultDynamicFormOptions(defaultConfig);

  DynamicFormItemRegistry.register('text', markRaw(ElInput), {}, 'modelValue')
    .register('password', markRaw(ElInput), { showPassword: true }, 'modelValue')
    .register('number', markRaw(ElInputNumber), {}, 'modelValue')
    .register('text-area', markRaw(ElInput), { type: "textarea", rows: 2 }, 'modelValue')
    .register('switch', markRaw(ElSwitch), {}, 'modelValue')
    .register('check-box', markRaw(ElCheckbox), {}, 'modelValue')
    .register('rate', markRaw(ElRate))
    .register('date', markRaw(ElDatePicker), {}, 'pickerValue')
    .register('time', markRaw(ElTimePicker), {}, 'modelValue')
    .register('date-time', markRaw(ElDatePicker), { showTime: true })
    .register('alert', markRaw(ElAlert))
    .register('static-image', markRaw(ElImage), {}, "src");
}