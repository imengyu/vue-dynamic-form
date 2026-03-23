export * from './lib';
import Default from './lib';
export default Default;

import type { 
  InputNumberProps, InputProps, TextAreaProps,
  SwitchProps, CheckboxProps, 
  SelectProps,
  DatePickerProps,
  TimePickerProps,
  TimeRangePickerProps,
  ImageProps,
  ButtonProps,
  AlertProps
} from "ant-design-vue";
import type { PasswordWithStrengthInputProps } from "./lib/components/dynamicf/PasswordWithStrengthInput.vue";
import type { CheckBoxIntProps } from "./lib/components/dynamicf/CheckBoxToInt.vue";
import type { CheckBoxValueProps } from "./lib/components/dynamicf/CheckBoxValue";
import type { CheckBoxListProps } from "./lib/components/dynamicf/CheckBoxList.vue";
import type { RadioIdFormItemProps } from "./lib/components/dynamicf/RadioId";
import type { RadioValueFormItemProps } from "./lib/components/dynamicf/RadioValue";
import type { NumberRangeProps } from "./lib/components/dynamicf/NumberRange.vue";
import type { SelectValueProps } from "./lib/components/dynamicf/SelectValue";
import type { SelectIdProps } from "./lib/components/dynamicf/Dropdown/SelectId";
import type { SelectTreeIdProps } from "./lib/components/dynamicf/Dropdown/SelectTreeId";
import type { TreeValueProps } from "./lib/components/dynamicf/TreeValue";
import type { WrapperRangePickerProps } from "./lib/components/dynamicf/WrapperRangePicker.vue";
import type { RangePickerProps } from "ant-design-vue/es/date-picker";
import type { WrapperTimeRangePickerProps } from "./lib/components/dynamicf/WrapperTimeRangePicker.vue";
import type { MapPointPickerProps } from "./lib/components/dynamicf/Map/MapPointPicker.vue";
import type { RichTextProps } from "./lib/components/dynamicf/Editor/RichText.vue";
import type { SignProps } from "./lib/components/dynamicf/Sign.vue";
import type { UploaderFormItemProps } from "./lib/components/dynamicf/UploaderFormItem";
import type { ActionRenderProps } from "./lib/components/dynamicf/ActionRender";
import type { ShowDateOrNullProps } from "./lib/components/dynamicf/Display/ShowDateOrNull.vue";
import type { ShowImageListProps } from "./lib/components/dynamicf/Display/ShowImageList.vue";
import type { ShowValueOrNullProps } from "./lib/components/dynamicf/Display/ShowValueOrNull.vue";
import type { WhiteSpaceProps } from "./lib/components/dynamicf/WhiteSpace";
import type { StateRendererProps } from "./lib/components/dynamicf/Display/StateRenderer.vue";

declare module '@imengyu/vue-dynamic-form' {
  export interface IDynamicFormWidgetPropsMap {
    'text': InputProps;
    'password': PasswordWithStrengthInputProps;
    'number': InputNumberProps;
    'textarea': TextAreaProps;
    'switch': SwitchProps;
    'check-box': CheckboxProps;
    'check-box-int': CheckBoxIntProps;
    'check-box-value': CheckBoxValueProps;
    'check-box-list': CheckBoxListProps;
    'radio-id': RadioIdFormItemProps;
    'radio-value': RadioValueFormItemProps;
    'number-range': NumberRangeProps;
    'select': SelectProps;
    'select-value': SelectValueProps;
    'select-id': SelectIdProps<any>;
    'select-tree-id': SelectTreeIdProps;
    'tree-id': TreeValueProps;
    'date': DatePickerProps;
    'date-range': WrapperRangePickerProps & RangePickerProps;
    'time': TimePickerProps;
    'time-range': WrapperTimeRangePickerProps & TimeRangePickerProps;
    'datetime': DatePickerProps;
    'datetime-range': WrapperRangePickerProps & RangePickerProps;
    'uploader': UploaderFormItemProps;
    'actions': ActionRenderProps;
    'image': ImageProps;
    'button': ButtonProps;
    'alert': AlertProps;
    'space': WhiteSpaceProps;
    'static-image': ImageProps;
    'static-state': StateRendererProps;
    'static-value': ShowValueOrNullProps;
    'static-date': ShowDateOrNullProps;
    'static-image-list': ShowImageListProps;
  };
}