
export interface IDynamicFormItemSelectOption {
  /**
   * 选项显示文本
   */
  text: string,
  /**
   * 选项值
   */
  value: string|number,
  /**
   * 选项额外数据
   */
  [key: string]: unknown;
}

export interface BaseSelectProps {
  /**
   * 是否禁用
   */
  disabled: boolean;
  /**
   * 选项数据
   */
  options: IDynamicFormItemSelectOption[];
  /**
   * 选择值
   */
  value: unknown;
}