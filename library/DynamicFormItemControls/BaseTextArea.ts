import type { TextareaHTMLAttributes } from "vue";

export interface BaseTextAreaProps extends TextareaHTMLAttributes {
  cols?: number,
  rows?: number,
  maxlength?: number,
}