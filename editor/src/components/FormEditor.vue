<template>
  <div class="form-editor-container">
    <a-tabs v-model:activeKey="tabLeft" centered class="form-editor-left" :tabBarStyle="{margin:'0'}">
      <a-tab-pane tab="组件" key="list">
        <FormItemsList />
      </a-tab-pane>
      <a-tab-pane tab="结构" key="tree">

      </a-tab-pane>
    </a-tabs>
    <FormEditorPreview 
      :currentFormOptions="currentFormOptions"
      v-model:currentFormSelectedFormItems="currentFormSelectedFormItems"
    />
    <ScrollRect scroll="vertical" class="form-editor-props">
      <a-tabs v-model:activeKey="tabRight" centered :tabBarStyle="{margin:'0'}">
        <a-tab-pane tab="表单属性" key="form">
          <DynamicForm
            :model="currentFormOptions.formAdditionaProps"
            :options="propsDynamicFormOptions"
          />
        </a-tab-pane>
        <a-tab-pane tab="条目属性" key="item">
          <DynamicForm 
            v-if="currentFormSelectedFormItems.length === 1"
            :model="currentFormSelectedFormItems[0]"
            :options="currentFormItemProps"
          />
          <a-empty
            v-else-if="currentFormSelectedFormItems.length > 1"
            description="当前选择了多个条目，只能同时编辑一个"
          />
          <a-empty
            v-else
            description="请选择一个条目进行编辑"
          />
        </a-tab-pane>
      </a-tabs>
    </ScrollRect>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { FormProps } from 'ant-design-vue';
import type { IDynamicFormItem, IDynamicFormOptions } from '@imengyu/vue-dynamic-form';
import DynamicForm from '../../../library/DynamicForm.vue';
import FormItemsList from './FormItemsList.vue';
import FormEditorPreview from './FormEditorPreview.vue';
import { FormConfig, FormItemCommonConfig, getFormItemDef } from '../dynamic/ItemsDef';
import { ScrollRect } from '@imengyu/vue-scroll-rect';

const tabLeft = ref('list');
const tabRight = ref('form');

const currentFormOptions = ref<IDynamicFormOptions>({
  formAdditionaProps: {
    layout: 'horizontal',
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
const currentFormSelectedFormItems = ref<IDynamicFormItem[]>([]);
const currentFormItemProps = computed<IDynamicFormOptions>(() => {
  
  const formItemConfig : IDynamicFormItem[] = [];

  if (currentFormSelectedFormItems.value.length > 0) {
    if (
      currentFormSelectedFormItems.value.length === 1 
      || currentFormSelectedFormItems.value.every(v => v.type === currentFormSelectedFormItems.value[0]!.type)
    ) {
      formItemConfig.push(
        ...(getFormItemDef(currentFormSelectedFormItems.value[0]!.type)?.configs || [])
      );
    }
  }

  return {
    formAdditionaProps: {
      layout: 'vertical',
    } as FormProps,
    formItems: FormItemCommonConfig.concat(formItemConfig),
  }
});

const propsDynamicFormOptions : IDynamicFormOptions = {
  formAdditionaProps: {
    layout: 'vertical',
  } as FormProps,
  formItems: FormConfig,
}

watch(currentFormSelectedFormItems, (v) => {
  if (v.length === 1)
    tabRight.value = 'item';
  else
    tabRight.value = 'form';
}, { deep: true })
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