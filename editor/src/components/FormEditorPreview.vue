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
        :options="currentFormOptions"
        :editorContext="editorContext"
      />
    </ScrollRect>
  </div>
</template>

<script setup lang="ts">
import { ref, toRef, type PropType } from 'vue';
import { getDropData, type IDynamicFormEditorContext, type IDynamicFormItem, type IDynamicFormOptions } from '@imengyu/vue-dynamic-form';
import type { FormItemDef } from '../dynamic/ItemsDef';
import DynamicForm from '../../../library/DynamicForm.vue';
import { ScrollRect } from '@imengyu/vue-scroll-rect';
import { ArrayUtils } from '@imengyu/imengyu-utils';
import { Modal } from 'ant-design-vue';

const props = defineProps({
  currentFormOptions: {
    type: Object as PropType<IDynamicFormOptions>,
    default: () => ({}),
  },
  currentFormSelectedFormItem: {
    type: Object as PropType<IDynamicFormItem | null>,
    default: null,
  },
});
const emit = defineEmits(['update:currentFormSelectedFormItem']);

const previewModel = ref({});

function getFormParent(parent?: IDynamicFormItem) {
  return (parent?.children || props.currentFormOptions.formItems);
}

const editorContext : IDynamicFormEditorContext = {
  currentFocusItem: toRef(props, 'currentFormSelectedFormItem') as any,
  dropItem: (sourceItem, sourceParent, dropItem, dropItemParent, direction) => {
    //删除旧项, 插入指定位置
    ArrayUtils.remove(getFormParent(dropItemParent), dropItem);

    const arr = getFormParent(sourceParent);
    const oldIndex = arr.indexOf(sourceItem);
    if (direction === 'top')
      ArrayUtils.insert(arr, Math.max(0, oldIndex), dropItem);
    else
      ArrayUtils.insert(arr, Math.min(arr.length, oldIndex + 1), dropItem);
  },
  setCurrentFocusItem: (item) => {
    if (item === props.currentFormSelectedFormItem) {
      emit('update:currentFormSelectedFormItem', null);
    } else {
      emit('update:currentFormSelectedFormItem', item);
    }
  },
  switchVisible: (item) => {
    item.hidden = !item.hidden;
  },
  copyItem: (item, parent) => {
    const newItem = { ...item };
    newItem.name = `${item.name}_copy`;
    const arr = getFormParent(parent);
    ArrayUtils.insert(arr, arr.indexOf(item) + 1, newItem);
  },
  deleteItem: (item, parent) => {
    Modal.confirm({
      title: '确认删除吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        ArrayUtils.remove(getFormParent(parent), item);
      },
    });
  },
};

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
  const dragData = getDropData(e);
  if (dragData) {
    if (dragData.type === 'FormItemDef') {
      const data = dragData.data as FormItemDef;
      getFormParent(undefined).push({
        label: data.label,
        name:  data.name,
        type: data.name,
      });
    }
  }
}

defineExpose({
  
})
</script>

<style lang="scss">
.form-editor-preview {
  flex: 1;
  background-color: var(--form-editor-background);
}
.form-editor-preview-container {
  padding: 25px;
  margin: 25px;
  background-color: var(--form-editor-area-background);
}
</style>