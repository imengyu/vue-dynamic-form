import type { RadioGroupProps, RadioProps } from "ant-design-vue";

export interface RadioIdOption {
  /**
   * 选项文本
   */
  text: string,
  /**
   * 选项值
   */
  value: any,
  /**
   * 其他自定义属性
   */
  [key: string]: unknown,
}

export interface RadioIdFormItemProps {
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 选项数据
   */
  loadData?: () => Promise<RadioIdOption[]>;
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