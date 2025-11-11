import { markRaw } from "vue";
import { 
  Alert, Checkbox, DatePicker, Form, 
  FormItem, Image, Input, InputNumber, 
  Rate, Switch, Textarea, TimePicker
} from "ant-design-vue";
import { 
  DynamicFormItemRegistry, 
  type IDynamicFormOptions, 
  configDefaultDynamicFormOptions 
} from "@imengyu/vue-dynamic-form";
import PasswordWithStrengthInput from "./PasswordWithStrengthInput.vue";
import CheckBoxValue from "./CheckBoxValue.vue";
import SimpleSelectFormItem from "./SimpleSelectFormItem.vue";
import IdAsValueDropdown from "./Dropdown/IdAsValueDropdown.vue";
import IdAsValueTreeDropdown from "./Dropdown/IdAsValueTreeDropdown.vue";
import SelectValue from "./SelectValue.vue";
import IdAsValueTree from "./IdAsValueTree.vue";
import UploadImageFormItem from "./UploadImageFormItem.vue";
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
import SimpleEditDynamicStringListVue from "./SimpleEditDynamicStringList.vue";
import WhiteSpaceVue from "./WhiteSpace.vue";
import NumberRange from "./NumberRange.vue";
import MapPointPicker from "./Map/MapPointPicker.vue";
import EditorWrapper from "./Editor/EditorWrapper.vue";
import UploadVideoFormItem from "./UploadVideoFormItem.vue";
import AddressSercher from "./Map/AddressSercher.vue";
import Sign from "./Sign.vue";
import ShowInList from "./Display/ShowInList.vue";
import ShowImageOrNull from "./Display/ShowImageOrNull.vue";
import ShowTagList from "./Display/ShowTagList.vue";
import CheckBoxList from "./CheckBoxList.vue";

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
    .register('password', markRaw(Input), { type: "password" })
    .register('number', markRaw(InputNumber))
    .register('textarea', markRaw(Textarea))
    .register('password-with-strength', markRaw(PasswordWithStrengthInput))
    .register('switch', markRaw(Switch), {}, 'checked')
    .register('cascader', markRaw(CascaderFormItem))
    .register('check-box', markRaw(Checkbox), {}, 'checked')
    .register('check-box-int', markRaw(CheckBoxToInt))
    .register('check-box-value', markRaw(CheckBoxValue))
    .register('check-box-list', markRaw(CheckBoxList), {}, 'modelValue')
    .register('radio-value', markRaw(RadioValueVue))
    .register('number-range', markRaw(NumberRange))
    .register('rate', markRaw(Rate))

    //Select
    .register('select', markRaw(SimpleSelectFormItem))
    .register('select-value', markRaw(SelectValue))
    .register('select-id', markRaw(IdAsValueDropdown))
    .register('select-tree-id', markRaw(IdAsValueTreeDropdown))
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
    .register('richtext', markRaw(EditorWrapper), {}, 'modelValue')
    .register('sign', markRaw(Sign), {}, 'modelValue')
    //Upload
    .register('image-single', markRaw(UploadImageFormItem), { single: true })
    .register('image-mulit', markRaw(UploadImageFormItem))
    .register('video-single', markRaw(UploadVideoFormItem), { single: true })
    .register('video-mulit', markRaw(UploadVideoFormItem), { single: false })
    //Extra
    .register('actions', markRaw(ActionRender))
    .register('string-list', markRaw(SimpleEditDynamicStringListVue))
    //static
    .register('alert', markRaw(Alert))
    .register('static-image', markRaw(Image), {}, "src")
    .register('static-state', markRaw(StateRenderer))
    .register('static-value', markRaw(ShowValueOrNull))
    .register('static-date', markRaw(ShowDateOrNull))
    .register('static-image-list', markRaw(ShowImageList), {}, "images")
    .register('space', markRaw(WhiteSpaceVue))


    //OLD NAMES
    .register('textarea', markRaw(Textarea))
    .register('single-image', markRaw(UploadImageFormItem), { single: true })
    .register('mulit-image', markRaw(UploadImageFormItem))
    .register('single-video', markRaw(UploadVideoFormItem), { single: true })
    .register('mulit-video', markRaw(UploadVideoFormItem), { single: false })

}