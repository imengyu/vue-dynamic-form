import type { SelectProps } from "ant-design-vue";

export type TreeValueLoadDataFun = (pid: string|number, level: number) => Promise<TreeNode[]>;
export type TreeValueCheckClickableFun = (item: TreeNode) => Promise<boolean>;

export type TreeValueGetDiaplayValue = (ref: TreeValueInterface) => string;
export type TreeValueGetRef = (ref: TreeValueInterface) => void;
export interface TreeDataItem {
  id: string | number;
  pId?: number;
  value: string | number;
  title?: string;
  isLeaf?: boolean;
  selectable?: boolean;
  checkable?: boolean;
  disableCheckbox?: boolean;
  disabled?: boolean;
  level?: number;
}

export interface TreeNode {
  id?: number;
  pid?: number;
  level?: number;

  /**
   * 当树为 checkable 时，设置独立节点是否展示 Checkbox
   */
  checkable?: boolean;
  /**
   * 节点的 class
   */
  class?: string;
  /**
   * 	禁掉 checkbox
   */
  disableCheckbox?: boolean;
  /**
   * 禁掉响应
   */
  disabled?: boolean;
  /**
   * 自定义图标。可接收组件，props 为当前节点 props
   */
  icon?: unknown;
  /**
   * 设置为叶子节点(设置了loadData时有效)
   */
  isLeaf?: boolean;
  /**
   * 被树的 (default)ExpandedKeys / (default)CheckedKeys / (default)SelectedKeys 属性所用。注意：整个树范围内的所有节点的 key 值不能重复！
   */
  key: string | number;
  /**
   * 设置节点是否可被选中
   */
  selectable?: boolean;
  /**
   * 节点的 style	
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  style?: string|object;
  /**
   * 标题
   */
  title: string;

  children?: TreeNode[],
}

/**
 * TreeValue 的公共接口
 */
export interface TreeValueInterface {
  /**
   * 获取某个ID的树(正排列)
   * @param value 要获取的ID
   */
  getTree(value: number) : Array<TreeNode>;
  /**
   * 获取某个ID的Lablel
   * @param value 要获取的ID
   */
  getLableByValue(value: number) : string;
  /**
   * 重新加载数据
   */
  reload(): void;
}
/**
 * TreeValue 的公共接口
 */
export interface TreeValueProps {
  /**
   * 允许清除
   */
  allowClear?: boolean,
  /**
   * 多选？
   */
  multiple?: boolean,
  disabled?: boolean,
  /**
   * 初始化时加载数据
   */
  loadAtStart?: boolean,
  /**
   * 加载数据
   */
  loadData?: TreeValueLoadDataFun,
  /**
   * 自定义检查条目是否可点击回调
   */
  checkClickable?: TreeValueCheckClickableFun,
  /**
   * 子数据最大层级
   */
  maxLevel?: number,
  /**
   * 是否只有最后一级可以点击
   */
  onlyLastLevelClickable?: boolean,
  /**
   * a-select 其他自定义参数
   */
  customProps?: SelectProps,
}