# 表单联动

<script setup>
import DynamicFormBasicUseage3 from '../examples/BasicUseageDocBasicLinkage.vue'
import DynamicFormBasicUseage4 from '../examples/BasicUseageDocCheckLinkage.vue'
import DynamicFormBasicUseage5 from '../examples/BasicUseageDocSelectLinkage.vue'
</script>

表单组件间的联动是开发中普遍的问题，希望能保持简洁易用的同时支持联动。

IDynamicFormItem 表单项的以下属性支持传入回调，在回调中你可以自由判断，决定需要返回何值：

|属性名|类型|说明|
|--|--|--|
|hidden|boolean|显是否隐藏当前表单项|
|disabled|boolean|是否禁用当前表单项|
|label|string|当前表单说明文字|
|additionalProps|object|附加组件属性(只支持第一级传入回调)|

回调定义：

|属性名|类型|说明|
|--|--|--|
|model|unknown|当前表单条目的值|
|rawModel|unknown|整个 form 的值 （最常用，当两个关联组件距离较远时，可以从顶层的 rawModel 里获取）|
|parentModel|unknown|父表单元素的值 （上一级的值，只在列表场景的使用，例如列表某个元素的父级就是整个 item）|
|item|IDynamicFormItem|当前表单条目信息|
|formRules|Record&lt;string, Rule&gt;|当前条目校验数据|

## 示例

根据表单的数据去控制表单项是否显示。

```ts
const formModel = reactive({
  stringProp: '',
  booleanProp: false,
});
const formOptions = ref<IDynamicFormOptions>({
  formItems: [
    {
      type: 'base-check', label: '展示更多内容', name: 'booleanProp',
      additionalProps: {
        text: '显示',
      },
    },
    {
      hidden: { callback: (_, model) => (model as IDynamicFormObject).booleanProp == false },
      type: 'base-text', label: '文本', name: 'stringProp', additionalProps: { placeholder: '请输入文本' },
    },
  ],
});
```

效果：

<DynamicFormBasicUseage3 />

## 复杂案例

```js
const formModel = ref({
  mobile: '',
  enterprise_name: '',
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
    { type: 'base-check', label: '企业用户', name: 'isEnterprise' },
    {
      hidden: { callback: (_, rawModel) => (rawModel as IDynamicFormObject).isEnterprise === false },
      type: 'base-text', label: '手机号', name: 'mobile', additionalProps: { placeholder: '请输入手机号' },
    },
    {
      hidden: { callback: (_, rawModel) => (rawModel as IDynamicFormObject).isEnterprise === true },
      type: 'base-text', label: '企业全称', name: 'enterprise_name', additionalProps: { placeholder: '请输入企业全称' },
    },
    {
      hidden: { callback: (_, rawModel) => (rawModel as IDynamicFormObject).isEnterprise === true },
      type: 'base-text', label: '统一社会信用代码', name: 'enterprise_id', additionalProps: { placeholder: '请输入企业统一社会信用代码' },
    },
    { type: 'base-text', label: '密码', name: 'password', additionalProps: { placeholder: '请输入密码', password: true },
    { type: 'base-text', label: '确认密码', name: 'password_confirm', additionalProps: { placeholder: '请再输入一次密码', password: true },
    {
      type: 'base-text', 
      label: { callback: (_, rawModel) => (rawModel as IDynamicFormObject).isEnterprise === true ? '企业授权ID' : '授权密码' },
      name: 'authorization_code',
      additionalProps: {
        placeholder: { callback: (_, rawModel) => (rawModel as IDynamicFormObject).isEnterprise === true ? '请输入企业授权ID，授权ID请咨询客服电话' : '请输入授权密码' },
      } as IDynamicFormItemCallbackAdditionalProps<BaseInputProps>
    },
  ],
};
```

完整源代码可以参考 [这里](https://github.com/imengyu/vue-dynamic-form/blob/master/src/examples/FormLinkage.vue)。

效果：

<DynamicFormBasicUseage4 />

## 完全自定义

如果涉及到值的联动，或者极其复杂的表单展示联动，你也可以通过监听数据变化，然后执行你的自定义操作，达到联动的效果，例如，
下方是一个表单联动例子，他的效果是当 type 更改时，更改 item_id 的 options （也可以去后端加载数据）。

```ts

import { BaseRadioProps, BaseSelectProps, DynamicForm, IDynamicFormOptions } from '@imengyu/vue-dynamic-form';
import { ref, reactive, watch } from 'vue'

const formModel = ref({
  type: 1,
  item_id: 0 as number|null,
});
const formOptions = reactive<IDynamicFormOptions>({
  formRules: {},
  formLabelCol: { span: 6 },
  formWrapperCol: { span: 18 },
  formItems: [
    { 
      type: 'base-radio', label: '会员类型', name: 'type', 
      additionalProps: {
        items: [
          { label: '短期', value: 1 },
          { label: '长期', value: 2 },
          { label: '试用', value: 3 },
        ]
      } as BaseRadioProps,
      watch: (oldv, newV) => {
        //也可以为条目设置watch
        //loadPackageSelect(newV);
        console.log('会员类型更改：', oldv, newV);
      },
    },
    {
      type: 'base-select', label: '选择套餐', name: 'item_id', 
      additionalProps: {
        options: [
          { text: '短期合作套餐', value: 0 },
          { text: '短期高级套餐', value: 1 },
        ],
      } as BaseSelectProps,
    },
  ],
});

function loadPackageSelect(newType: number) {
  //这里是写死手动判断了，实际在这里你可以去请求后端数据
  switch (newType) {
    case 1:
      (formOptions.formItems[1].additionalProps as BaseSelectProps).options = [
        { text: '短期合作套餐', value: 0 },
        { text: '短期高级套餐', value: 1 },
      ];
      break;
    case 2:
      (formOptions.formItems[1].additionalProps as BaseSelectProps).options = [
        { text: '基础套餐', value: 0 },
        { text: '商业套餐', value: 1 },
        { text: '贵宾套餐', value: 2 },
      ];
      break;
    case 3:
      (formOptions.formItems[1].additionalProps as BaseSelectProps).options = [
        { text: '试用套餐', value: 0 },
      ];
      break;
  }
  //清空之前的选择好让用户重新选择
  formModel.value.item_id = null;
}

//监听 type 属性的更改
watch(() => formModel.value.type, (newType) => {
  //更改后重新加载数据
  loadPackageSelect(newType);
});
```

效果：

<DynamicFormBasicUseage5 />
