import type { ButtonHTMLAttributes } from "vue";

export interface BaseButtonProps extends ButtonHTMLAttributes {
  /**
   * 按钮文本
   */
  text?: string,
}