export interface BaseRadioProps {
  /**
   * 是否禁用
   */
  disabled: boolean;
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
    [key: string]: unknown,
  }[];
  /**
   * 选择值
   */
  value: unknown;
}