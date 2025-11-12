import { markRaw } from "vue";
import { 
  Alert, Checkbox, DatePicker, Form, 
  FormItem, Image, Input, InputNumber, 
  Rate, Select, Switch, Textarea, TimePicker
} from "ant-design-vue";
import { 
  DynamicFormItemRegistry, 
  type IDynamicFormOptions, 
  configDefaultDynamicFormOptions 
} from "@imengyu/vue-dynamic-form";
import PasswordWithStrengthInput from "./PasswordWithStrengthInput.vue";
import CheckBoxValue from "./CheckBoxValue.vue";
import SelectId from "./Dropdown/SelectId.vue";
import SelectTreeId from "./Dropdown/SelectTreeId.vue";
import SelectValue from "./SelectValue.vue";
import IdAsValueTree from "./IdAsValueTree.vue";
import UploaderFormItem from "./UploaderFormItem.vue";
import WrapperTimeRangePicker from "./WrapperTimeRangePicker.vue";
import WrapperRangePicker from "./WrapperRangePicker.vue";
import ActionRender from "./ActionRender.vue";
import CheckBoxToInt from "./CheckBoxToInt.vue";
import RadioValueVue from "./RadioValue.vue";
import StateRenderer from "./Display/StateRenderer.vue";
import ShowDateOrNull from "./Display/ShowDateOrNull.vue";
import ShowImageList from "./Display/ShowImageList.vue";
import ShowValueOrNull from "./Display/ShowValueOrNull.vue";
import CascaderFormItem from "./CascaderFormItem.vue";
import WhiteSpaceVue from "./WhiteSpace.vue";
import NumberRange from "./NumberRange.vue";
import MapPointPicker from "./Map/MapPointPicker.vue";
import RichText from "./Editor/RichText.vue";
import AddressSercher from "./Map/AddressSercher.vue";
import Sign from "./Sign.vue";
import ShowInList from "./Display/ShowInList.vue";
import ShowImageOrNull from "./Display/ShowImageOrNull.vue";
import ShowTagList from "./Display/ShowTagList.vue";
import CheckBoxList from "./CheckBoxList.vue";
import RadioIdVue from "./RadioId.vue";

export {
  StateRenderer,
  ShowDateOrNull,
  ShowImageList,
  ShowValueOrNull,
  ShowInList,
  ShowImageOrNull,
  ShowTagList,
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
    .register('radio-id', markRaw(RadioIdVue))
    .register('radio-value', markRaw(RadioValueVue))
    .register('number-range', markRaw(NumberRange))

    //Select
    .register('select', markRaw(Select))
    .register('select-value', markRaw(SelectValue))
    .register('select-id', markRaw(SelectId))
    .register('select-tree-id', markRaw(SelectTreeId))
    .register('tree-id', markRaw(IdAsValueTree))

    //Date
    .register('date', markRaw(DatePicker))
    .register('time', markRaw(TimePicker))
    .register('date-time', markRaw(DatePicker), { showTime: true })
    .register('date-range', markRaw(WrapperRangePicker))
    .register('time-range', markRaw(WrapperTimeRangePicker))
    .register('date-time-range', markRaw(WrapperRangePicker), { showTime: true })
    
    //Map
    .register('map-pick-point', markRaw(MapPointPicker), {}, 'modelValue')
    .register('address-sercher', markRaw(AddressSercher), {}, 'modelValue')
    //Editor
    .register('richtext', markRaw(RichText), {}, 'modelValue')
    .register('sign', markRaw(Sign), {}, 'modelValue')
    //Upload
    .register('uploader', markRaw(UploaderFormItem), {}, 'modelValue')
    //Extra
    .register('actions', markRaw(ActionRender))
    //Display
    .register('alert', markRaw(Alert))
    .register('space', markRaw(WhiteSpaceVue))
    //Static
    .register('static-image', markRaw(Image), {}, "src")
    .register('static-state', markRaw(StateRenderer))
    .register('static-value', markRaw(ShowValueOrNull))
    .register('static-date', markRaw(ShowDateOrNull))
    .register('static-image-list', markRaw(ShowImageList), {}, "images")
}