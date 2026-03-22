import type { InputHTMLAttributes } from "vue";

export interface BaseInputProps extends InputHTMLAttributes {
  placeholder?: string;
  password?:boolean;
}