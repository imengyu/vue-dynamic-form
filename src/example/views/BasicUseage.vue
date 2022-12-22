<template>
  <div>
    <div class="demo-row">
      <div class="demo-row" style="width:50%;">
        <DynamicForm
          :options="formOptions"
          :model="formModel"
          @submit="onSubmit"
        />
      </div>
      <div class="demo-col" style="width:50%;">
        <div :class="'demo-alert '+(editorHasError?'error':'success')">{{  editorHasError || '你可以动态修改JSON，看看表单会发生什么变化' }}</div>
        <codemirror
          v-model="editorJson"
          placeholder="源代码"
          :style="{ height: '600px', width: '100%' }"
          :autofocus="true"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="editorExtensions"
        />
      </div>
    </div>
    <div class="demo-row">
      <textarea v-model="resultJson" class="demo-result"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseCheckProps, BaseRadioProps, BaseSelectProps, BaseTextAreaProps, DynamicForm, IDynamicFormOptions } from '@/lib/main';
import { onMounted, reactive, ref, watch } from 'vue'
import { Codemirror } from 'vue-codemirror';
import { json } from '@codemirror/lang-json';

const editorExtensions = [json()];
const editorJson = ref('');
const editorHasError = ref('');

const resultJson = ref('请点击提交按钮获取表单提交数据');

const formModel = reactive({
  stringProp: '',
  stringProp2: '',
  numberProp: 2,
  numberProp2: 3,
  booleanProp: false,
});
const formOptions = ref<IDynamicFormOptions>({
  formItems: [
    { type: 'base-text', label: '文本', name: 'stringProp', additionalProps: { placeholder: '请输入文本' } },
    { 
      type: 'base-textarea', label: '文本域', name: 'stringProp2', 
      formProps: {
        center: false,
      },
      additionalProps: { 
        placeholder: '请输入文本域',
        rows: 6,
        cols: 100,
        style: { width: '400px' }
      } as BaseTextAreaProps
    },
    { 
      type: 'base-select', label: '选择', name: 'numberProp', 
      additionalProps: {
        options: [
          { text: '苹果', value: 1 },
          { text: '香蕉', value: 2 },
          { text: '葡萄', value: 3 },
        ]
      } as BaseSelectProps
    },
    {
      type: 'base-check', label: '复选框', name: 'booleanProp',
      additionalProps: {
        text: '我是复选框的说明',
      } as BaseCheckProps,
    },
    { 
      type: 'base-radio', label: '单选框', name: 'numberProp2', 
      additionalProps: {
        items: [
          { label: '苹果', value: 1 },
          { label: '香蕉', value: 2 },
          { label: '葡萄', value: 3 },
        ]
      } as BaseRadioProps,
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

onMounted(() => {
  editorJson.value = JSON.stringify(formOptions.value, undefined, 2);
});
watch(editorJson, () => {
  try {
    const newObj = JSON.parse(editorJson.value);
    formOptions.value = newObj;
    editorHasError.value = '';
  } catch (e) {
    editorHasError.value = '' + e;
  }
});

function onSubmit() {
  resultJson.value = JSON.stringify(formModel, undefined, 2);
}

</script>