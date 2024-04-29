<template>
  <div class="demo-index">
    <div class="demo-row">
      <div class="demo-col">
        <div :class="'demo-alert '+(editorHasError?'error':'success')">{{  editorHasError || '你可以动态修改JSON，看看表单会发生什么变化' }}</div>
        <codemirror
          v-model="editorJson"
          placeholder="源代码"
          :style="{ height: '700px', width: '100%' }"
          :autofocus="true"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="editorExtensions"
        />
      </div>
      <div class="demo-col padding">
        <DynamicForm
          :options="formOptions"
          :model="formModel"
          @submit="onSubmit"
        />
        <div class="demo-result">
          <h5>表单双向绑定数据</h5>
          {{resultJson}}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseCheckProps, BaseRadioProps, BaseSelectProps, BaseTextAreaProps, DynamicForm, IDynamicFormOptions } from '@imengyu/vue-dynamic-form';
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json';

const editorExtensions = [json()];
const editorJson = ref('');
const editorHasError = ref('');

const resultJson = computed(() => {
  return JSON.stringify(formModel, undefined, 2);
});

const formModel = reactive({
  stringProp: '',
  stringProp2: '',
  numberProp: 2,
  numberProp2: 3,
  booleanProp: false,
});
const formOptions = ref<IDynamicFormOptions>({
  formLabelCol: { span: 4 },
  formWrapperCol: { span: 20 },
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
        style: { width: '300px' }
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

function onSubmit() {
  alert('你提交的数据：' + JSON.stringify(formModel, undefined, 2));
}

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

</script>