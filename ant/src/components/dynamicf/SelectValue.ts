import type { SelectProps } from "ant-design-vue";

export interface SelectValueOption {
  text: string,
  value: unknown,
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