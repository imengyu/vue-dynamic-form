<template>
  <button class="dynamic-form-base-control base-button" @click="onClick">{{text}}</button>
</template>

<script setup lang="ts">
import { IDynamicFormRef, MESSAGE_TAB_NEXT } from '../../DynamicForm';
import { inject } from 'vue';

const formRef = inject<IDynamicFormRef>('formRef');

export interface NextTabButtonProps {
  /**
   * 按钮文本
   */
  text?: string,
  /**
   * 是否需要验证表单
   */
  needValidate?: boolean,
}

const props = withDefaults(defineProps<NextTabButtonProps>(), {
  text: '下一页',
  needValidate: false,
});

async function onClick() {
  if (formRef) {
    if (!props.needValidate) {
      try {
        await formRef.validate();
      } catch (error) {
        console.error(error);
        return;
      }
    }
    formRef.dispatchMessage(MESSAGE_TAB_NEXT);
  }
}
</script>