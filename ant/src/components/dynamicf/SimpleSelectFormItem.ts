import type { SelectProps } from "ant-design-vue";
import type { VNode } from 'vue';

export interface IDynamicFormItemSelectOption {
  label: string,
  value: string|number,
  badgeState?: 'success'|'error'|'default'|'processing'|'warning',
  badgeColor?: string,
  raw?: unknown;
}

export interface IDynamicFormItemAdditionalOptions {
  options: IDynamicFormItemSelectOption[],
}

export interface SimpleSelectFormItemProps {
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 选项数据
   */
  options: IDynamicFormItemSelectOption[];
  /**
   * 选择值
   */
  value?: unknown;
  /**
   * a-select 其他自定义参数
   */
  customProps?: SelectProps;
  /**
   * 是否自定义渲染option插槽
   */
  renderOption?: SimpleSelectRenderOption;
}

export type SimpleSelectRenderOption = (data: {
  value: unknown,
  label: string,
}) => VNode;