<script setup lang="ts">
import { toRefs } from 'vue';

export interface RowProps {
  /**
   * 列元素之间的间距（单位为 px）
   */
  gutter?: number;
  /**
   * 主轴对齐方式，可选值为
   */
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | undefined;
  /**
   * 交叉轴对齐方式
   */
  align?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline" | undefined;
  /**
   * 是否自动换行，默认 true
   */
  wrap?: boolean;

  style?: object;
  class?: string|object,
}

/**
 * 24列栅格行组件。
 */
const props = withDefaults(defineProps<RowProps>(), {
  gutter: 0,
  wrap: true,
});

const { gutter, wrap, align, justify } = toRefs(props);
</script>

<template>
  <div
    :class="`dynamic-form-row${props.class ? ' ' + props.class : ''}`"
    :style="{
      flexWrap: wrap !== false ? 'wrap' : 'nowrap',
      justifyContent: justify,
      alignItems: align,
      gap: gutter > 0 ? `${gutter}px` : undefined,
      ...props.style,
    }"
  >
    <slot />
  </div>
</template>