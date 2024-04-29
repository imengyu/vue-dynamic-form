<template>
  <div>
    <DynamicForm
      ref="formRef"
      :options="formOptions"
      :model="formModel"
      @submit="onSubmit"
    />
    <Button type="primary" long @click="handleLogin" style="margin-top:20px">注册</Button>
  </div>
</template>

<script setup lang="ts">
import { markRaw, ref } from "vue";
import { DynamicForm, type IDynamicFormRef, type IDynamicFormOptions, makeWidget } from "@imengyu/vue-dynamic-form";
import { Button, type FormInstance, type InputInstance } from "@arco-design/web-vue";
import { defaultConfig } from "./ArcoDesgin";
import { Alert, Checkbox, DatePicker, Image, Input, InputNumber, Rate, Switch, Textarea, TimePicker } from "@arco-design/web-vue";

const formOptions : IDynamicFormOptions = {
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
  widgets: {
    'text': makeWidget(markRaw(Input), {}, 'modelValue'),
    'password': makeWidget(markRaw(Input.Password), {}, 'modelValue'),
    'number': makeWidget(markRaw(InputNumber), {}, 'modelValue'),
    'text-area': makeWidget(markRaw(Textarea), {}, 'modelValue'),
    'switch': makeWidget(markRaw(Switch), {}, 'modelValue'),
    'check-box': makeWidget(markRaw(Checkbox), {}, 'modelValue'),
    'rate': makeWidget(markRaw(Rate)),
    'date': makeWidget(markRaw(DatePicker), {}, 'pickerValue'),
    'time': makeWidget(markRaw(TimePicker), {}, 'modelValue'),
    'date-time': makeWidget(markRaw(DatePicker), { showTime: true }),
    'alert': makeWidget(markRaw(Alert)),
    'static-image': makeWidget(markRaw(Image), {}, "src"),
  },
  internalWidgets: defaultConfig.internalWidgets,
  formLabelCol: { span: 6 },
  formWrapperCol: { span: 18 },
  formItems: [
    { type: 'text', label: '手机号', name: 'mobile', additionalProps: { placeholder: '请输入手机号' } as InputInstance['$props'] },
    { 
      type: 'simple-flat', label: '验证码', name: 'vcodeGroup',
      children: [
        { 
          type: 'text', label: '', name: 'vcode', additionalProps: { placeholder: '请输入验证码' } as InputInstance['$props'],
          colProps: { span: 16 },
          formLabelCol: { span: 0 },
          formWrapperCol: { span: 24 },
          formProps: { labelColProps: { span: 0 } }
        },
        { 
          type: 'static-image', label: '', name: 'vcode_image',
          formLabelCol: { span: 0 },
          formWrapperCol: { span: 24 },
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
const formModel = ref({
  mobile: '',
  password: '',
  password_confirm: '',
  authorization_code: '',
  vcode: '',
  vcode_image: 'https://imengyu.top/assets/images/test/1.jpg',
});


function handleLogin() {
  //可以手动获取真实的表单组件实例，调用其验证方法
  (formRef.value?.getFormRef?.() as FormInstance).validate().then((res) => {
    console.log(res); 
    onSubmit();
  }).catch((e) => {
    console.log(e);
  })
}
function onSubmit() {
  console.log(formModel.value);
}
</script>