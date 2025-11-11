<template>
  <div class="form-editor-container">
    <a-tabs v-model="activeKey" centered class="form-editor-left" :tabBarStyle="{margin:'0'}">
      <a-tab-pane tab="组件" key="list">
        <FormItemsList />
      </a-tab-pane>
      <a-tab-pane tab="结构" key="tree">

      </a-tab-pane>
    </a-tabs>
    <FormEditorPreview 
      :currentFormOptions="currentFormOptions"
      v-model:currentFormSelectedFormItem="currentFormSelectedFormItem"
    />
    <ScrollRect scroll="vertical" class="form-editor-props">
      <h4>表单属性</h4>
      <DynamicForm 
        v-if="currentFormSelectedFormItem"
        :model="currentFormSelectedFormItem"
        :options="currentFormItemProps"
      />
      <DynamicForm 
        v-else
        :model="currentFormOptions.formAdditionaProps"
        :options="propsDynamicFormOptions"
      />
    </ScrollRect>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { FormProps } from 'ant-design-vue';
import type { IDynamicFormItem, IDynamicFormOptions } from '@imengyu/vue-dynamic-form';
import DynamicForm from '../../../library/DynamicForm.vue';
import FormItemsList from './FormItemsList.vue';
import FormEditorPreview from './FormEditorPreview.vue';
import { FormConfig, FormItemCommonConfig, FormItemsMap } from '../dynamic/ItemsDef';
import { ScrollRect } from '@imengyu/vue-scroll-rect';

const activeKey = ref('list');

const currentFormOptions = ref<IDynamicFormOptions>({
  formAdditionaProps: {
    layout: 'vertical',
    labelCol: { span: 6 },
    labelAlign: 'left',
    wrapperCol: { span: 18 },
  } as FormProps,
  formItems: [
    {
      label: '用户名',
      name: 'username',
      type: 'text',
    },
    {
      label: '密码',
      name: 'password',
      type: 'text',
    },
    {
      label: '记住密码',
      name: 'rememberPassword',
      type: 'switch',
    },
    
  ],
});
const currentFormSelectedFormItem = ref<IDynamicFormItem | null>(null);
const currentFormItemProps = computed<IDynamicFormOptions>(() => {
  return {
    formAdditionaProps: {
      layout: 'vertical',
    } as FormProps,
    formItems: FormItemCommonConfig.concat(
      ...FormItemsMap.get(currentFormSelectedFormItem.value?.type || 'static-text')?.configs || []
    ),
  }
});

const propsDynamicFormOptions : IDynamicFormOptions = {
  formAdditionaProps: {
    layout: 'vertical',
  } as FormProps,
  formItems: FormConfig,
}
</script>

<style lang="scss">
$navBarHeight: 46px;

:root {
  --form-editor-border: #f0f0f0;
  --form-editor-bar-background: #ffffff;
  --form-editor-background: #f5f5f5;
  --form-editor-area-background: #ffffff;
}

.form-editor-container {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 100vh;
  overflow: hidden;

  .form-editor-left {
    position: relative;
    flex: 0 0 300px;
    height: 100%;

    .vue-scroll-rect {
      height: calc(100vh - $navBarHeight);
    }
  }
  .form-editor-preview {
    flex: 1;

    .form-editor-preview-toolbar {
      height: $navBarHeight;
      background-color: var(--form-editor-bar-background);
      border-bottom: 1px solid var(--form-editor-border);
    }
    .vue-scroll-rect {
      height: calc(100vh - $navBarHeight);
    }
  }
  .form-editor-props {
    flex: 0 0 300px;
    background-color: var(--form-editor-area-background);
  }
}
.form-editor-props {
  background-color: var(--form-editor-background);

  form {
    padding: 25px;
  }
  h4 {
    background-color: var(--form-editor-bar-background);
    border-bottom: 1px solid var(--form-editor-border);
    text-align: center;
    margin: 0;
    height: $navBarHeight;
    line-height: $navBarHeight;
  }
}

</style>