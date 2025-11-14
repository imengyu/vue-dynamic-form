<template>
  <div :class="[
    'dynamic-form-group', 
    {
      'collapsed': collapsed,
      'collapsible': collapsible,
      'plain': plain,
    }
  ]">
    <h5 v-if="title" @click="collapsible ? collapsed = !collapsed : null">
      <span class="title">{{ title }}</span>
      <span class="right">
        <span v-if="collapsible && collapsed">点击这里展开</span>
        <IconDown v-if="collapsible" class="collapsible-icon" />
      </span>
    </h5>
    <Row v-if="!collapsed" :justify="(justify as any)" :gutter="gutter">
      <slot />
    </Row>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Row from "../DynamicFormBasicControls/Layout/Row.vue";
import IconDown from "../Images/IconDown.vue";

const props = defineProps({
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
  /**
   * 是否可折叠
   */
  collapsible: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否为朴素样式
   */
  plain: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否默认折叠
   */
  collapsed: {
    type: Boolean,
    default: false,
  },
});
const collapsed = ref(props.collapsed);

</script>

<style lang="scss">
.dynamic-form-group {
  position: relative;
  padding: 15px;
  background-color: var(--dynamic-form-background-color);
  border-radius: var(--dynamic-form-border-radius);

  &.collapsed {
    .collapsible-icon {
      transform: rotate(0deg);
    }
  }
  &.collapsible {
    h5 {
      cursor: pointer;
    }
  }

  .collapsible-icon {
    transform: rotate(180deg);
    transition: transform 0.3s ease-in-out;
    width: 16px;
    height: 16px;
  }

  h5 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--dynamic-form-text-color);
    margin: 0;
    margin-bottom: 12px;

    .right {
      display: flex;
      align-items: center;

      span {
        font-size: 11px;
        color: var(--dynamic-form-text-color);
        margin-right: 6px;
      }
    }
  }

  &.plain {
    padding: 0;
    background-color: transparent;
  }
}
</style>