<template>
  <div 
    class="form-editor-preview"
    @dragenter="handleDragEnter"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <div class="form-editor-preview-toolbar">
    </div>
    <ScrollRect scroll="vertical" container-class="form-editor-preview-container">
      <DynamicForm 
        :model="previewModel"
        :options="previewFormOptions"
        :editmode="true"
      />
    </ScrollRect>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { IDynamicFormOptions } from '@imengyu/vue-dynamic-form';
import DynamicForm from '../../../library/DynamicForm.vue';
import { ScrollRect } from '@imengyu/vue-scroll-rect';
import type { FormItemDef } from '../dynamic/ItemsDef';

const previewModel = ref({});
const previewFormOptions = ref<IDynamicFormOptions>({
  formItems: [],
});

// 处理拖拽事件
function handleDragEnter(e: DragEvent) {
  e.preventDefault();
}
function handleDragOver(e: DragEvent) {
  e.preventDefault();
  e.dataTransfer!.dropEffect = 'copy';
}
function handleDrop(e: DragEvent) {
  e.preventDefault();
  const data = e.dataTransfer!.getData('text/plain');
  if (data) {
    const item = JSON.parse(data) as FormItemDef;
    previewFormOptions.value.formItems.push({
      label: item.label,
      name: item.name,
      type: item.name,
    });
  }
}

defineExpose({
  
})
</script>

<style lang="scss">
.form-editor-preview {
  flex: 1;
}
.form-editor-preview-container {
  padding: 25px;
}
</style>