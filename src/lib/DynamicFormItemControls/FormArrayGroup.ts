
/**
 * 动态表单类型是 arrag-object 时的 additionalProps
 */
export interface FormArrayGroupProps {
  /**
   * 是否显示添加按钮，默认是
   */
  showAddButton?: boolean,
  /**
   * 是否显示删除按钮，默认是
   */
  showDeleteButton?: boolean,
  /**
   * 删除按钮回调，可选，不提供时默认操作为将 item 从 array 中移除。
   */
  deleteCallback?: (array: unknown[], item: unknown) => void,
  /**
   * 添加按钮回调，必填，否则用户无法添加数据
   */
  addCallback: (array: unknown[]) => void,
}