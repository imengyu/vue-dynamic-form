<template>
  <h5
    :class="[
      'dynamic-form-group-title', 
      {
        'collapsed': collapsed, 
        'collapsible': collapsible
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
}>(), {
  collapsible: false,
  collapsed: false,
  title: '',
});
const emit = defineEmits(['update:collapsed']);

</script>

<style lang="scss">
.dynamic-form-group-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--dynamic-form-text-color);
  margin: 0;
  margin-bottom: var(--dynamic-form-group-padding);

  &.collapsed {
    .collapsible-icon {
      transform: rotate(0deg);
    }
  }
  &.collapsible {
    cursor: pointer;
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

    span {
      font-size: 11px;
      color: var(--dynamic-form-text-color);
      margin-right: 6px;
    }
  }
}
</style>