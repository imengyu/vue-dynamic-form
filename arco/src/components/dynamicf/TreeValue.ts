import type { SelectProps, TreeNodeData } from "@arco-design/web-vue";

export type TreeValueLoadDataFun = (pid: string|number, level: number) => Promise<TreeNode[]>;
export type TreeValueCheckClickableFun = (item: TreeNode) => Promise<boolean>;

export type TreeValueGetDiaplayValue = (ref: TreeValueInterface) => string;
export type TreeValueGetRef = (ref: TreeValueInterface) => void;

export interface TreeNode extends TreeNodeData {
  id?: number;
  pid?: number;
  level?: number;

  children?: TreeNode[];
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