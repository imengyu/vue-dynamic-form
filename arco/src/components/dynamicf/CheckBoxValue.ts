import type { CheckboxProps } from "@arco-design/web-vue";

export interface CheckBoxValueProps {
  checkboxProps?: CheckboxProps,
  text: string,
  checkedValue?: unknown,
  uncheckedValue?: unknown,
}