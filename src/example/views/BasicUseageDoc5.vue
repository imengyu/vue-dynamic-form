<template>
  <div>
    <DynamicForm
      :options="formOptions"
      :model="formModel"
    />
  </div>
</template>

<script setup lang="ts">
import { BaseRadioProps, BaseSelectProps, DynamicForm, IDynamicFormOptions } from '../../lib/main';
import { ref, watch } from 'vue'

const formModel = ref({
  type: 1,
  item_id: 0 as number|null,
});
const formOptions : IDynamicFormOptions = {
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
};

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
  formModel.value.item_id = null;
}

//监听 type 属性的更改
watch(() => formModel.value.type, (newType) => {
  //更改后重新加载数据
  loadPackageSelect(newType);
});
</script>