<template>
  <a-row :gutter="gutter">
    <a-col :span="span" v-for="(item, key) in items" :key="key">
      <div class="d-flex flex-row">
        <div class="flex-grow-1">
          <a-form-item v-if="item.type=='text'" :label="item.label" :labelCol="labelCol" :wrapperCol="wrapperCol" :name="item.name||item.key">
            <a-input 
              :required="item.required"
              v-model:value="item.value"
              :placeholder="item.placeholder||''"
              :addon-before="item.prefix"
              :addon-after="item.suffix"
              :max-length="item.appenderParams?(item.appenderParams.maxLength):undefined"
            />
          </a-form-item>
          <a-form-item v-else-if="item.type=='number'" :label="item.label" :labelCol="labelCol" :wrapperCol="wrapperCol" :name="item.name||item.key">
            <a-input-number 
              :required="item.required"
              v-model:value="item.value"
              :style="item.suffix&&item.suffix!=''?'':'width: 100%;'"
              :min="item.appenderParams?(item.appenderParams.min):undefined"
              :max="item.appenderParams?(item.appenderParams.max):undefined"
              :step="item.appenderParams?(item.appenderParams.step):undefined"
            />
            <span v-if="item.suffix&&item.suffix!=''" class="ml-2">{{item.suffix}}</span>
          </a-form-item>
          <a-form-item v-if="item.type=='checkbox'" :label="item.label" :labelCol="labelCol" :wrapperCol="wrapperCol" :name="item.name||item.key">
            <a-checkbox v-model:checked="item.value">{{item.label}}</a-checkbox>
          </a-form-item>
          <a-form-item v-else-if="item.type=='text-array'" :label="item.label" :labelCol="labelCol" :wrapperCol="wrapperCol" :name="item.name||item.key">
            <SimpleEditDynamicStringList
              :array="(item.value as string[])"
              placeholder="请输入参数值"
            />
          </a-form-item>
          <a-form-item v-else-if="item.type=='text-select'" :label="item.label" :labelCol="labelCol" :wrapperCol="wrapperCol" :name="item.name||item.key">
            <a-select
              :required="item.required"
              v-model:value="item.value"
              style="width: 100%"
              :options="item.appenderParams?.options"
            >
            </a-select>
          </a-form-item>
        </div>
        <a-popconfirm
          v-if="canDelete"
          title="确定删除此参数吗？"
          @confirm="$emit('delete', item, key)"
        >
          <a-button class="ml-3">
            <template #icon><DeleteOutlined /></template>
          </a-button>
        </a-popconfirm>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import {  DeleteOutlined } from '@ant-design/icons-vue'
import SimpleEditDynamicStringList from './SimpleEditDynamicStringList.vue';

export interface SimpleListDynamicFormItem {
  label: string;
  value: unknown;
  name: string;
  key: string;
  required?: boolean,
  type: 'text'|'number'|'checkbox'|'radio'|'switch'|'text-array'|'text-select';
  placeholder ?: string;
  prefix ?: string;
  suffix ?: string;
  appenderParams ?: {
    [index: string]: unknown
  };
}

/**
 * 简单的列表动态表单
 */
export default defineComponent({
  name: 'SimpleListDynamicForm',
  components: {
    SimpleEditDynamicStringList,
    DeleteOutlined,
  },
  props: {
    /**
     * 表单条目
     */
    items: {
      required: true,
      type: Object as PropType<SimpleListDynamicFormItem[]>
    },
    /**
     * 是否可以删除表单条目
     */
    canDelete: {
      default: true,
      type: Boolean
    },
    span: {
      default: 7,
      type: Number
    },
    gutter: {
      default: 30,
    },
    labelCol: {
      default: () => { return { span: 10 } },
      type: Object
    },
    wrapperCol: {
      default: () => { return { span: 14 } },
      type: Object
    },
    /**
     * 是否显示删除按钮
     */
    showDelete: {
      default: false,
      type: Boolean
    },
  },
})
</script>