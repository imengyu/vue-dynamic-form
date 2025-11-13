<template>
  <div class="dynamic-form-array-group">
    <!--列表-->
    <div :class="['list', direction ]">
      <!--循环数据条目-->
      <!--对象类型-->
      <template v-if="isObject">
        <div v-for="(childData, key) in model"
          :key="key" 
          class="item-container"
        >
          <FormArrayGroupItem 
            :item="item"
            :parent="parent"
            :name="name"
            :childData="childData"
            :keyName="`[${key}]`"
            :isObject="true"
            :showAddButton="showAddButton"
            :showDeleteButton="showDeleteButton"
            :showUpDownButton="showUpDownButton"
            @delete="handleRemove"
            @down="handleDown"
            @up="handleUp"
          >
            <template #child="values">
              <slot name="child" v-bind="values" />
            </template>
            <template #itemButton="values">
              <slot name="itemButton" v-bind="values" />
            </template>
          </FormArrayGroupItem>
        </div>
      </template>
      <!--普通变量类型-->
      <template v-else>
        <div v-for="(childData, key) in model"
          :key="key" 
          class="item-container single"
        >
          <FormArrayGroupItem 
            :item="item"
            :parent="parent"
            :name="name"
            :isObject="false"
            :childData="childData"
            :keyName="`[${key}]`"
            :showAddButton="showAddButton"
            :showDeleteButton="showDeleteButton"
            :showUpDownButton="showUpDownButton"
            :isFirst="key === 0"
            :isLast="key === model.length - 1"
            @update:childData="(v) => (model as unknown as IDynamicFormObject)[key] = v"
            @delete="handleRemove"
            @down="handleDown"
            @up="handleUp"
          >
            <template #child="values">
              <slot name="child" v-bind="values" />
            </template>
            <template #itemButton="values">
              <slot name="itemButton" v-bind="values" />
            </template>
          </FormArrayGroupItem>
        </div>
      </template>
    </div>

    <!--添加按钮-->
    <slot name="addButton" :onClick="handleAdd">
      <button v-if="showAddButton" class="add dynamic-form-base-control base-button" type="button" @click="handleAdd">
        <IconAdd /> 
        <span>添加</span>
      </button>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { ArrayUtils } from "@imengyu/imengyu-utils";
import type { IDynamicFormItem, IDynamicFormObject } from "../DynamicForm";
import FormArrayGroupItem from "./FormArrayGroupItem.vue";
import IconAdd from "../Images/IconAdd.vue";

export interface FormArrayGroupProps {
  model: unknown[];
  item: IDynamicFormItem;
  parent?: IDynamicFormItem;
  name: string;
  isObject?: boolean;
  direction?: 'vertical' | 'horizontal',
  showAddButton?: boolean;
  showDeleteButton?: boolean;
  showUpDownButton?: boolean;
  deleteCallback?: (arr: unknown[], data: unknown) => void;
  addCallback?: (arr: unknown[]) => unknown;
}

const props = withDefaults(defineProps<FormArrayGroupProps>(), {
  isObject: true,
  showAddButton: true,
  showDeleteButton: true,
  showUpDownButton: true,
  direction: 'vertical',
})

function handleAdd() {
  if (typeof props.addCallback === "function") {
    const arr = props.model;
    const ret = props.addCallback(props.model);
    if (typeof ret !== "undefined")
      arr.push(ret);
  }
}
function handleRemove(data: unknown) {
  const arr = props.model;
  if (typeof props.deleteCallback === "function")
    props.deleteCallback(arr, data);
  else {
    const index = arr.indexOf(data);
    if (index >= 0)
      arr.splice(index, 1);
  }
}
function handleUp(data: unknown) {
  const arr = props.model;
  const index = arr.indexOf(data);
  if (index > 0)
    ArrayUtils.upData(arr, index);
}
function handleDown(data: unknown) {
  const arr = props.model as unknown[];
  const index = arr.indexOf(data);
  if (index < arr.length - 1)
    ArrayUtils.downData(arr, index);
}
</script>

<style lang="scss">
.dynamic-form-array-group {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  > .list {

    &.vertical {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
        
      .item-container {
        flex: 1;
      }
    }
    &.horizontal {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
    }
  }

  .item-container {
    display: flex;
    flex-direction: row;
    background-color: var(--dynamic-form-background-color);
    padding: 10px;
    padding-bottom: 0;
    border-radius: var(--dynamic-form-border-radius);
    margin-bottom: 10px;
  }

  .form-container {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .nav-button-conntainer {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .base-button {
      padding: 0;
      width: 24px;
      height: 24px;
      border-radius: 50%;

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }

  .base-button {
    cursor: pointer;
    min-width: 20px !important;

    &.margin {
      margin-left: 6px;
    }

    &.add {
      --dynamic-form-button-shadow-color: var(--dynamic-form-shadow-primary-color);
      
      color: var(--dynamic-form-text-light-color);
      background-color: var(--dynamic-form-primary-color);

      &:hover {
        background-color: var(--dynamic-form-primary-color2);
      }
    }

    &.delete {
      --dynamic-form-button-shadow-color: var(--dynamic-form-shadow-error-color);

      color: var(--dynamic-form-text-light-color);
      background-color: var(--dynamic-form-error-color);

      &:hover {
        background-color: var(--dynamic-form-error-color2);
      }
    }
  }
}
</style>