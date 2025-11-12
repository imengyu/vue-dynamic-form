# 绑定组件

vue-dynamic-form 不带复杂的表单组件，不与任何UI库耦合。因此您可以选择安装自己喜欢的UI框架或其他库，
使用UI库的表单组件，需要将其绑定后即可在动态表单中使用。

推荐：

* [Ant Design Vue](https://www.antdv.com/docs/vue/getting-started-cn)
* [arco.design Vue](https://arco.design/vue/docs/start)
* [Element plus](https://element-plus.gitee.io/zh-CN/guide/installation.html)

## 步骤

这里以 arco.design Vue 为例，展示如何绑定组件。

首先参考 [arco.design Vue](https://arco.design/vue/docs/start) 文档将其安装。

然后在 main.js 中注册你需要的组件：

```js
import { markRaw } from "vue";
import { Alert, Checkbox, DatePicker, Form, FormItem, Image, Input, InputNumber, Rate, Switch, Textarea, TimePicker } from "@arco-design/web-vue";
import { DynamicFormItemRegistry, type IDynamicFormOptions, configDefaultDynamicFormOptions } from "@imengyu/vue-dynamic-form";

createApp(App)
  .mount('#app')
  .$nextTick(() => {
    registerAllFormComponents();
  });

//这个函数请保证全局只注册一次
function registerAllFormComponents() {
  //1. 配置 Form 与 FormItem
  //
  //当你使用了自定义UI框架，别忘记替换默认的 Form 和 FormItem 为UI框架中的 Form 和 FormItem，
  //这样才能让表单工作正常（因为表单渲染、数据校验等等功能，这部分功能由UI框架提供）。
  configDefaultDynamicFormOptions({
    internalWidgets: {
      Form: {
        component: markRaw(Form),
        propsMap: {
          //每个UI框架的属性名称有点不一样，你需要根据对应的文档重新映射对应的属性名称
          //右边是组件对应的属性名称
          rules: 'rules',
          wrapperCol: 'wrapper-col-props',
          labelCol: 'label-col-props',
        },
      },
      FormItem: {
        component: markRaw(FormItem),
        propsMap: {
          name: 'field',
        },
      },
    },
  });

  //2. 注册你需要使用的库组件。当然，这里也可以注册自己自定义的组件
  //第1个参数是：在表单定义中使用时的名称，请保证不重复。
  //第2个参数是：组件的类实例。
  //第3个参数是：组件的默认参数, 每一个组件创建时都会继承此默认参数。在表单定义中传入的 additionalProps 优先级比此高，会覆盖默认参数。
  //第4个参数是：组件的双向绑定 modelValue 字段名称，这个value用于双向绑定表单的值，当你的组件主 modelValue 名称不一致时，
  //            例如有些复选框双向绑定字段名称是checked，可以重新指定。
  //
  //注册自定义组件请参考下方章节
  DynamicFormItemRegistry
    .register('text', markRaw(Input), {}, 'modelValue')
    .register('password', markRaw(Inpu.tPassword), {}, {}, 'modelValue')
    .register('number', markRaw(InputNumber), {}, 'modelValue')
    .register('text-area', markRaw(Textarea), {}, 'modelValue')
    .register('switch', markRaw(Switch), {}, 'modelValue')
    .register('check-box', markRaw(Checkbox), {}, 'modelValue')
    .register('date', markRaw(DatePicker), {}, 'pickerValue')
    .register('time', markRaw(TimePicker), {}, 'modelValue')
    .register('date-time', markRaw(DatePicker), { showTime: true }, 'pickerValue');
}
```

然后你就可以在表单中使用刚刚注册的组件了，

```vue preview
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
import { ref } from "vue";
import { DynamicForm, type IDynamicFormRef, type IDynamicFormOptions } from "@imengyu/vue-dynamic-form";
import { Button, type FormInstance, type InputInstance } from "@arco-design/web-vue";

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
  formLabelCol: { span: 6 },
  formWrapperCol: { span: 18 },
  formItems: [
    { type: 'text', label: '手机号', name: 'mobile', additionalProps: { placeholder: '请输入手机号' } as InputInstance['$props'] },
    { 
      type: 'flat-simple', label: '验证码', name: 'vcodeGroup',
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
```

## 案例

作者为你写了下面几个热门库的案例，你也可以复制到你自己的项目中使用，
对于其他组件库，如果有对应的表单组件，也可以按上方步骤自己注册使用。

::: warning
有些库可能不支持某些字段，例如Element plus不支持表单的内容宽度占比调整。
:::

* [Ant Design Vue](./ingrate-ant-design.md)
* [arco.design Vue](./ingrate-arco-design.md)
* [Element plus](./ingrate-element.md)

## 注册自定义组件

注册自定义组件与注册UI库的组件一致，你只需使用 DynamicFormItemRegistry 注册即可使用：

```js
import MyFormComponent from './MyFormComponent.vue';

DynamicFormItemRegistry.register('my-cmponent-name', markRaw(MyFormComponent), {}, 'modelValue');
```

注意，在写自定义组件时请处理与表单/动态表单的数据关系。具体请参考 [自定义组件](./custom-control.md)。
