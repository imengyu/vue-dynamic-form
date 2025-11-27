<template>
  <h5
    :class="[
      'dynamic-form-group-title', 
      {
        'collapsed': collapsed, 
        'collapsible': collapsible,
        'border-bottom': borderBottom && titleStyle === 'large',
        'small': titleStyle === 'small',
        'large': titleStyle === 'large',
      }
    ]"
  >
    <slot>
      <span class="title">{{ title }}</span>
    </slot>
    <span 
      class="right"
      @click="collapsible ? emit('update:collapsed', !collapsed) : null"
    > 
      <span v-if="collapsible && collapsed">点击这里展开</span>
      <IconDown v-if="collapsible" class="collapsible-icon" />
    </span>
  </h5>
</template>

<script setup lang="ts">
import IconDown from '../Images/IconDown.vue';

const props = withDefaults(defineProps<{
  title?: string,
  collapsible?: boolean,
  collapsed?: boolean,
  borderBottom?: boolean,
  titleStyle?: 'small'|'large',
}>(), {
  collapsible: false,
  collapsed: false,
  borderBottom: true,
  titleStyle: 'small',
  title: '',
});
const emit = defineEmits(['update:collapsed']);

</script>

<style lang="scss">
.dynamic-form-group-title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--dynamic-form-text-color);
  margin: 0;
  margin-bottom: var(--dynamic-form-group-padding);

  &.border-bottom {
    padding-bottom: var(--dynamic-form-group-padding);
    border-bottom: 1px dashed var(--dynamic-form-border-color);
  }

  &.small {
    font-size: 14px;
  }
  &.large {
    font-size: 16px;
    font-weight: bold;
  }

  &.collapsed {
    .collapsible-icon {
      transform: rotate(0deg);
    }
  }

  .collapsible-icon {
    transform: rotate(180deg);
    transition: transform 0.3s ease-in-out;
    width: 16px;
    height: 16px;
  }

  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    min-width: 30%;
    cursor: pointer;

    span {
      font-size: 11px;
      color: var(--dynamic-form-text-color);
      margin-right: 6px;
    }
  }
}
</style>