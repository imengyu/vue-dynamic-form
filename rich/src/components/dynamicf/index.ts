import { markRaw } from "vue";
import { 
  Alert, Button, Checkbox, DatePicker, Form, 
  FormItem, Image, Input, InputNumber, 
  Rate, Select, Switch, Textarea, TimePicker
} from "ant-design-vue";
import { 
  DynamicFormItemRegistry, 
  type IDynamicFormOptions, 
  configDefaultDynamicFormOptions 
} from "@imengyu/vue-dynamic-form";
import MapPointPicker from "./Map/MapPointPicker.vue";
import RichText from "./Editor/RichText.vue";
import Sign from "./Sign.vue";

export {
  Sign,
  MapPointPicker,
  RichText,
}

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

  DynamicFormItemRegistry

    //Basic
    .register('text', markRaw(Input))
    .register('password', markRaw(PasswordWithStrengthInput))
    .register('number', markRaw(InputNumber))
    .register('textarea', markRaw(Textarea))
    .register('rate', markRaw(Rate))
    .register('switch', markRaw(Switch), {}, 'checked')
    .register('cascader', markRaw(CascaderFormItem))
    .register('check-box', markRaw(Checkbox), {}, 'checked')
    .register('check-box-int', markRaw(CheckBoxToInt))
    .register('check-box-value', markRaw(CheckBoxValue))
    .register('check-box-list', markRaw(CheckBoxList), {}, 'modelValue')
    .register('radio-id', markRaw(RadioId))
    .register('radio-value', markRaw(RadioValue))
    .register('number-range', markRaw(NumberRange))

    //Select
    .register('select', markRaw(Select), {
      fieldNames: {
        label: 'text',
        value: 'value',
        options: 'options',
      }
    })
    .register('select-value', markRaw(SelectValue))
    .register('select-id', markRaw(SelectId))
    .register('select-tree-id', markRaw(SelectTreeId))
    .register('tree-id', markRaw(TreeValue))

    //Date
    .register('date', markRaw(DatePicker))
    .register('date-range', markRaw(WrapperRangePicker))
    .register('time', markRaw(TimePicker))
    .register('time-range', markRaw(WrapperTimeRangePicker))
    .register('datetime', markRaw(DatePicker), { showTime: true })
    .register('datetime-range', markRaw(WrapperRangePicker), { showTime: true })
    
    //Map
    .register('select-lonlat', markRaw(MapPointPicker), {}, 'modelValue')
    //Editor
    .register('richtext', markRaw(RichText), {}, 'modelValue')
    .register('sign', markRaw(Sign), {}, 'modelValue')
    //Upload
    .register('uploader', markRaw(UploaderFormItem), {}, 'modelValue')
    //Extra
    .register('actions', markRaw(ActionRender))
    .register('image', markRaw(Image), {}, "src")
    .register('button', markRaw(Button))
    .register('alert', markRaw(Alert))
    //Display
    .register('space', markRaw(WhiteSpaceVue))
    //Static
    .register('static-image', markRaw(Image), {}, "src")
    .register('static-state', markRaw(StateRenderer))
    .register('static-value', markRaw(ShowValueOrNull))
    .register('static-date', markRaw(ShowDateOrNull))
    .register('static-image-list', markRaw(ShowImageList), {}, "images")
}