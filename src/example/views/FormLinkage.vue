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
          @ready="onReady"
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
import { BaseRadioProps, DynamicForm, IDynamicFormItemCallbackAdditionalProps, IDynamicFormObject, IDynamicFormOptions, IDynamicFormRef } from '@/lib/main';
import { markRaw, ref, watch } from 'vue'

import { Codemirror } from 'vue-codemirror';
import { json } from '@codemirror/lang-json';
import { defaultConfig } from './IngrateArcoDesgin';
import { FormInstance, InputInstance } from '@arco-design/web-vue';
import { IDynamicFormItemSelectValueOption, SimpleSelectValueFormItemRef } from './MySelect';
import MySelect from './MySelect.vue';

const editorExtensions = [json()];
const editorJson = ref('');
const editorHasError = ref('');


const formRef = ref<IDynamicFormRef>();
const formModel = ref({
  mobile: '',
  enterprise_name: '',
  password: '',
  password_confirm: '',
  authorization_code: '',
  vcode: '',
  vcode_image: 'https://imengyu.top/assets/images/test/1.jpg',
  isEnterprise: false,
  type: 1,
  item_id: 0 as number|null,
});
const formOptions : IDynamicFormOptions = {
  ...defaultConfig,
  widgets: {
    'my-select': {
      componentInstance: markRaw(MySelect),
      valueName: 'value',
      additionalProps: {},
    },
  },
  formRules: {
    enterprise_name: [{ required: true, message: '请输入企业全称' } ],
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
    { type: 'check-box', label: '企业用户', name: 'isEnterprise' },
    {
      hidden: { callback: (_, rawModel) => (rawModel as IDynamicFormObject).isEnterprise === true },
      type: 'text', label: '手机号', name: 'mobile', additionalProps: { placeholder: '请输入手机号' } as InputInstance['$props'],
    },
    {
      hidden: { callback: (_, rawModel) => (rawModel as IDynamicFormObject).isEnterprise === false },
      type: 'text', label: '企业全称', name: 'enterprise_name', additionalProps: { placeholder: '请输入企业全称' } as InputInstance['$props'],
    },
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
    {
      type: 'text', 
      label: { callback: (_, rawModel) => (rawModel as IDynamicFormObject).isEnterprise === true ? '企业授权ID' : '授权密码' },
      name: 'authorization_code',
      additionalProps: {
        placeholder: { callback: (_, rawModel) => (rawModel as IDynamicFormObject).isEnterprise === true ? '请输入企业授权ID，授权ID请咨询客服电话' : '请输入授权密码' },
      } as IDynamicFormItemCallbackAdditionalProps<InputInstance['$props']>
    },
    { 
      type: 'base-radio', label: '会员类型', name: 'type', 
      additionalProps: {
        items: [
          { label: '短期', value: 1 },
          { label: '长期', value: 2 },
          { label: '试用', value: 3 },
        ]
      } as BaseRadioProps,
    },
    {
      type: 'my-select', label: '选择套餐', name: 'item_id', 
      additionalProps: { placeholder: '请选择套餐' },
    },
  ],
};

function loadPackageSelect(newType: number) {
  //这里是写死手动判断了，实际在这里你可以去请求后端数据
  let newData = [] as IDynamicFormItemSelectValueOption[];
  switch (newType) {
    case 1:
      newData = [
        { text: '短期合作套餐', value: 0 },
        { text: '短期高级套餐', value: 1 },
      ];
      break;
    case 2:
      newData = [
        { text: '基础套餐', value: 0 },
        { text: '商业套餐', value: 1 },
        { text: '贵宾套餐', value: 2 },
      ];
      break;
    case 3:
      newData = [
        { text: '试用套餐', value: 0 },
      ];
      break;
  }
  //更改后调用实例方法，重新加载数据
  formRef.value?.getFormItemControlRef<SimpleSelectValueFormItemRef>('item_id')?.setData(newData);

  formModel.value.item_id = null;
}

//监听 type 属性的更改
watch(() => formModel.value.type, (newType) => {
  //更改后重新加载数据
  loadPackageSelect(newType);
});
function onReady() {
  //初始化的时候也加载一下数据
  loadPackageSelect(1);
}

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