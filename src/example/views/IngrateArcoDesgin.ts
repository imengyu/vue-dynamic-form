import { markRaw } from "vue";
import { Alert, Checkbox, DatePicker, Form, FormItem, Image, Input, InputNumber, Rate, Switch, Textarea, TimePicker } from "@arco-design/web-vue";
import { DynamicFormItemRegistry, IDynamicFormOptions } from "@/lib/main";

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
  DynamicFormItemRegistry.registerDynamicFormItemControl('text', markRaw(Input), {}, 'modelValue');
  DynamicFormItemRegistry.registerDynamicFormItemControl('password', markRaw(Input.Password), {}, 'modelValue');
  DynamicFormItemRegistry.registerDynamicFormItemControl('number', markRaw(InputNumber), {}, 'modelValue');
  DynamicFormItemRegistry.registerDynamicFormItemControl('text-area', markRaw(Textarea), {}, 'modelValue');
  DynamicFormItemRegistry.registerDynamicFormItemControl('switch', markRaw(Switch), {}, 'modelValue');
  DynamicFormItemRegistry.registerDynamicFormItemControl('check-box', markRaw(Checkbox), {}, 'modelValue');
  DynamicFormItemRegistry.registerDynamicFormItemControl('rate', markRaw(Rate));
  DynamicFormItemRegistry.registerDynamicFormItemControl('date', markRaw(DatePicker), {}, 'pickerValue');
  DynamicFormItemRegistry.registerDynamicFormItemControl('time', markRaw(TimePicker), {}, 'modelValue');
  DynamicFormItemRegistry.registerDynamicFormItemControl('date-time', markRaw(DatePicker), { showTime: true });
  DynamicFormItemRegistry.registerDynamicFormItemControl('alert', markRaw(Alert));
  DynamicFormItemRegistry.registerDynamicFormItemControl('static-image', markRaw(Image), {}, "src");
}