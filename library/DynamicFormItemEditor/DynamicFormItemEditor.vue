<template>
  <!-- 编辑器条目 -->
  <div 
    :class="[
      'dynamic-form-item-editor',
      editorContext?.currentFocusItem?.value.includes(item) ? 'active' : '',
      isDragOver ? 'drag-over' : ''
    ]"
    :draggable="canDrag"
    @click="editorContext?.setCurrentFocusItem(item)"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop.stop="handleDrop"
    @dragstart="handleDragStart"
  >
   
    <!-- 按钮 -->
    <div class="buttons left">
      <button title="切换可见性" @click.stop="editorContext?.switchVisible(item, parent)">
        <i :class="[
          'iconfont', 
          item.hidden ? 'icon-yincang-tianchong' : 'icon-xianshitianchong'
        ]"></i>
      </button>
      <button 
        title="拖动" 
        class="drag"
        @mouseenter="canDrag = true"
        @mouseleave="canDrag = false"
      >
        <i class="iconfont icon-move"></i>
      </button>
      <div class="status">{{ item.name }}:{{ item.type }}</div>
    </div>
    <div class="buttons right">
      <button title="复制" @click.stop="editorContext?.copyItem(item, parent)">
        <i class="iconfont icon-copy"></i>
      </button>
      <button title="删除" class="danger" @click.stop="editorContext?.deleteItem(item, parent)">
        <i class="iconfont icon-shanchu"></i>
      </button>
    </div>

    <!-- 容器且为空指示 -->
     <div 
      v-if="props.isContainer && item.children?.length === 0" 
      class="drop-indicator center"
    >
      <span>在这里放置子条目</span>
    </div>

    <!-- 拖拽指示 -->
    <div 
      v-if="showTopIndicator" 
      class="drop-indicator top"
    >
      <span>放置在上部</span>
    </div>
    <div 
      v-if="showBottomIndicator" 
      class="drop-indicator bottom"
    >
      <span>放置在下部</span>
    </div>
    <div 
      v-if="showCenterIndicator" 
      class="drop-indicator center"
    >
      <span>放置在内部</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed } from 'vue';
import { getDropData, getStoragedDropData, storageDropData, type IDynamicFormEditorContext } from './DynamicFormItemEditor';
import type { IDynamicFormItem } from '../DynamicForm';

const props = defineProps<{
  item: IDynamicFormItem,
  parent?: IDynamicFormItem,
  isContainer?: boolean,
}>();
const editorContext = inject<IDynamicFormEditorContext>('editorContext');

// 拖拽状态
const canDrag = ref(false);
const isDragOver = ref(false);
const dragPosition = ref<'top' | 'bottom' | 'center'>('top');

const showTopIndicator = computed(() => {
  return isDragOver.value && dragPosition.value === 'top';
});
const showBottomIndicator = computed(() => {
  return isDragOver.value && dragPosition.value === 'bottom';
});
const showCenterIndicator = computed(() => {
  return isDragOver.value && dragPosition.value === 'center';
});

function handleDragOver(event: DragEvent) {
  isDragOver.value = true;
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const y = event.clientY - rect.top;
  const halfHeight = rect.height / 2;
  if (props.isContainer) {
    if (y < rect.height / 4)
      dragPosition.value = 'top';
    else if (y > rect.height * 3 / 4)
      dragPosition.value = 'bottom';
    else
      dragPosition.value = 'center';
  } else
    dragPosition.value = y < halfHeight ? 'top' : 'bottom';
}
function handleDragLeave() {
  isDragOver.value = false;
}
function handleDrop(event: DragEvent) {
  const dropData = getDropData(event);
  if (!dropData || (dropData.type !== 'FormItemDef' && dropData.type !== 'IDynamicFormItem'))
    return;

  let item : {
    dropItem: IDynamicFormItem,
    dropItemParent?: IDynamicFormItem,
    isNew: boolean,
  };

  if (dropData.type === 'FormItemDef') {
    const data = dropData.data as any;
    item = {
      dropItem: {
        label: data.label,
        name: data.name,
        type: data.name,
      },
      isNew: true,
    }
  } else {
    item = {
      dropItem: getStoragedDropData((dropData.data as any).dropItem) as IDynamicFormItem,
      dropItemParent: getStoragedDropData((dropData.data as any).dropItemParent) as IDynamicFormItem,
      isNew: false,
    };
  }

  isDragOver.value = false;
  if (editorContext) {
    event.preventDefault();
    event.stopPropagation();
    editorContext.dropItem(
      props.item,
      props.parent,
      item.dropItem,
      item.dropItemParent,
      dragPosition.value,
      item.isNew,
    );
  }
}
function handleDragStart(event: DragEvent) {
  if (!canDrag.value)
    return;
  event.dataTransfer!.setData('text/plain', JSON.stringify({
    type: 'IDynamicFormItem',
    data: {
      dropItemParent: storageDropData(props.parent),
      dropItem: storageDropData(props.item)
    },
  }));
}
</script>

<style lang="scss">
.dynamic-form-item-editor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px dashed var(--dynamic-form-primary-color);
  z-index: 1;
  overflow: visible;

  &.active {
    border-style: solid;
    border-width: 2px;
  }
  &:hover {
    .buttons {
      visibility: visible;
    }
  }

  &.drag-over {
    background-color: transparent;
  }
  .drop-indicator {
    position: absolute;
    height: 4px;
    background-color: var(--dynamic-form-primary-color);
    left: 0;
    right: 0;
    z-index: 2;
    transition: opacity 0.2s ease;
    border-radius: 2px;
    box-shadow: 0 0 8px rgba(var(--dynamic-form-primary-color-rgb), 0.6);
    animation: pulse 1.5s infinite;

    &.top {
      top: 0;
      span {
        top: 2px;
      }
    }
    &.bottom {
      bottom: 0;
      span {
        bottom: 2px;
      }
    }
    &.center {
      background-color: transparent;
      top: 50%;
      transform: translateY(-50%);

      span {
        top: 2px;
        border-radius: 6px;
        padding: 5px;
        height: 25px;
      }
    }

    span {
      position: absolute;
      left: 50%;
      height: 15px;
      line-height: 15px;
      transform: translateX(-50%);
      background-color: var(--dynamic-form-primary-color);
      font-size: 12px;
      color: var(--dynamic-form-text-light-color);
      padding: 0 4px;
    }
  }

  // 脉冲动画
  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }

  .buttons {
    position: absolute;
    display: flex;
    flex-direction: row;
    align-items: center;
    //visibility: hidden;

    &.left {
      top: 0px;
      right: 0;
    }
    &.right {
      bottom: 0;
      right: 0px;
    }
  }

  $button-size: 20px;

  .status {
    font-size: 12px;
    background-color: var(--dynamic-form-primary-color);
    color: var(--dynamic-form-text-light-color);
    line-height: $button-size;
    padding: 0 4px;
  }

  button {
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    width: $button-size;
    height: $button-size;
    background-color: var(--dynamic-form-primary-color);
    color: var(--dynamic-form-text-light-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &.drag {
      cursor: move;
    }
    &.danger {
      background-color: var(--dynamic-form-error-color);
    }
  }
}
</style>