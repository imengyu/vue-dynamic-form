import { RadioGroupInstance, RadioInstance } from "@arco-design/web-vue";

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
  customProps?: RadioInstance['$props'];
  /**
   * a-radio 其他自定义参数
   */
  customGroupProps?: RadioGroupInstance['$props'];
}