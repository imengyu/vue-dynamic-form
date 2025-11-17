<template>
  <div class="dynamic-form-array-group">
    <!--列表-->
    <div :class="['list', direction, plain ? 'plain' : '' ]">
      <!--循环数据条目-->
      <template v-if="isObject">
        <!--对象类型-->
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
            :index="key"
            :collapsible="collapsible"
            :startCollapsed="collapsed"
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
      <template v-else>
        <!--普通变量类型-->
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
            :index="key"
            :collapsible="collapsible"
            :startCollapsed="collapsed"
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
      <button v-if="showAddButton" class="add dynamic-form-base-control base-button small" type="button" @click="handleAdd">
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
  /**
   * 列表方向，默认垂直方向。
   */
  direction?: 'vertical' | 'horizontal',
  /**
   * 是否显示添加按钮，默认显示。
   */
  showAddButton?: boolean;
  /**
   * 是否显示删除按钮，默认显示。
   */
  showDeleteButton?: boolean;
  /**
   * 是否显示上下移动按钮，默认显示。
   */
  showUpDownButton?: boolean;
  /**
   * 是否为朴素样式
   * @default false
   */
  plain?: boolean,
  /**
   * 是否默认折叠
   * @default false
   */
  collapsed?: boolean,
  /**
   * 是否可折叠
   * @default true
   */
  collapsible?: boolean,
}

const props = withDefaults(defineProps<FormArrayGroupProps & {
  model: unknown[];
  item: IDynamicFormItem;
  parent?: IDynamicFormItem;
  name: string;
  isObject?: boolean;
  deleteCallback?: (arr: unknown[], data: unknown) => void;
  addCallback?: (arr: unknown[]) => unknown;
}>(), {
  isObject: true,
  showAddButton: true,
  showDeleteButton: true,
  showUpDownButton: true,
  direction: 'vertical',
  plain: false,
  collapsed: false,
  collapsible: true,
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
@use 'sass:math';

.dynamic-form-array-group {
  position: relative;
  display: flex;
  flex-direction: column;

  > .list {
    &.vertical {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      width: 100%;
        
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

    &.plain {
      .item-container {
        border: none;
        background-color: transparent;
        padding: 0;
        margin: 0;
      }
    }
  }

  .item-container {
    $nav-button-size: 24px;
    $nav-button-margin: 6px;

    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: var(--dynamic-form-group-radius);
    border: 1px dashed var(--dynamic-form-border-color);
    background-color: var(--dynamic-form-background-color);
    padding: var(--dynamic-form-group-padding);
    padding-bottom: 0;
    margin-bottom: var(--dynamic-form-group-margin);

    .nav-button-conntainer {
      display: flex;
      flex-direction: row;
      align-items: center;
      z-index: 10;
      gap: $nav-button-margin;

      .number {
        font-size: 18px;
        font-weight: bold;
        color: var(--dynamic-form-text-color);
        background-color: var(--dynamic-form-background-color);
        border: 1px dashed var(--dynamic-form-border-color);
        height: $nav-button-size;
        line-height: $nav-button-size;
        text-align: center;
        border-radius: math.div($nav-button-size, 2);
        padding: 0 $nav-button-margin;
      }
      .buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
        border-radius: $nav-button-size;
        border: 1px dashed var(--dynamic-form-border-color);
        background-color: var(--dynamic-form-background-color);
        gap: $nav-button-margin;
      }

      .base-button {
        padding: 0;
        margin: 0;
        width: $nav-button-size;
        height: $nav-button-size;
        border-radius: 50%;
        background-color: var(--dynamic-form-background-color);
        box-shadow: none;

        &:hover {
          background-color: var(--dynamic-form-background-hover-color);
        }

        svg {
          width: 16px;
          height: 16px;
        }
      }
    }

    .form-divider {
      margin: 0 math.div($nav-button-size, -2);
      border-bottom: 1px dashed var(--dynamic-form-border-color);
      margin-bottom: var(--dynamic-form-group-padding);
    }
    .form-space {
      height: 12px;
    }
    .form-container {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
  }

  .base-button {
    cursor: pointer;
    min-width: 20px !important;

    &.small {
      padding: 0 6px;
      height: 24px;
      font-size: 12px;
      align-self: flex-start;
      box-shadow: none;
      color: var(--dynamic-form-primary-color);

      svg {
        width: 16px;
        height: 16px;
      }
    }

    &.margin {
      margin-left: 6px;
    }
  }
}
</style>