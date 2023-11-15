<!-- eslint-disable vue/no-mutating-props -->
<template>
  <!--空显示-->
  <slot name="empty" v-if="options.formItems.length == 0 || !model">
    <div v-if="options.emptyText" class="dynamic-form-item-empty">{{ options.emptyText }}</div>
  </slot>
  <div class="dynamic-form-item-empty" v-else-if="(typeof model !== 'object')">
    DynamicForm Warn model is not a object!
  </div>
  <template v-else>
    <!--表单条目渲染核心-->
    <DynamicFormItem 
      v-for="(item, index) in options.formItems"
      :key="index"
      :item="item"
      :name="item.name"
      :rawModel="model"
      :model="model[item.name]"
      :parentModel="model"
      @update:model="(v: unknown) => model[item.name] = v"
      :disabled="options.disabled"
    >
      <template #arrayButtonAdd="props">
        <slot name="formArrayButtonAdd" v-bind="props" />
      </template>
      <template #arrayButtons="props">
        <slot name="formArrayButtons" v-bind="props" />
      </template>
      <template #formCeil="values">
        <slot name="formCeil" v-bind="values" />
      </template>
    </DynamicFormItem>
    <slot name="endButton" />
  </template>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IDynamicFormOptions, IDynamicFormObject } from './DynamicForm';
import DynamicFormItem from './DynamicFormItem.vue';

/**
 * 动态表单组件。
 */
export default defineComponent({
  components: {
    DynamicFormItem,
  },
  props: {
    model: {
      type: Object as PropType<IDynamicFormObject>,
      default: null
    },
    options: {
      type: Object as PropType<IDynamicFormOptions>,
      default: null
    },
  },
});
</script>
