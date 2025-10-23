import { markRaw } from "vue";
import { 
  Alert, Checkbox, DatePicker, Form, 
  FormItem, Image, Input, InputNumber, 
  Rate, Switch, Textarea, TimePicker
} from "ant-design-vue";
import { DynamicFormItemRegistry, type IDynamicFormOptions, configDefaultDynamicFormOptions } from "@imengyu/vue-dynamic-form";

export const defaultConfig = {
  internalWidgets: {
    Form: {
      component: markRaw(Form),
      propsMap: {
        rules: 'rules',
        wrapperCol: 'wrapperCol',
        labelCol: 'labelCol',
      },
    },
    FormItem: {
      component: markRaw(FormItem),
      propsMap: {
        name: 'name',
        wrapperCol: 'wrapperCol',
        labelCol: 'labelCol',
      },
    },
  },
} as IDynamicFormOptions

export function registerAllFormComponents() {
  configDefaultDynamicFormOptions(defaultConfig);

  DynamicFormItemRegistry.register('text', markRaw(Input), {}, 'modelValue')
    .register('password', markRaw(Input.Password), {}, 'modelValue')
    .register('number', markRaw(InputNumber), {}, 'modelValue')
    .register('text-area', markRaw(Textarea), {}, 'modelValue')
    .register('switch', markRaw(Switch), {}, 'modelValue')
    .register('check-box', markRaw(Checkbox), {}, 'modelValue')
    .register('rate', markRaw(Rate))
    .register('date', markRaw(DatePicker), {}, 'pickerValue')
    .register('time', markRaw(TimePicker), {}, 'modelValue')
    .register('date-time', markRaw(DatePicker), { showTime: true })
    .register('alert', markRaw(Alert))
    .register('static-image', markRaw(Image), {}, "src");
}