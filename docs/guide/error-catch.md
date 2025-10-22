# 错误提示与处理

<script>
import BasicUseageDocErrorBasicObject from '../examples/BasicUseageDocErrorBasicObject.vue'
import BasicUseageDocErrorMissing from '../examples/BasicUseageDocErrorMissing.vue'
import BasicUseageDocErrorItems from '../examples/BasicUseageDocErrorItems.vue'

</script>

## 内置错误提示

表单设计了错误提示与处理机制，当表单数据出现异常时，会显示详细错误提示，包含键名等信息方便排查错误。

也可选择屏蔽数据错误，使用设定默认值继续编辑。

### 顶层对象错误

出现于顶层 DynamicForm 组件，当传入的 model 不是对象时，会显示警告提示。

此错误允许屏蔽，通过设置 `options.suppressRootError` 为 `true` 可以屏蔽此错误，这时表单会使用一个空对象作为模型。

<BasicUseageDocErrorBasicObject />

### 条目数据错误

出现于条目中，当输入了错误的数据时，会显示警告提示。

为空（null或者undefined）时，允许屏蔽，通过设置 `options.suppressEmptyError` 或 `formItem.suppressEmptyError` 为 `true` 可以屏蔽此错误，这时表单会使用 `defaultValue` 填充数据。

<BasicUseageDocErrorItems />

### 缺失组件错误

出现于条目中，当指定的组件类型不存在时，会显示警告提示。

<BasicUseageDocErrorMissing />

## 数据默认值

表单允许为每个条目设置默认值，当数据为空时，会使用默认值填充。但此操作仅用于最后兜底处理，正常数据初始化应该在外部完成。

可调用表单实例 `initDefaultValuesToModel` 方法初始化默认值到模型。

```vue preview
<template>
  <div class="example-container">
    <DynamicForm
      ref="formRef"
      :options="formOptions"
      :model="formModel"
    />
    <textarea class="demo-result" style="width: 100%;height: 110px;" readonly>{{ JSON.stringify(formModel, null, 2) }}</textarea>
  </div>
</template>

<script setup lang="ts">
import { DynamicForm, IDynamicFormOptions, defaultDynamicFormInternalWidgets, IDynamicFormRef } from '@imengyu/vue-dynamic-form';
import { ref, nextTick, onMounted } from 'vue'

const formRef = ref<IDynamicFormRef>(null);
const formModel = ref({
  name: null,
  count: null,
});
const formOptions : IDynamicFormOptions = {
  internalWidgets: defaultDynamicFormInternalWidgets,
  formLabelCol: { span: 8 },
  formWrapperCol: { span: 16 },
  formItems: [
    { 
      type: 'base-text', 
      label: '名字', 
      name: 'name', 
      additionalProps: { placeholder: '请输入名称' },
      defaultValue: 'hello',
    },
    { 
      type: 'base-text', 
      label: '数量', 
      name: 'count', 
      defaultValue: '123',
    },
  ],
  formRules: {},
};

onMounted(() => {
  nextTick(() => {
    formRef.value.initDefaultValuesToModel();
  });
});
</script>

```

