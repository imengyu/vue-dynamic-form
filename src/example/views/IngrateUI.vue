<template>
  <div>
    <div class="demo-row">
      <div class="demo-col" style="width:50%;padding:20px;text-align:center;">
        <div class="demo-alert">这是与 <a href="https://arco.design/vue/docs/start" target="_blank">arco design vue</a> 
          配合使用的案例，你也可以使用其他组件库例如 ant desgin vue、element等等，具体请参考文档。
        </div>
        <h1>注册</h1>
        <DynamicForm
          ref="formRef"
          :options="formOptions"
          :model="formModel"
          @submit="onSubmit"
        />
        <a-button type="primary" long @click="handleLogin" style="margin-top:20px">注册</a-button>
      </div>
      <div class="demo-col" style="width:50%;">
        <div class="demo-row">
          <button @click="onApplyClick">&lt;&lt; 应用JSON至表单 model 上</button>
          <button @click="onSubmit">&gt;&gt; 从表单 model 获取数据显示</button>
        </div>
        <div :class="'demo-alert '+(editorHasError?'error':'success')">{{  editorHasError || '格式没问题' }}</div>
        <codemirror
          v-model="editorJson"
          placeholder="请点击提交按钮获取表单提交数据"
          :style="{ height: '600px', width: '100%' }"
          :autofocus="true"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="editorExtensions"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DynamicForm, IDynamicFormOptions, IDynamicFormRef } from '@/lib/main';
import { ref } from 'vue'

import { Codemirror } from 'vue-codemirror';
import { json } from '@codemirror/lang-json';
import { defaultConfig } from './IngrateArcoDesgin';
import { CascaderInstance, FormInstance, InputInstance } from '@arco-design/web-vue';

const editorExtensions = [json()];
const editorJson = ref('');
const editorHasError = ref('');

const formModel = ref({
  mobile: '',
  password: '',
  password_confirm: '',
  authorization_code: '',
  vcode: '',
  vcode_image: 'https://imengyu.top/assets/images/test/1.jpg',
});
const formOptions : IDynamicFormOptions = {
  ...defaultConfig,
  formRules: {
    mobile: [{ required: true, message: '请输入手机号' } ],
    password: [{ required: true, message: '请输入密码' } ],
    vcode: [{ required: true, message: '请输入验证码' } ],
    password_confirm: [
      { required: true, message: '请再输入一次密码' },
      { validator: ( value: unknown, callback: (error?: string) => void ) => {
          if (value !== formModel.value.password)
            callback('两次密码输入不一致，请重新输入');
          else
            callback();
      } }
    ],
    authorization_code: [{ required: true, message: '请输入授权码' } ],
  },
  formLabelCol: { span: 6 },
  formWrapperCol: { span: 18 },
  formItems: [
    { type: 'text', label: '手机号', name: 'mobile', additionalProps: { placeholder: '请输入手机号' } as InputInstance['$props'] },
    { 
      type: 'simple-flat', label: '验证码', name: 'vcode',
      children: [
        { 
          type: 'text', label: '', name: 'vcode', additionalProps: { placeholder: '请输入验证码' } as InputInstance['$props'],
          colProps: { span: 16 },
          formProps: { labelColProps: { span: 0 } }
        },
        { 
          type: 'static-image', label: '', name: 'vcode_image',
          formProps: { labelColProps: { span: 0 }, wrapperColProps: { span: 24 }  },
          colProps: { span: 8 },
          additionalProps: {
            width: '100%',
            height: '32px',
          },
        },
      ]
    },
    { type: 'password', label: '密码', name: 'password', additionalProps: { placeholder: '请输入密码' } as InputInstance['$props'] },
    { type: 'password', label: '确认密码', name: 'password_confirm', additionalProps: { placeholder: '请再输入一次密码' } as InputInstance['$props'] },
    { type: 'text', label: '授权密码', name: 'authorization_code', additionalProps: { placeholder: '请输入授权码' } as InputInstance['$props'] },
  ],
};

const formRef = ref<IDynamicFormRef>();

function handleLogin() {
  (formRef.value?.getFormRef?.() as FormInstance).validate().then((res) => {
    console.log(res); 
    onSubmit();
  }).catch((e) => {
    console.log(e);
  })
}
function onSubmit() {
  editorJson.value = JSON.stringify(formModel.value, undefined, 2);
}
function onApplyClick() {
  try {
    const newObj = JSON.parse(editorJson.value);
    formModel.value = newObj;
    editorHasError.value = '';
  } catch (e) {
    editorHasError.value = '' + e;
  }
}
</script>