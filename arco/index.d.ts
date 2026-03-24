export * from './lib';
import Default from './lib';
export default Default;

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
import type { WrapperTimeRangePickerProps } from "./lib/components/dynamicf/WrapperTimeRangePicker.vue";
import type { UploaderFormItemProps } from "./lib/components/dynamicf/UploaderFormItem";
import type { ActionRenderProps } from "./lib/components/dynamicf/ActionRender";
import type { ShowDateOrNullProps } from "./lib/components/dynamicf/Display/ShowDateOrNull.vue";
import type { ShowImageListProps } from "./lib/components/dynamicf/Display/ShowImageList.vue";
import type { ShowValueOrNullProps } from "./lib/components/dynamicf/Display/ShowValueOrNull.vue";
import type { WhiteSpaceProps } from "./lib/components/dynamicf/WhiteSpace";
import type { StateRendererProps } from "./lib/components/dynamicf/Display/StateRenderer.vue";
import type { 
  InputInstance, InputNumberInstance, TextareaInstance, 
  SwitchInstance, CheckboxInstance,
  ButtonProps,
  DatePickerInstance,
  RangePickerInstance,
  SelectInstance,
  ImageInstance,
  AlertInstance,
  TimePickerInstance,
  FormInstance,
  FormItemInstance,
} from '@arco-design/web-vue';
import { RangePickerProps } from 'ant-design-vue/es/date-picker';

export interface IArcoDynamicFormPropsMap {
  Form: FormInstance['$props'];
  FormItem: FormItemInstance['$props'];
  FormEvents: Record<string, Function>;
  Rules: FormInstance['$props']['rules'];
  ItemRules: FormItemInstance['$props']['rules'];
  ItemEvents: Record<string, Function>;
}

declare module '@imengyu/vue-dynamic-form' {
  export interface IDynamicFormWidgetPropsMap {
    'text': InputInstance['$props'];
    'password': PasswordWithStrengthInputProps;
    'number': InputNumberInstance['$props'];
    'textarea': TextareaInstance['$props'];
    'switch': SwitchInstance['$props'];
    'check-box': CheckboxInstance['$props'];
    'check-box-int': CheckBoxIntProps;
    'check-box-value': CheckBoxValueProps;
    'check-box-list': CheckBoxListProps;
    'radio-id': RadioIdFormItemProps;
    'radio-value': RadioValueFormItemProps;
    'number-range': NumberRangeProps;
    'select': SelectInstance['$props'];
    'select-value': SelectValueProps;
    'select-id': SelectIdProps<any>;
    'select-tree-id': SelectTreeIdProps;
    'tree-id': TreeValueProps;
    'date': DatePickerInstance['$props'];
    'date-range': WrapperRangePickerProps & RangePickerInstance['$props'];
    'time': TimePickerInstance['$props'];
    'time-range': WrapperTimeRangePickerProps & Omit<RangePickerInstance['$props'], 'showTime'>;
    'datetime': DatePickerInstance['$props'];
    'datetime-range': WrapperRangePickerProps & RangePickerProps;
    'uploader': UploaderFormItemProps;
    'actions': ActionRenderProps;
    'image': ImageInstance['$props'];
    'button': ButtonProps;
    'alert': AlertInstance['$props'];
    'space': WhiteSpaceProps;
    'static-image': ImageInstance['$props'];
    'static-state': StateRendererProps;
    'static-value': ShowValueOrNullProps;
    'static-date': ShowDateOrNullProps;
    'static-image-list': ShowImageListProps;
  }
}