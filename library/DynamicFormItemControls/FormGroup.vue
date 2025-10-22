<template>
  <div class="dynamic-form-group mt-3">
    <h4>{{ title }}</h4>
    <Row :justify="(justify as any)" :gutter="gutter">
      <slot />
    </Row>
  </div>
</template>

<script lang="ts" setup>
import Row from "../DynamicFormBasicControls/Layout/Row.vue";

defineProps({
  /**
   * 标题
   */
  title: {
    type: String,
    default: "",
  },
  /**
   * 栅格间隔 px
   */
  gutter: {
    type: Number,
    default: null,
  },
  /**
   * flex 布局下的水平排列方式：start end center space-around space-between
   */
  justify: {
    type: String,
    default: "start",
  },
})
</script>

<style lang="scss">
.dynamic-form-group {
  padding: 10px;
  background-color: var(--dynamic-form-background-color);
  border-radius: var(--dynamic-form-border-radius);

  h4 {
    padding: 12px 16px;
    color: var(--dynamic-form-text-color);
    line-height: 2rem;
    margin: 0;
  }
}
</style>