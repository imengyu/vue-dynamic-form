import { markRaw } from "vue";
import { Alert, Checkbox, DatePicker, Form, FormItem, Image, Input, InputNumber, Rate, Switch, Textarea, TimePicker } from "@arco-design/web-vue";
import { DynamicFormItemRegistry, IDynamicFormOptions } from "@/lib/main";
import MyCheckBox from "./MyCheckBox.vue";

export const defaultConfig = {
  internalWidgets: {
    Form: {
      component: markRaw(Form),
      propsMap: {
        rules: 'rules',
        wrapperCol: 'wrapper-col-props',
        labelCol: 'label-col-props',
      },
    },
    FormItem: {
      component: markRaw(FormItem),
      propsMap: {
        name: 'field',
      },
    },
  },
} as IDynamicFormOptions

export function registerAllFormComponents() {
  DynamicFormItemRegistry.register('text', markRaw(Input), {}, 'modelValue');
  DynamicFormItemRegistry.register('password', markRaw(Input.Password), {}, 'modelValue');
  DynamicFormItemRegistry.register('number', markRaw(InputNumber), {}, 'modelValue');
  DynamicFormItemRegistry.register('text-area', markRaw(Textarea), {}, 'modelValue');
  DynamicFormItemRegistry.register('switch', markRaw(Switch), {}, 'modelValue');
  DynamicFormItemRegistry.register('check-box', markRaw(Checkbox), {}, 'modelValue');
  DynamicFormItemRegistry.register('rate', markRaw(Rate));
  DynamicFormItemRegistry.register('date', markRaw(DatePicker), {}, 'pickerValue');
  DynamicFormItemRegistry.register('time', markRaw(TimePicker), {}, 'modelValue');
  DynamicFormItemRegistry.register('date-time', markRaw(DatePicker), { showTime: true });
  DynamicFormItemRegistry.register('alert', markRaw(Alert));
  DynamicFormItemRegistry.register('static-image', markRaw(Image), {}, "src");

  //这是注册自己的组件
  DynamicFormItemRegistry.register('my-check', markRaw(MyCheckBox), {}, "value");
}