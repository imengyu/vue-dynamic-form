
<template>
  <Alert v-if="!suppressEmptyError && (model === undefined || model === null)"
    type="warning"
    :message="`DynamicForm: Input field ${name} is undefined or null`"
    :extraMessage="`At form ${formName}: ${name}`"
  />
  <Alert v-else-if="(checkType && checkType === 'array' && !Array.isArray(modelWithDefault))"
    type="error"
    :message="`DynamicForm: Input field ${name} (${modelWithDefault}) is not a array`"
    :extraMessage="`At form ${formName}: ${name}`"
  />
  <Alert v-else-if="(checkType && typeof modelWithDefault !== checkType)"
    type="error"
    :message="`DynamicForm: Input field ${name} (${modelWithDefault}) is not a ${checkType}`"
    :extraMessage="`At form ${formName}: ${name}`"
  />
  <Alert v-else-if="(checkCustomType && !checkCustomType(modelWithDefault))"
    type="error"
    :message="`DynamicForm: Input field ${name} (${modelWithDefault}) is not a valid type, type is ${typeof modelWithDefault}`"
    :extraMessage="`At form ${formName}: ${name}`"
  />
  <slot v-else />
</template>

<script lang="ts" setup>
import { inject, PropType } from 'vue';
import { IDynamicFormObject } from './DynamicForm';
import Alert from './DynamicFormBasicControls/Blocks/Alert.vue';

const formName = inject('formName', '')

/**
 * 动态表单组件。
 */
defineProps({
  model: {
    type: Object as PropType<IDynamicFormObject>,
    default: null
  },
  modelWithDefault: {
    type: Object as PropType<IDynamicFormObject>,
    default: null
  },
  checkType: {
    type: String as PropType<'object' | 'string' | 'number' | 'array' | ''>,
    default: ''
  },
  checkCustomType: {
    type: Function as PropType<(value: any) => boolean>,
  },
  name: {
    type: String,
    default: ''
  },
  /**
   * 是否屏蔽空错误。默认否
   * @default false
   */
  suppressEmptyError: {
    type: Boolean,
    default: false
  },
});
</script>
