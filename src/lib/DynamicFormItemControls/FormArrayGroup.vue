<template>
  <div class="dynamic-form-array-group">
    <div v-if="model === undefined">
      <span class="dynamic-form-error-alert"> [array] 警告：输入字段 {{ name }} 是 undefined</span>
    </div>
    <!--循环数据条目-->
    <!--对象类型-->
    <template v-else-if="isObject">
      <div v-for="(childData, key) in model"
        :key="key" 
        class="item-container"
      >
        <FormArrayGroupItem 
          :item="item"
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
          :name="name"
          :isObject="false"
          :childData="childData"
          :keyName="`[${key}]`"
          :showAddButton="showAddButton"
          :showDeleteButton="showDeleteButton"
          :showUpDownButton="showUpDownButton"
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

    <!--添加按钮-->
    <slot name="addButton" :onClick="handleAdd">
      <button v-if="showAddButton" class="add dynamic-form-base-control base-button" type="button" @click="handleAdd">
        + 添加
      </button>
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { IDynamicFormItem } from "../DynamicForm";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { IDynamicFormObject } from "../DynamicForm";
import ArrayUtils from "../DynamicFormBasicControls/Utils/ArrayUtils";
import FormArrayGroupItem from "./FormArrayGroupItem.vue";

export default defineComponent({
  props: {
    model: {
      type: Object as PropType<Array<unknown>>,
      required: true,
    },
    item: {
      type: Object as PropType<IDynamicFormItem>,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    isObject: {
      type: Boolean,
      default: true,
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
    deleteCallback: {
      type: Function,
      default: null,
    },
    addCallback: {
      type: Function,
      default: null,
    },
  },
  methods: {
    handleAdd() {
      if (typeof this.addCallback === "function") {
        const arr = this.model;
        const ret = this.addCallback(this.model);
        if (typeof ret !== "undefined")
          arr.push(ret);
      }
    },
    handleRemove(data: unknown) {
      const arr = this.model;
      if (typeof this.deleteCallback === "function")
        this.deleteCallback(arr, data);
      else {
        const index = arr.indexOf(data);
        if (index >= 0)
          arr.splice(index, 1);
      }
    },
    handleUp(data: unknown) {
      const arr = this.model;
      const index = arr.indexOf(data);
      if (index > 0)
        ArrayUtils.upData(arr, index);
    },
    handleDown(data: unknown) {
      const arr = this.model as unknown[];
      const index = arr.indexOf(data);
      if (index < arr.length - 1)
        ArrayUtils.downData(arr, index);
    },
  },
  components: { FormArrayGroupItem }
});
</script>

<style lang="scss">
.dynamic-form-array-group {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  .item-container {
    display: flex;
    flex-direction: row;
    background-color: #efefef;
    border: 1px solid #eee;
    padding: 10px;
    padding-bottom: 0;
    border-radius: 10px;
    margin-bottom: 10px;
    flex: 1;
  }

  .form-container {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .base-button {
    cursor: pointer;
    min-width: 20px !important;

    &.margin {
      margin-left: 6px;
    }

    &.add {
      color: #fff;
      background-color: #409eff;

      &:hover {
        background-color: #79bbff;
      }
    }

    &.delete {
      color: #fff;
      background-color: #f56c6c;

      &:hover {
        background-color: #f89898;
      }
    }
  }
}
</style>