import type { CheckboxInstance } from "@arco-design/web-vue";

export interface CheckBoxValueProps {
  checkboxProps?: CheckboxInstance['$props'],
  text: string,
  checkedValue?: unknown,
  uncheckedValue?: unknown,
}