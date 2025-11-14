import type { RadioGroupProps, RadioProps } from "ant-design-vue";

export interface RadioValueOption {
  text: string,
  value: unknown,
}

export interface RadioValueFormItemProps {
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 选项数据
   */
  options: RadioValueOption[];
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