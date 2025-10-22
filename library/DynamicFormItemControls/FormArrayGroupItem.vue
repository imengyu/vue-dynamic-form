<template>
  <div v-if="isObject" class="form-container">
    <!--循环子条目-->
    <slot 
      name="child" 
      v-for="(child, k) in item.children"
      :key="k"
      :item="child"
      :kname="name+keyName+'.'+child.name"
      :model="(childData as IDynamicFormObject)[child.name]"
      :onUpdateValue="(v: any) => (childData as IDynamicFormObject)[child.name] = v"
    />
  </div>
  <div v-else-if="item.children" class="form-container">
    <!--循环子条目-->
    <slot 
      name="child"
      :item="item.children?.[0]"
      :kname="name+keyName"
      :model="childData"
      :onUpdateValue="(v: any) => $emit('update:childData', v)"
    />
  </div>

  <slot name="itemButton" 
    :onDeleteClick="() => $emit('delete', childData)"
    :onUpClick="() => $emit('up', childData)"
    :onDownClick="() => $emit('down', childData)"
  >
    <div class="nav-button-conntainer">
      <button v-if="showUpDownButton" title="上移" class="dynamic-form-base-control base-button add margin" type="button" @click="$emit('up', childData)">
        ↑
      </button>
      <button v-if="showUpDownButton" title="下移" class="dynamic-form-base-control base-button add margin" type="button" @click="$emit('down', childData)">
        ↓
      </button>
      <button v-if="showDeleteButton" title="删除" class="dynamic-form-base-control base-button delete margin" type="button" @click="$emit('delete', childData)">
        ×
      </button>
    </div>
  </slot>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { IDynamicFormItem } from "../DynamicForm";
import type { IDynamicFormObject } from "../DynamicForm";

defineEmits([ 'up', 'down', 'delete', 'update:childData' ]);
defineProps({
  childData: {
    required: true,
  },
  isObject: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    required: true,
  },
  keyName: {
    type: [String, Number],
    required: true,
  },
  item: {
    type: Object as PropType<IDynamicFormItem>,
    required: true,
  },
  showAddButton: {
    type: Boolean,
    default: true,
  },
  showDeleteButton: {
    type: Boolean,
    default: true,
  },
  showUpDownButton: {
    type: Boolean,
    default: true,
  },
});
</script>