<template>
  <div :class="[
    'dynamic-form-group', 
    {
      'collapsed': collapsed,
      'collapsible': collapsible,
      'plain': plain,
    }
  ]">
    <FormGroupTitle
      v-if="title"
      v-model:collapsed="collapsed"
      :title="title"
      :collapsible="collapsible"
    />
    <Row v-if="!collapsed" :justify="(justify as any)" :gutter="gutter">
      <slot />
    </Row>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Row from "../DynamicFormBasicControls/Layout/Row.vue";
import FormGroupTitle from "./FormGroupTitle.vue";

export interface FormGroupProps {
  /**
   * 标题
   */
  title?: string
  /**
   * 列元素之间的间距（单位为 px）
   */
  gutter?: number,
  /**
   * flex 布局下的水平排列方式：
   */
  justify?: 'start'|'end'|'center'|'space-around'|'space-between';
  /**
   * 是否为朴素样式
   * @default false
   */
  plain?: boolean,
  /**
   * 是否默认折叠
   * @default false
   */
  collapsed?: boolean,
  /**
   * 是否可折叠
   * @default false
   */
  collapsible?: boolean,
}

const props = withDefaults(defineProps<FormGroupProps>(), {
  title: '',
  justify: "start",
  collapsible: false,
  plain: false,
  collapsed: false,
});
const collapsed = ref(props.collapsed);

</script>

<style lang="scss">
.dynamic-form-group {
  position: relative;
  padding: 15px;
  background-color: var(--dynamic-form-background-color);
  border-radius: var(--dynamic-form-border-radius);

  &.plain {
    padding: 0;
    background-color: transparent;
  }
}
</style>