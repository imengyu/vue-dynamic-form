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
      :pitem="parent"
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
      <button v-if="showUpDownButton" title="上移" class="dynamic-form-base-control base-button margin" type="button" @click="$emit('up', childData)">
        <IconUp />
      </button>
      <button v-if="showUpDownButton" title="下移" class="dynamic-form-base-control base-button margin" type="button" @click="$emit('down', childData)">
        <IconDown />
      </button>
      <button v-if="showDeleteButton" title="删除" class="dynamic-form-base-control base-button delete margin" type="button" @click="$emit('delete', childData)">
        <IconDelete />
      </button>
    </div>
  </slot>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import type { IDynamicFormItem } from "../DynamicForm";
import type { IDynamicFormObject } from "../DynamicForm";
import IconUp from "../Images/IconUp.vue";
import IconDown from "../Images/IconDown.vue";
import IconDelete from "../Images/IconDelete.vue";

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
  parent: {
    type: Object as PropType<IDynamicFormItem>,
    default: null
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