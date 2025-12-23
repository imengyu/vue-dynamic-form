import type { DataModel } from "@imengyu/js-request-transform";
import type { SelectProps } from "ant-design-vue";
import type { VNode } from "vue";

/**
 * 通用下拉框返回结构定义
 */
export interface DropdownValues<T> {
  /**
   * 选项文本
   */
  text: string,
  /**
   * 选项值
   */
  value: number,
  /**
   * 原始数据
   */
  raw: T;
}

export type LoadDataFun<T extends DataModel> = (val: string | null) => Promise<DropdownValues<T>[]>;

export type SelectIdLoadDataFun<T extends DataModel> = LoadDataFun<T>;

/**
 * SelectId 的公共接口
 */
export interface SelectIdInterface {
  /**
   * 获取某个ID的Lablel
   * @param value 要获取的ID
   */
  getLableByValue(value: number): string;
  /**
   * 重新加载数据
   * @param clearValue 是否需要清除选中数据，默认否
   */
  reload(clearValue?: boolean): void;
}
/**
 * SelectId 的公共接口
 */
export interface SelectIdProps<T extends DataModel> {
  /**
   * 允许清除
   */
  allowClear?: boolean,
  /**
   * 显示空？
   */
  showNull?: boolean,
  /**
   * 禁用
   */
  disabled?: boolean,
  /**
   * 多选？
   */
  multiple?: boolean,
  /**
   * 允许搜索
   */
  showSearch?: boolean,
  placeholder?: string,
  /**
   * 未找到数据时的文案
   */
  notFoundContent?: string,
  /**
   * 初始化时加载数据
   */
  loadAtStart?: boolean,
  /**
   * 不使用后端筛选数据而是前端直接筛选
   */
  filterDirectly?: boolean,
  /**
   * 初始化时的搜索数据
   */
  intitialSearchValue?: Record<string, unknown>,
  /**
   * 加载数据回调
   */
  loadData: LoadDataFun<T>,
  /**
   * a-select 其他自定义参数
   */
  customProps?: SelectProps,
  /**
   * 是否自定义渲染option插槽
   */
  renderOption?: RenderOption;
}
export type RenderOption = (data: {
  value: unknown,
  text: string,
}) => VNode;