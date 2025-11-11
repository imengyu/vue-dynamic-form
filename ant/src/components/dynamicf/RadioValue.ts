import type { RadioGroupProps, RadioProps } from "ant-design-vue";

export interface IDynamicFormItemRadioValueOption {
  label: string,
  value: unknown,
}

export interface SimpleRadioValueFormItemProps {
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 选项数据
   */
  options: IDynamicFormItemRadioValueOption[];
  /**
   * 选择值
   */
  value?: unknown;
  /**
   * a-radio 其他自定义参数
   */
  customProps?: RadioProps;
  /**
   * a-radio 其他自定义参数
   */
  customGroupProps?: RadioGroupProps;
}