# 自定义渲染

如果你需要在某个表单中插入高度自定义，不通用的内容，例如一个按钮，一个表格，一张图片等等，你可以使用动态表单提供的插槽 formCeil 进行某个条目的自定义渲染。

## 自定义渲染只读条目

你只需要将自定义条目类型设置为 `'custom'` 即可。

你需要实现 formCeil 插槽，根据 name (完整路径) 或者 item.name (名称) 判断当前是不是需要渲染的条目，如果是，则渲染自定内容。

```vue preview
<template>
  <DynamicForm
    ref="formRef"
    :options="formOptions"
    :model="formModel"
  >
    <template #formCeil="{ name, item, model, onModelUpdate }">
      <template v-if="item.name == 'test_custom_render'">
        <Row>
          <Col>
            <Avatar :imageUrl="model.avata" />
          </Col>
          <Col style="text-align: left;margin-left: 10px;">
            <span style="font-size: 18px; margin-bottom: 4px;">{{ model.name }} (自定义渲染+仅展示)</span>
            <span>这在展示的表单中非常有用，你可以在这里面嵌入表格等等其他组件</span>
          </Col>
        </Row>
        <br>
      </template>
    </template>
  </DynamicForm>
  <h5>表单数据：</h5>
  {{ JSON.stringify(toRaw(formModel)) }}
</template>

<script setup lang="ts">
import { reactive, ref, toRaw } from 'vue'
import { DynamicForm, type IDynamicFormOptions, Row, Col } from '@imengyu/vue-dynamic-form';
import { Avatar } from '@arco-design/web-vue';

const formModel = reactive({
  test_custom_render: {
    name: '测试用户',
    avatar: 'https://imengyu.top/assets/images/test/2.jpg',
  },
});
const formOptions : IDynamicFormOptions = {
  formItems: [
    { type: 'custom', label: '', name: 'test_custom_render' },
  ],
};

</script>
```

## 自定义渲染+双向绑定数据

同样，自定义渲染插槽也支持数据双向绑定。

```vue preview
<template>
  <DynamicForm
    ref="formRef"
    :options="formOptions"
    :model="formModel"
  >
    <template #formCeil="{ item, model, onModelUpdate }">
      <template v-if="item.name == 'test_custom_check'">
        <Checkbox :modelValue="model" @update:modelValue="onModelUpdate">
          我已阅读并同意
          <a href="/" target="_blank">《用户服务协议》</a>
          (自定义渲染+数据绑定)
        </Checkbox>
      </template>
      <template v-else>
        {{item.name}}
      </template>
    </template>
  </DynamicForm>
  <h5>表单数据：</h5>
  {{ JSON.stringify(formModel) }}
</template>

<script setup lang="ts">
import { reactive, ref, toRaw } from 'vue'
import { DynamicForm, type IDynamicFormOptions } from '@imengyu/vue-dynamic-form';
import { Checkbox } from '@arco-design/web-vue';

const formOptions = {
  formItems: [
    { type: 'custom', label: '', name: 'test_custom_check' },
  ],
};
const formModel = reactive({
  test_custom_check: false,
});
</script>
```
