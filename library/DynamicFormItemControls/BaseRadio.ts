import type { HTMLAttributes } from "vue";

export interface BaseRadioProps extends HTMLAttributes {
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 选项数据
   */
  items: {
    /**
     * 选项文本
     */
    text: string,
    /**
     * 选项值
     */ 
    value: string|number,
    /**
     * 其他自定义属性
     */
    [key: string]: unknown|undefined,
  }[];
  /**
   * 选择值
   */
  value?: unknown;
}