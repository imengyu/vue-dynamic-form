import type { CascaderProps } from "ant-design-vue";


export type CascaderFormItemOptionType = CascaderProps['options'];

export type CascaderFormItemLoadDataFun = (parentValue: string|number|null, level: number, parentObject: unknown) => Promise<CascaderFormItemOptionType>;
export type CascaderFormItemOnChooseFun = (values: (string|number|null)[], objects: unknown[]) => void;

/**
 * CascaderFormItem 的公共接口
 */
export interface CascaderFormItemInterface {
  /**
   * 加载树形数据至当前选中层级
   */
  doLoadDataToCurrentValue: () => void;
}
/**
 * CascaderFormItem 的公共接口
 */
export interface CascaderFormItemProps {
  /**
   * 初始化时加载数据
   */
  loadAtStart:  boolean,
  /**
   * 初始化时是否递归加载数据到当前选中的数据
   */
  loadCascaderToCurrentValueAtStart:  boolean,
  /**
   * 加载数据
   */
  loadData: CascaderFormItemLoadDataFun;
  /**
   * placeholder
   */
  placeholder?: string;
  /**
   * 选择后回调查找出的对象键，默认是id
   */
  onSelectFindIdKey?: string;
  /**
   * 选择后回调
   */
  onSelect?: CascaderFormItemOnChooseFun;
  /**
   * a-cascader 其他自定义参数
   */
  customProps?: CascaderProps;
}