export interface ActionRenderProps {
  /**
   * 操作条目
   */
  actions: Array<ActionRenderItem>;
}

export interface ActionRenderItem {
  /**
   * 按钮文字
   */
  text: string,
  /**
   * 按钮键值
   */
  key?: string,
  /**
   * 这个按钮是否换行，默认否
   */
  wrap?: boolean,
  /**
   * 按钮类型
   */
  type?: 'primary'|'danger'|'success'|'warning'|'secondary',
  /**
   * 按钮点击回调
   */
  onClick?: (key: string|undefined, record: Record<string, unknown>) => void;
}
