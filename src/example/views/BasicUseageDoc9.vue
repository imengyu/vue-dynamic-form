<template>
  <div>
    <DynamicForm
      :options="formOptions"
      :model="formModel"
    />
    <textarea v-model="resultJson" class="demo-result" style="width: 100%;height: 300px;" readonly></textarea>
  </div>
</template>

<script setup lang="ts">
import { BaseCheckProps, DynamicForm, IDynamicFormOptions } from '../../lib/main';
import { computed, ref } from 'vue'

const formModel = ref({
  arrayObjectProp: [
    {
      name: '我是对象数组数据',
      value: '100',
      enabled: true,
    }
  ],
});
const formOptions : IDynamicFormOptions = {
  formLabelCol: { span: 8 },
  formWrapperCol: { span: 16 },
  formItems: [
    { 
      type: 'array-object', label: '数组嵌套对象条目', name: 'arrayObjectProp', 
      formProps: {
        center: false,
      },
      newChildrenObject: (arrayNow) => ({
        name: `新建子条目${arrayNow.length+1}`,
        value: '100',
        enabled: false,
      }),
      children: [
        { type: 'base-text', label: '名称', name: 'name', additionalProps: { placeholder: '请输入名称' } },
        { type: 'base-text', label: '数量', name: 'value', additionalProps: { placeholder: '请输入数量' } },
        {
          type: 'base-check', label: '是否启用', name: 'enabled',
          additionalProps: {
            text: '是',
          } as BaseCheckProps,
        },
      ]
    },
  ],
  formRules: {},
};

const resultJson = computed(() => {
  return JSON.stringify(formModel.value, undefined, 2);
});
</script>