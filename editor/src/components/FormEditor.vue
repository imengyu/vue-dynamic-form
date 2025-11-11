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
    
    />
    <div class="form-editor-props">
      <h4>表单属性</h4>
      <DynamicForm 
        :model="propsModel"
        :options="propsDynamicFormOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { IDynamicFormOptions } from '@imengyu/vue-dynamic-form';
import DynamicForm from '../../../library/DynamicForm.vue';
import FormItemsList from './FormItemsList.vue';
import FormEditorPreview from './FormEditorPreview.vue';

const activeKey = ref('list');
const propsModel = ref<Record<string, unknown>>({});
const propsDynamicFormOptions = ref<IDynamicFormOptions>({
  formItems: [],
})

</script>

<style lang="scss">
$navBarHeight: 46px;

.form-editor-container {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 100vh;

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
      background-color: #f8f8f8;
    }
  }
  .form-editor-props {
    flex: 0 0 300px;
  }
}
.form-editor-props {
  background-color: #f8f8f8;

  h4 {
    text-align: center;
    margin: 0;
    height: $navBarHeight;
    line-height: $navBarHeight;
  }
}

</style>