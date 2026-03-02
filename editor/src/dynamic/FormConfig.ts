import type { FormGroupProps, IDynamicFormItem } from "@imengyu/vue-dynamic-form";
import type { RadioValueFormItemProps, SelectValueFormItemProps } from "@imengyu/vue-dynamic-form-ant";
import type { InputNumberProps } from "ant-design-vue";
import { reactive } from "vue";

export function makeColProps(title: string, key: string) {
  return {
    label: title,
    name: key,
    type: 'object-group',
    defaultValue: () => reactive({
      span: undefined,
      offset: undefined,
    }),
    additionalProps: {
      collapsible: true,
      collapsed: true,
      plain: true,
    } as FormGroupProps,
    childrenColProps: { span: 12 },
    children: [
      {
        label: '占比',
        name: 'span',
        type: 'number',
        additionalProps: {
          min: 0,
          max: 24,
        },
      },
      {
        label: '偏移',
        name: 'offset',
        type: 'number',
        additionalProps: {
          min: 0,
          max: 24,
        },
      }
    ]
  };
}

export const FormConfig : IDynamicFormItem[] = [
  {
    label: '表单标题',
    name: 'name',
    type: 'text',
    additionalProps: {
      placeholder: '请输入表单标题',
    },
  },
  {
    label: '显示冒号',
    name: 'colon',
    type: 'switch',
    additionalProps: {},
  },
  {
    label: '布局',
    name: 'layout',
    type: 'select',
    additionalProps: {
      options: [
        {
          text: '垂直布局',
          value: 'vertical',
        },
        {
          text: '水平布局',
          value: 'horizontal',
        },
      ],
      value: 'vertical',
      customProps: {},
    } as SelectValueFormItemProps,
  },
  {
    label: '标签位置',
    name: 'labelAlign',
    type: 'radio-value',
    additionalProps: {
      options: [
        {
          text: '左侧',
          value: 'left',
        },
        {
          text: '居中',
          value: 'center',
        },
        {
          text: '右侧',
          value: 'right',
        },
      ],
    } as RadioValueFormItemProps,
  },
  {
    label: '标签宽度',
    name: 'labelWidth',
    type: 'number',
    additionalProps: {
      placeholder: '请输入标签宽度',
      min: 0,
      addonAfter: 'px',
    } as InputNumberProps,
  },
  makeColProps('默认标签占比', 'labelCol'),
  makeColProps('默认内容占比', 'wrapperCol'),
]