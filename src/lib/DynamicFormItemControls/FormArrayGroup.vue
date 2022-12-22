<template>
  <div class="dynamic-form-array-group">
    <!--循环数据条目-->
    <div 
      v-for="(childData, key) in model[item.name]" :key="key"
      class="item-container"
    >
      <div class="form-container">
        <!--循环子条目-->
        <slot 
          name="child" 
          v-for="(child, k) in item.children"
          :key="k"
          :item="child"
          :kname="item.name+'.'+key+'.'+child.name"
          :model="(childData as Record<string, unknown>)"
        />
      </div>

      <slot name="deleteButton" :onClick="() => handleRemove(childData)">
        <button v-if="showDeleteButton" title="删除" class="dynamic-form-base-control base-button delete" type="button" @click="handleRemove(childData)">
          ×
        </button>
      </slot>
    </div>

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

export default defineComponent({
  props: {
    model: {
      type: Object as PropType<Record<string, unknown>>,
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
      if (typeof this.addCallback === 'function') {
        const ret = this.addCallback(this.model[this.item.name]);
        if (typeof ret !== 'undefined')
          (this.model[this.item.name] as unknown[]).push(ret);
      }
    },
    handleRemove(data: unknown) {
      const arr = this.model[this.item.name] as unknown[];
      if (typeof this.deleteCallback === 'function')
        this.deleteCallback(arr, data);
      else {
        const index = arr.indexOf(data);
        if (index >= 0) arr.splice(index, 1);
      }
    },
  },
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
    width: 100%;
  }
  .form-container {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .base-button {
    cursor: pointer;

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