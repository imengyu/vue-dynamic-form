<template>
  <div>
    <div class="demo-row">
      <div class="demo-col" style="width:50%;padding:20px;text-align:center;">
        <h1>注册</h1>
        <DynamicForm
          ref="formRef"
          :options="formOptions"
          :model="formModel"
          @submit="onSubmit"
        >
          <template #formCeil="{ item, model, onModelUpdate }">
            <template v-if="item.name == 'test_custom_render'">
              <div class="demo-row">
                <a-avatar :imageUrl="model.avata" />
                <div class="demo-col" style="text-align: left;margin-left: 10px;">
                  <span style="font-size: 18px; margin-bottom: 4px;">{{ model.name }} (自定义渲染+仅展示)</span>
                  <span>这在展示的表单中非常有用，你可以在这里面嵌入表格等等其他组件</span>
                </div>
              </div>
              <br>
            </template>
            <template v-else-if="item.name == 'test_custom_check'">
              <a-checkbox :modelValue="model" @update:modelValue="onModelUpdate">
                我已阅读并同意
                <a href="/" target="_blank">《用户服务协议》</a>
                (自定义渲染+数据绑定)
              </a-checkbox>
            </template>
            <template v-else>
              {{item.name}}
            </template>
          </template>
        </DynamicForm>
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
import { FormInstance, InputInstance } from '@arco-design/web-vue';

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
  test_custom_render: {
    name: '测试用户',
    avatar: 'https://imengyu.top/assets/images/test/2.jpg',
  },
  test_custom_check: false,
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
    { type: 'custom', label: '', name: 'test_custom_check' },
    { type: 'custom', label: '', name: 'test_custom_render' },
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