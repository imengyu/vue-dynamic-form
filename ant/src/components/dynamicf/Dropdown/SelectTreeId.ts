import type { SelectProps } from "ant-design-vue";
import type { TreeDataItem } from "../TreeValue";

export type SelectTreeIdLoadDataFun = (pid: string|number, level: number) => Promise<TreeDataItem[]>;
export type SelectTreeIdCheckClickableFun = (item: TreeDataItem) => Promise<boolean>;

export type SelectTreeIdGetDiaplayValue = (ref: SelectTreeIdInterface) => string;
export type SelectTreeIdGetRef = (ref: SelectTreeIdInterface) => void;

/**
 * SelectTreeId 的公共接口
 */
export interface SelectTreeIdInterface {
  /**
   * 获取某个ID的树(正排列)
   * @param value 要获取的ID
   */
  getTree(value: number) : Array<TreeDataItem>;
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
 * SelectTreeId 的公共接口
 */
export interface SelectTreeIdProps {
  /**
   * 允许清除
   */
  allowClear?: boolean,
  /**
   * 多选？
   */
  multiple?: boolean,
  dropdownStyle?: Record<string, unknown>,
  disabled?: boolean,
  placeholder?: string,
  /**
   * 默认显示值
   */
  defaultDisplayValue?: string,
  /**
   * 未找到数据时的文案
   */
  notFoundContent?: string,
  /**
   * 初始化时加载数据
   */
  loadAtStart?: boolean,
  /**
   * 加载数据
   */
  loadData?: SelectTreeIdLoadDataFun,
  /**
   * 自定义检查条目是否可点击回调
   */
  checkClickable?: SelectTreeIdCheckClickableFun,
  /**
   * 获取显示数据回调
   */
  getDisplayValue?: SelectTreeIdGetDiaplayValue,
  /**
   * 是否在非激活时显示临时字符串（防止树形数据没有加载，而无法显示当前值）
   */
  showDisplayValueBeforeEdit?: boolean,
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
