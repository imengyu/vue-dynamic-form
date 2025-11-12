import type { HTMLAttributes } from "vue";

export interface FormGroupProps extends HTMLAttributes {
  /**
   * 标题
   */
  title: string
  /**
   * 列元素之间的间距（单位为 px）
   */
  gutter: number,
  /**
   * flex 布局下的水平排列方式：
   */
  justify: 'start'|'end'|'center'|'space-around'|'space-between';
  /**
   * 是否为朴素样式
   * @default false
   */
  plain: boolean,
  /**
   * 是否默认折叠
   * @default false
   */
  collapsed: boolean,
  /**
   * 是否可折叠
   * @default false
   */
  collapsible: boolean,
}