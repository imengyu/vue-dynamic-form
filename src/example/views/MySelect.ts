import type { SelectOption } from "@arco-design/web-vue";

export interface IDynamicFormItemSelectValueOption {
  text: string,
  value: unknown,
}

export interface SimpleSelectValueFormItemRef {
  setData(newData: IDynamicFormItemSelectValueOption[]): void;
}

export interface SimpleSelectValueFormItemProps {
  /**
   * 是否禁用
   */
  disabled: boolean;
  /**
   * 选择值
   */
  value: unknown;
  /**
   * a-select 其他自定义参数
   */
  customProps: SelectOption;
}