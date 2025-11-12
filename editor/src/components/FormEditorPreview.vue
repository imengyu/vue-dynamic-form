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
import { getFormItemDef, type FormItemDef } from '../dynamic/ItemsDef';
import DynamicForm from '../../../library/DynamicForm.vue';
import { ScrollRect } from '@imengyu/vue-scroll-rect';
import { ArrayUtils } from '@imengyu/imengyu-utils';
import { Modal } from 'ant-design-vue';
import { useKeyPress } from './useKeyPress';

const props = defineProps({
  currentFormOptions: {
    type: Object as PropType<IDynamicFormOptions>,
    default: () => ({}),
  },
  currentFormSelectedFormItems: {
    type: Array as PropType<IDynamicFormItem[]>,
    default: () => [],
  },
});
const emit = defineEmits(['update:currentFormSelectedFormItems']);

const previewModel = ref({});

function getFormParent(parent?: IDynamicFormItem) {
  return (parent?.children || props.currentFormOptions.formItems);
}
function getUseableName(array: IDynamicFormItem[], name: string) {
  let i = 1;
  while (array.some(it => it.name === name + i))
    i++;
  return name + i;
}
function getUseableLabel(array: IDynamicFormItem[], label: string) {
  let i = 1;
  while (array.some(it => it.label === label + i))
    i++;
  return label + i;
}

const controlKeys = useKeyPress();

const editorContext : IDynamicFormEditorContext = {
  currentFocusItem: toRef(props, 'currentFormSelectedFormItems') as any,
  dropItem: (sourceItem, sourceParent, dropItem, dropItemParent, direction, isNew) => {
    //删除旧项, 插入指定位置
    ArrayUtils.remove(getFormParent(dropItemParent), dropItem);

    const arr = getFormParent(sourceParent);
    const oldIndex = arr.indexOf(sourceItem);

    //新项需要重命名
    if (isNew) {
      dropItem.name = getUseableName(arr, dropItem.name);
      dropItem.label = getUseableLabel(arr, dropItem.label);
    }

    const sourceItemConfig = getFormItemDef(sourceItem.type);
    const dropItemConfig = getFormItemDef(dropItem.type);
    if (!sourceItemConfig) {
      Modal.error({ content: `未找到类型为${sourceItem.type}的表单项定义` });
      return;
    }
    if (!dropItemConfig) {
      Modal.error({ content: `未找到类型为${dropItem.type}的表单项定义` });
      return;
    }
    if (direction === 'top')
      ArrayUtils.insert(arr, Math.max(0, oldIndex), dropItem);
    else if (direction === 'bottom')
      ArrayUtils.insert(arr, Math.min(arr.length, oldIndex + 1), dropItem);
    else {
      if (!sourceItemConfig.isContainer) {
        Modal.error({ content: '非容器项不能插入子项' });
        return;
      } 
      if (sourceItemConfig.isContainerSingle) {
        Modal.confirm({
          title: '确认替换已有条目吗？',
          content: '本条目为单子项，只能有一个子项配置',
          okType: 'danger',
          onOk: () => {
            sourceItem.children = [dropItem];
          },
        });
      } else {
        sourceItem.children = sourceItem.children || [];
        sourceItem.children.push(dropItem);
      }

    }
  },
  setCurrentFocusItem: (item) => {
    let newItems = props.currentFormSelectedFormItems.concat();
    if (props.currentFormSelectedFormItems.includes(item)) {
      ArrayUtils.remove(newItems, item);
    } else {
      if (controlKeys.keyState.value.ctrl) // 多选
        newItems.push(item);
      else
        newItems = [item];
    }
    emit('update:currentFormSelectedFormItems', newItems);
  },
  switchVisible: (item) => {
    item.hidden = !item.hidden;
  },
  copyItem: (item, parent) => {
    const newItem = { ...item };
    const arr = getFormParent(parent);
    newItem.name = getUseableName(arr, `${item.name}_copy`);
    newItem.label = getUseableLabel(arr, item.label);
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
      const arr = getFormParent(undefined);
      ArrayUtils.insert(arr, arr.length, {
        label: getUseableLabel(arr, data.label),
        name: getUseableName(arr, data.name),
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