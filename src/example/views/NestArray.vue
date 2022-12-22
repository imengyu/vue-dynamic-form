<template>
  <div>
    <div class="demo-row">
      <div class="demo-col">
        <DynamicForm
          :options="formOptions"
          :model="formModel"
          @submit="onSubmit"
        />
        <textarea v-model="resultJson" class="demo-result" readonly></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseCheckProps, DynamicForm, IDynamicFormOptions } from '@/lib/main';
import { onMounted, reactive, ref, watch } from 'vue'

const resultJson = ref('请点击提交按钮获取表单提交数据');

const formModel = reactive({
  stringProp: '',
  arrayObjectProp: [],
  numberProp: 2,
  numberProp2: 3,
  booleanProp: false,
});
const formOptions = ref<IDynamicFormOptions>({
  formItems: [
    { 
      type: 'array-object', label: '数组条目', name: 'arrayObjectProp', 
      formProps: {
        center: false,
      },
      newChildrenObject: (arrayNow) => ({
        name: `新建字条目${arrayNow.length+1}`,
        value: 100,
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
    { 
      type: 'base-button', label: '提交', name: 'submit',
    },
  ],
  formRules: {
    stringProp: [
      { required: true, message: '请输入文本' },
      { max: 20, message: '文本最长20个字符' },
    ],
    stringProp2: [
      { required: true, message: '请输入文本域' },
      { max: 200, message: '文本域最长200个字符' },
    ],
  },
});

function onSubmit() {
  resultJson.value = JSON.stringify(formModel, undefined, 2);
}

</script>