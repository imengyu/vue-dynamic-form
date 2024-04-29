import { markRaw } from "vue";
import { 
  Alert, Checkbox, DatePicker, Form, FormItem, Button,
  Image, Input, InputNumber, Rate, Switch, Textarea, TimePicker, 
  Tabs,
  TabPane,
  Select
} from "@arco-design/web-vue";
import { DynamicFormItemRegistry, IDynamicFormOptions, configDefaultDynamicFormOptions } from "@imengyu/vue-dynamic-form";
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
    Tab: {
      component: markRaw(Tabs),
      propsMap: {
        activeKey: 'activeKey',
        defaultActiveKey: 'defaultActiveKey',
      },
    },
    TabPage: {
      component: markRaw(TabPane),
      propsMap: {
        title: 'title',
        disabled: 'disabled',
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
    .register('select', markRaw(Select), {}, 'modelValue')
    .register('switch', markRaw(Switch), {}, 'modelValue')
    .register('check-box', markRaw(Checkbox), {}, 'modelValue')
    .register('rate', markRaw(Rate))
    .register('date', markRaw(DatePicker), {}, 'pickerValue')
    .register('time', markRaw(TimePicker), {}, 'modelValue')
    .register('date-time', markRaw(DatePicker), { showTime: true })
    .register('alert', markRaw(Alert))
    .register('static-image', markRaw(Image), {}, "src")
    .register('button', markRaw(Button), {}, 'text');

  //这是注册自己的自定义组件
  DynamicFormItemRegistry.register('my-check', markRaw(MyCheckBox), {}, "value");
}