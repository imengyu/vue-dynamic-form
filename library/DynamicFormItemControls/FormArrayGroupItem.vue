<template>
  <FormGroupTitle
    v-model:collapsed="collapsed"
    :title="`子条目${index + 1}`"
    :collapsible="collapsible"
  >
    <slot name="itemButton" 
      :onDeleteClick="() => $emit('delete', childData)"
      :onUpClick="() => $emit('up', childData)"
      :onDownClick="() => $emit('down', childData)"
    >
      <div class="nav-button-conntainer">
        <div class="number">
          #{{ index + 1 }}
        </div>
        <div class="buttons">
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
      </div>
    </slot>
  </FormGroupTitle>
  <div v-if="!collapsed" class="form-divider" />
  <div v-if="!collapsed" class="form-container">
    <template v-if="isObject">
      <!--循环子条目-->
      <slot 
        name="child" 
        v-for="(child, k) in item.children"
        :key="k"
        :item="child"
        :pitem="item"
        :kname="name+keyName+'.'+child.name"
        :model="(childData as IDynamicFormObject)[child.name]"
        :onUpdateValue="(v: any) => (childData as IDynamicFormObject)[child.name] = v"
        :isFirst="k === 0"
        :isLast="k === (item.children?.length || 0) - 1"
      />
    </template>
    <template v-else-if="item.children">
      <!--循环子条目-->
      <slot 
        name="child"
        :item="item.children?.[0]"
        :pitem="item"
        :kname="name+keyName"
        :model="childData"
        :onUpdateValue="(v: any) => $emit('update:childData', v)"
        :isFirst="isFirst"
        :isLast="isLast"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, type PropType } from "vue";
import type { IDynamicFormItem, IDynamicFormObject } from "../DynamicForm";
import IconUp from "../Images/IconUp.vue";
import IconDown from "../Images/IconDown.vue";
import IconDelete from "../Images/IconDelete.vue";
import FormGroupTitle from "./FormGroupTitle.vue";

defineEmits([ 'up', 'down', 'delete', 'update:childData' ]);
const props = defineProps({
  childData: {
    required: true,
  },
  index: {
    type: Number,
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
  isFirst: {
    type: Boolean,
    default: false,
  },
  isLast: {
    type: Boolean,
    default: false,
  },
  collapsible: {
    type: Boolean,
    default: false,
  },
  startCollapsed: {
    type: Boolean,
    default: false,
  },
});
const collapsed = ref(props.startCollapsed);
</script>