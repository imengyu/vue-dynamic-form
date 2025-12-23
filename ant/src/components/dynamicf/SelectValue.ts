import type { SelectProps } from "ant-design-vue";

export interface SelectValueOption {
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

export interface SelectValueFormItemProps {
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 选项数据
   */
  options: SelectValueOption[];
  /**
   * 选择值
   */
  value?: unknown;
  /**
   * a-select 其他自定义参数
   */
  customProps?: SelectProps;
}