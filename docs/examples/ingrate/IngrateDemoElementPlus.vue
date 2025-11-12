<template>
  <div>
    <DynamicForm
      ref="formRef"
      :options="formOptions"
      :model="formModel"
      @submit="onSubmit"
    />
    <ElButton type="primary" long @click="handleLogin" style="margin-top:20px">注册</ElButton>
  </div>
</template>

<script setup lang="ts">
import { markRaw, ref } from "vue";
import { DynamicForm, type IDynamicFormRef, type IDynamicFormOptions, makeWidget } from "@imengyu/vue-dynamic-form";
import { 
  ElAlert, ElCheckbox, ElDatePicker, 
  ElImage, ElInput, ElInputNumber, 
  ElRate, ElSwitch, ElTimePicker, ElButton,
  FormInstance,
  InputProps
} from "element-plus";
import { defaultConfig } from './ElementPlus'

const formOptions : IDynamicFormOptions = {
  widgets: {
    'text': makeWidget(markRaw(ElInput), {}, 'modelValue'),
    'password': makeWidget(markRaw(ElInput), { showPassword: true }, 'modelValue'),
    'number': makeWidget(markRaw(ElInputNumber), {}, 'modelValue'),
    'text-area': makeWidget(markRaw(ElInput), { type: "textarea", rows: 2 }, 'modelValue'),
    'switch': makeWidget(markRaw(ElSwitch), {}, 'modelValue'),
    'check-box': makeWidget(markRaw(ElCheckbox), {}, 'modelValue'),
    'rate': makeWidget(markRaw(ElRate)),
    'date': makeWidget(markRaw(ElDatePicker), {}, 'pickerValue'),
    'time': makeWidget(markRaw(ElTimePicker), {}, 'modelValue'),
    'date-time': makeWidget(markRaw(ElDatePicker), { showTime: true }),
    'alert': makeWidget(markRaw(ElAlert)),
    'static-image': makeWidget(markRaw(ElImage), {}, "src"),
  },
  internalWidgets: defaultConfig.internalWidgets,
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
  formAdditionaProps: {
    labelPosition: 'right',
  },
  formLabelCol: 200,
  formItems: [
    { type: 'text', label: '手机号', name: 'mobile', additionalProps: { placeholder: '请输入手机号' } as InputProps },
    { 
      type: 'flat-simple', label: '验证码', name: 'vcodeGroup',
      children: [
        { 
          type: 'text', label: '', name: 'vcode', additionalProps: { placeholder: '请输入验证码' } as InputProps,
          colProps: { span: 16 },
          formLabelCol: 0,
        },
        { 
          type: 'static-image', label: '', name: 'vcode_image',
          formLabelCol: 0,
          colProps: { span: 8 },
          additionalProps: {
            style: {
              width: '100%',
              height: '32px',
            }
          },
        },
      ]
    },
    { type: 'password', label: '密码', name: 'password', additionalProps: { placeholder: '请输入密码' } as InputProps },
    { type: 'password', label: '确认密码', name: 'password_confirm', additionalProps: { placeholder: '请再输入一次密码' } as InputProps },
    { type: 'text', label: '授权密码', name: 'authorization_code', additionalProps: { placeholder: '请输入授权码' } as InputProps },
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