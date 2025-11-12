<template>
  <div 
    class="form-editor-preview"
    @dragenter="handleDragEnter"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <div class="form-editor-preview-toolbar">
      <div>
        <a-button 
          :icon="h(UndoOutlined)" 
          type="text" 
          size="small"
          class="toolbar-btn"
          :disabled="!canBack"
          @click="history.back"
          title="撤销"
        />
        <a-button 
          :icon="h(RedoOutlined)" 
          type="text" 
          size="small"
          class="toolbar-btn"
          :disabled="!canForward"
          @click="history.forward"
          title="重做"
        />
      </div>
      <div>
        <a-dropdown 
          placement="bottomRight"
          :trigger="['click']"
        >
          <a-button 
            type="text" 
            size="small"
            :icon="h(DownloadOutlined)" 
            class="toolbar-btn"
          >
            导出
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a href="javascript:;" @click="handleShowJson">查看</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" @click="handleDownload">下载</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-dropdown 
          placement="bottomRight"
          :trigger="['click']"
        >
          <a-button 
            :icon="h(UploadOutlined)" 
            type="text" 
            size="small"
            class="toolbar-btn"
          >
            导入
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a href="javascript:;" @click="handleImportJson">导入代码</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" @click="handleImportFile">导入文件</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <a-button 
          :icon="h(EyeOutlined)" 
          class="toolbar-btn"
          type="primary"
          size="small"
          @click="handlePreview"
        >
          预览
        </a-button>
        <a-button 
          danger 
          size="small"
          :icon="h(DeleteOutlined)" 
          class="toolbar-btn"
          @click="handleClear"
        >
          清空
        </a-button>
      </div>
    </div>
    <ScrollRect scroll="vertical" container-class="form-editor-preview-container">
      <DynamicForm 
        :model="previewModel"
        :options="currentFormOptions"
        :editorContext="editorContext"
      />
    </ScrollRect>

    <a-modal
      title="预览"
      v-model:open="previewModalVisible"
      @ok="previewModalVisible = false"
    >
      <DynamicForm 
        :model="previewRealModel"
        :options="currentFormOptions"
      />
    </a-modal>

    <!-- JSON导入对话框 -->
    <a-modal
      title="导入JSON配置"
      v-model:open="importJsonModalVisible"
      @ok="handleImportJsonSave"
      @cancel="importJsonModalVisible = false"
      width="80%"
    >
      <div style="min-height: 400px;">
        <vue-monaco-editor
          v-model:value="importJsonContent"
          ref="monacoEditorRef"
          height="400px"
          language="json"
          :options="{
            minimap: { enabled: true },
            fontSize: 14,
            autoIndent: 'advanced',
            formatOnPaste: true,
            formatOnType: true,
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line'
          }"
        />
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, ref, toRef, watch, type PropType } from 'vue';
import { getDropData, type IDynamicFormEditorContext, type IDynamicFormItem, type IDynamicFormOptions } from '@imengyu/vue-dynamic-form';
import { getFormItemDef, type FormItemDef } from '../dynamic/ItemsDef';
import DynamicForm from '../../../library/DynamicForm.vue';
import { ScrollRect } from '@imengyu/vue-scroll-rect';
import { ArrayUtils, pickFile } from '@imengyu/imengyu-utils';
import { UploadOutlined, DownloadOutlined, EyeOutlined, DeleteOutlined, UndoOutlined, RedoOutlined } from '@ant-design/icons-vue';
import { useKeyPress } from '../composeable/useKeyPress';
import { DownloadUtils } from '@imengyu/imengyu-utils';
import { Modal } from 'ant-design-vue';
import { useStackHistory } from '../composeable/useStackHistory';

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
const emit = defineEmits([
  'update:currentFormSelectedFormItems',
  'update:currentFormOptions',
]);

const previewModalVisible = ref(false);
const previewRealModel = ref({});
const previewModel = ref({});

// JSON编辑器相关变量
const importJsonModalVisible = ref(false);
const importJsonContent = ref('');
const monacoEditorRef = ref(null);

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
const history = useStackHistory((v) => {
  emit('update:currentFormOptions', v);
}, 50);
const { canBack, canForward } = history;
watch(() => props.currentFormOptions, (_, old) => history.add(old), { deep: true });
onMounted(() => history.add(props.currentFormOptions));

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

//工具类函数
function handleShowJson() {
  // 显示JSON配置
  Modal.info({
    title: '表单JSON配置',
    width: '80%',
    okText: '关闭',
    content: () => {
      const jsonContent = JSON.stringify(props.currentFormOptions, null, 2);
      return h('pre', {
        style: {
          background: '#f5f5f5',
          padding: '16px',
          borderRadius: '4px',
          maxHeight: '60vh',
          overflow: 'auto',
        }
      }, jsonContent);
    }
  });
}
function handleDownload() {
  // 下载配置文件
  DownloadUtils.downloadFile(
    JSON.stringify(props.currentFormOptions, null, 2), 
    `form-config-${new Date().getTime()}.json`, 
    'application/json'
  );
}

function handleImportFile() {
  pickFile('application/json', false, (files) => {
    const file = files?.[0];
    if (!file) 
      return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonContent = event.target?.result as string;
        if (loadString(jsonContent))
          Modal.success({ content: '表单配置导入成功！' });
      } catch (error) {
        Modal.error({ content: 'JSON文件解析失败，请检查文件格式！' });
        console.error('导入JSON文件失败:', error);
      }
    };
    reader.onerror = () => {
      Modal.error({ content: '文件读取失败！' });
    };
    reader.readAsText(file);
  })
}
function handleImportJson() {
  // 重置JSON内容并打开对话框
  importJsonContent.value = '';
  importJsonModalVisible.value = true;
}

function handleImportJsonSave() {
  // 调用loadString函数加载JSON内容
  if (loadString(importJsonContent.value)) {
    // 如果加载成功，关闭对话框
    importJsonModalVisible.value = false;
    Modal.success({ content: 'JSON配置导入成功！' });
  }
  // 如果加载失败，loadString函数会显示错误提示，对话框不会自动关闭
}
function handlePreview() {
  previewModalVisible.value = true;
}
function handleClear() {
  Modal.confirm({
    title: '确认清空',
    content: '确定要清空所有表单项吗？',
    okType: 'danger',
    onOk: () => {
      if (props.currentFormOptions.formItems)
        ArrayUtils.clear(props.currentFormOptions.formItems);
    },
  });
}

//外部方法
function loadString(jsonString: string) {
  try {
    let formOptions: IDynamicFormOptions;
    try {
      formOptions = JSON.parse(jsonString) as IDynamicFormOptions;  
    } catch (error) {
      throw 'JSON字符串解析失败，请检查字符串格式！' + error;
    }
    if (!formOptions.formItems)
      throw '表单配置有误，您可能打开了不支持的配置文件'
    loadOptions(formOptions);
    return true;
  } catch (error) {
    Modal.error({ content: error as string });
    return false;
  }
}
function loadOptions(options: IDynamicFormOptions) {
  previewRealModel.value = {};
  previewModel.value = {};
  history.clear();
  history.add(options);
  emit('update:currentFormOptions', options);
}
function resetPreview() {
  previewRealModel.value = {};
  previewModel.value = {};
  history.clear();
}

defineExpose({
  loadOptions,
  resetPreview,
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
.form-editor-preview-toolbar {
  padding: 10px 25px;
  background-color: var(--form-editor-area-background);
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;

  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .toolbar-btn {
    margin-right: 10px;
  }
}
</style>