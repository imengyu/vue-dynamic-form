<!-- eslint-disable vue/no-mutating-props -->
<template>
  <!--空显示-->
  <slot name="empty" v-if="options.formItems?.length == 0 || !model">
    <div v-if="options.emptyText" class="dynamic-form-item-empty">{{ options.emptyText }}</div>
  </slot>
  <Alert 
    v-else-if="(typeof model !== 'object' && !options.suppressRootError)"
    type="warning"
    message="DynamicForm: model is not a object!"
    :extraMessage="`At form ${name || 'unnamed'} Root`"
  />
  <template v-else>
    <!--表单条目渲染核心-->
    <DynamicFormItemContainer 
      v-for="(item, index) in options.formItems"
      :key="index"
      :item="item"
      :name="item.name"
      :rawModel="finalModel"
      :model="finalModel[item.name]"
      :parentModel="finalModel"
      @update:model="(v: unknown) => finalModel[item.name] = v"
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
    </DynamicFormItemContainer>
    <slot name="endButton" />
  </template>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue';
import { type IDynamicFormOptions, type IDynamicFormObject } from './DynamicForm';
import DynamicFormItemContainer from './DynamicFormItemContainer.vue';
import Alert from './DynamicFormBasicControls/Blocks/Alert.vue';

/**
 * 动态表单组件。
 */
const props = defineProps({
  model: {
    type: Object as PropType<IDynamicFormObject>,
    default: null
  },
  options: {
    type: Object as PropType<IDynamicFormOptions>,
    default: null
  },
  name: {
    type: String,
    default: ''
  }
});

const finalModel = computed(() => {
  if (typeof props.model !== 'object')
    return {};
  return props.model;
});
</script>
