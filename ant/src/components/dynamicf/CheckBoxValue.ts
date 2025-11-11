import type { CheckboxProps } from "ant-design-vue";

export interface CheckBoxValueProps {
  checkboxProps?: CheckboxProps,
  text: string,
  checkedValue?: unknown,
  uncheckedValue?: unknown,
}