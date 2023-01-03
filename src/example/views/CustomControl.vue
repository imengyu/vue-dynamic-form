<template>
  <div>
    <div class="demo-row">
      <div class="demo-col" style="width:50%;">
        <DynamicForm
          ref="formRef"
          :options="formOptions"
          :model="formModel"
          @submit="onSubmit"
          @ready="onReady"
        />
      </div>
      <div class="demo-col" style="width:50%;">
        <textarea v-model="resultJson" :style="{ height: '600px', width: '100%' }" class="demo-result" readonly></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DynamicForm, IDynamicFormOptions, IDynamicFormRef } from '@/lib/main';
import { markRaw, reactive, ref } from 'vue'
import MySelect from './MySelect.vue';
import { IDynamicFormItemSelectValueOption, SimpleSelectValueFormItemRef } from './MySelect';

const resultJson = ref('请点击提交按钮获取表单提交数据');

const formRef = ref<IDynamicFormRef>();
const formModel = reactive({
  stringProp: '',
  numberProp: 1,
  booleanProp: false,
});
const formOptions = ref<IDynamicFormOptions>({
  widgets: {
    //注册局部组件，这样在当前表单中即可使用
    'my-select': {
      componentInstance: markRaw(MySelect),
      valueName: 'value',
      additionalProps: {},
    },
  },
  formItems: [
    { type: 'base-text', label: '正常组件', name: 'stringProp', additionalProps: { placeholder: '请输入文本' } },
    {
      type: 'my-check', label: '全局自定义组件', name: 'booleanProp', 
      additionalProps: { text: '这是自定义的复选框' },
    },
    {
      type: 'my-select', label: '局部自定义组件', name: 'numberProp', 
      additionalProps: { text: '请选择套餐' },
    },
    { 
      type: 'base-button', label: '提交', name: 'submit',
    },
  ],
  formRules: {},
});

function onReady() {
  //加载一下自定义组件的数据
  formRef.value?.getFormItemControlRef<SimpleSelectValueFormItemRef>('numberProp')?.setData([
    { text: '基础套餐', value: 0 },
    { text: '商业套餐', value: 1 },
    { text: '贵宾套餐', value: 2 },
  ] as IDynamicFormItemSelectValueOption[]);
}

function onSubmit() {
  resultJson.value = JSON.stringify(formModel, undefined, 2);
}

</script>