<template>
  <div>
    <DynamicForm
      :options="formOptions"
      :model="formModel"
    />
  </div>
</template>

<script setup lang="ts">
import { DynamicForm, IDynamicFormObject, IDynamicFormOptions, renderTextDefaultSlot } from '@imengyu/vue-dynamic-form';
import { reactive } from 'vue'

const formModel = reactive({
  mobile: '',
  enterprise_name: '',
  enterprise_id: '',
  password: '',
  password_confirm: '',
  authorization_code: '',
  isEnterprise: false,
});
const formOptions : IDynamicFormOptions = {
  formRules: {
    enterprise_name: [{ required: true, message: '请输入企业全称' } ],
    enterprise_id: [{ required: true, message: '请输入企业全称' } ],
    mobile: [{ required: true, message: '请输入手机号' } ],
    password: [{ required: true, message: '请输入密码' } ],
    vcode: [{ required: true, message: '请输入验证码' } ],
    password_confirm: [
      { required: true, message: '请再输入一次密码' },
      { validator: ( rule: unknown, value: unknown, callback: (error?: string) => void ) => {
          if (value !== formModel.password)
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
      type: 'text', label: '手机号', name: 'mobile', additionalProps: { placeholder: '请输入手机号' },
    },
    {
      hidden: { callback: (_, rawModel) => (rawModel as IDynamicFormObject).isEnterprise === false },
      type: 'text', label: '企业全称', name: 'enterprise_name', additionalProps: { placeholder: '请输入企业全称' },
    },
    {
      hidden: { callback: (_, rawModel) => (rawModel as IDynamicFormObject).isEnterprise === false },
      type: 'text', label: '统一社会信用代码', name: 'enterprise_id', additionalProps: { placeholder: '请输入企业统一社会信用代码' },
    },
    { type: 'text', label: '密码', name: 'password', additionalProps: { placeholder: '请输入密码', password: true } },
    { type: 'text', label: '确认密码', name: 'password_confirm', additionalProps: { placeholder: '请再输入一次密码', password: true } },
    {
      type: 'text', 
      label: { callback: (_, rawModel) => (rawModel as IDynamicFormObject).isEnterprise === true ? '企业授权ID' : '授权密码' },
      name: 'authorization_code',
      additionalProps: {
        placeholder: { callback: (_: unknown, rawModel: IDynamicFormObject) => rawModel.isEnterprise === true ? '请输入企业授权ID，授权ID请咨询客服电话' : '请输入授权密码' },
      }
    },
    { 
      type: 'button', label: '提交', name: 'submit',
      additionalSlot: {
        ...renderTextDefaultSlot('提交'),
      },
    },
  ],
};
</script>