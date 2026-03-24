import { markRaw } from "vue";
import { 
  Alert, Button, Checkbox, DatePicker, Form, 
  FormItem, Image, Input, InputNumber, 
  Rate, Select, Switch, Textarea, TimePicker
} from "@arco-design/web-vue";
import { 
  DynamicFormItemRegistry, 
  type IDynamicFormOptions, 
  configDefaultDynamicFormOptions 
} from "@imengyu/vue-dynamic-form";
import PasswordWithStrengthInput from "./PasswordWithStrengthInput.vue";
import PasswordStrengthMeter from "./PasswordStrengthMeter.vue";
import CheckBoxValue from "./CheckBoxValue.vue";
import SelectId from "./Dropdown/SelectId.vue";
import SelectTreeId from "./Dropdown/SelectTreeId.vue";
import SelectValue from "./SelectValue.vue";
import TreeValue from "./TreeValue.vue";
import UploaderFormItem from "./UploaderFormItem.vue";
import WrapperTimeRangePicker from "./WrapperTimeRangePicker.vue";
import WrapperRangePicker from "./WrapperRangePicker.vue";
import ActionRender from "./ActionRender.vue";
import CheckBoxToInt from "./CheckBoxToInt.vue";
import RadioValue from "./RadioValue.vue";
import StateRenderer from "./Display/StateRenderer.vue";
import ShowDateOrNull from "./Display/ShowDateOrNull.vue";
import ShowImageList from "./Display/ShowImageList.vue";
import ShowValueOrNull from "./Display/ShowValueOrNull.vue";
import CascaderFormItem from "./CascaderFormItem.vue";
import WhiteSpaceVue from "./WhiteSpace.vue";
import NumberRange from "./NumberRange.vue";
import ShowInList from "./Display/ShowInList.vue";
import ShowImageOrNull from "./Display/ShowImageOrNull.vue";
import ShowTagList from "./Display/ShowTagList.vue";
import CheckBoxList from "./CheckBoxList.vue";
import RadioId from "./RadioId.vue";

export {
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
    .register('text', markRaw(Input), {}, 'modelValue')
    .register('password', markRaw(PasswordWithStrengthInput))
    .register('number', markRaw(InputNumber), {}, 'modelValue')
    .register('textarea', markRaw(Textarea), {}, 'modelValue')
    .register('rate', markRaw(Rate), {}, 'modelValue')
    .register('switch', markRaw(Switch), {}, 'modelValue')
    .register('cascader', markRaw(CascaderFormItem))
    .register('check-box', markRaw(Checkbox), {}, 'modelValue')
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
    }, 'modelValue')
    .register('select-value', markRaw(SelectValue))
    .register('select-id', markRaw(SelectId))
    .register('select-tree-id', markRaw(SelectTreeId))
    .register('tree-id', markRaw(TreeValue))

    //Date
    .register('date', markRaw(DatePicker), {}, 'modelValue')
    .register('date-range', markRaw(WrapperRangePicker))
    .register('time', markRaw(TimePicker), {}, 'modelValue')
    .register('time-range', markRaw(WrapperTimeRangePicker))
    .register('datetime', markRaw(DatePicker), { showTime: true })
    .register('datetime-range', markRaw(WrapperRangePicker), { showTime: true })
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