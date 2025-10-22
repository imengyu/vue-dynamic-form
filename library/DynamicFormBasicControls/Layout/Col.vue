<script setup lang="ts">
import { computed, inject } from 'vue';

export interface ColProps {
  /**
   * 列元素偏移距离
   */
  offset?: number;
  /**
   * 列元素宽度
   */
  span?: number;

  style?: object;
  class?: string|object,
}

/**
 * 24列栅格列组件。
 *
 * 提供了 24列栅格，通过在 Col 上添加 span 属性设置列所占的宽度百分比。
 *
 * 此外，添加 offset 属性可以设置列的偏移宽度，计算方式与 span 相同。
 */
const props = withDefaults(defineProps<ColProps>(), {
  offset: 0,
  span: 0,
});

const GRID_SIZE = inject('DynamicFormLayoutGridSize', 24);

const pec = computed(() => {
  return ((props.span || 0) / GRID_SIZE) * 100;
});

const computedStyle = computed(() => ({
  flexBasis: pec.value > 0 ? `${pec.value}%` : undefined,
  marginLeft: props.offset ? `${(props.offset / GRID_SIZE) * 100}%` : undefined,
  maxWidth: pec.value > 0 ? `${pec.value}%` : undefined,
  ...props.style,
}));
</script>

<template>
  <div 
    :class="`dynamic-form-col${props.class ? ' ' + props.class : ''}`"
    :style="computedStyle"
  >
    <slot />
  </div>
</template>