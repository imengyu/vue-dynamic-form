import type { FormGroupProps, IDynamicFormItem } from "@imengyu/vue-dynamic-form"
import type { RadioValueFormItemProps, SelectValueFormItemProps } from "@imengyu/vue-dynamic-form-ant";
import type { InputNumberProps } from "ant-design-vue";
import type { RuleItem } from "async-validator";
import { reactive } from "vue";

export interface FormItemDef {
  label: string,
  name: string,
  configs: IDynamicFormItem[],
  icon: string,
  /**
   * 期望的类型
   */
  expectType?: string,
  /**
   * 额外的标签属性
   * * data-id
   * * data-int
   */
  extraTag?: string,
  /**
   * 是否是容器项
   * @default false
   */
  isContainer?: boolean,
  /**
   * 是否是容器项的单子项条目
   * @default false
   */
  isContainerSingle?: boolean,
}

function makeColProps(title: string, key: string) {
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
export const FormItemCommonConfig : IDynamicFormItem[] = [
  {
    label: '标签',
    name: 'label',
    type: 'text',
    additionalProps: {
      placeholder: '请输入标签',
    },
  },
  {
    label: '必填',
    name: 'required',
    type: 'switch',
    additionalProps: {},
  },
]
export const FormItemLastCommonConfig : IDynamicFormItem[] = [
  {
    label: '表单验证',
    name: 'validator',
    type: 'flat-group',
    additionalProps: {
      collapsible: true,
      plain: true,
      titleStyle: 'large',
    } as FormGroupProps,
    children: [
      {
        label: '验证规则',
        name: 'rules',
        type: 'array-object',
        formLabelCol: { span: 24 },
        formWrapperCol: { span: 24 },
        defaultValue: () => reactive([]),
        newChildrenObject(arrayNow) {
          arrayNow.push({
            required: true,
            message: '请输入值',
            enum: [],
          } as RuleItem)
        },
        colProps: { span: 24 },
        childrenColProps: { span: 24 },
        childrenFormLabelCol: { span: 8 },
        childrenFormWrapperCol: { span: 14 },
        children: [
          {
            label: '必填',
            name: 'required',
            type: 'switch',
            additionalProps: {},
          },
          {
            label: '验证消息',
            name: 'message',
            type: 'text',
            additionalProps: {
              placeholder: '请输入验证消息',
            },
          },
          {
            label: '类型',
            name: 'type',
            type: 'select',
            additionalProps: {
              options: [
                {
                  text: '字符串',
                  value: 'string',
                },
                {
                  text: '数字',
                  value: 'number',
                },
                {
                  text: '布尔值',
                  value: 'boolean',
                },
                {
                  text: '数组',
                  value: 'array',
                },
                {
                  text: '对象',
                  value: 'object',
                },
              ],
              value: 'string',
              customProps: {},
            } as SelectValueFormItemProps,
          },
          {
            label: '长度',
            name: 'length',
            type: 'number',
            additionalProps: {
              min: 0,
              max: 1000,
              placeholder: '请输入长度',
            },
          },
          {
            label: '正则表达式',
            name: 'pattern',
            type: 'text',
            additionalProps: {
              placeholder: '请输入正则表达式',
            },
          },
          {
            label: '最小值',
            name: 'min',
            type: 'number',
            additionalProps: {
              min: 0,
              max: 1000,
            },
          },
          {
            label: '最大值',
            name: 'max',
            type: 'number',
            additionalProps: {
              min: 0,
              max: 1000,
            },
          },
          {
            label: '枚举值',
            name: 'enum',
            type: 'array-single',
            defaultValue: () => reactive([]),
            additionalProps: {
              placeholder: '请输入枚举值',
            },
            newChildrenObject(arrayNow) {
              arrayNow.push('')
            },
            children: [
              {
                label: '值',
                name: 'enum',
                type: 'text',
                additionalProps: {
                  placeholder: '请输入枚举值',
                },
              },
            ]
          },
        ],
      },
    ],
  },
  {
    label: '样式',
    name: 'style',
    type: 'flat-group',
    additionalProps: {
      collapsible: true,
      plain: true,
      titleStyle: 'large',
    } as FormGroupProps,
    childrenColProps: { span: 24 },
    children: [
      makeColProps('占比父级', 'colProps'),
      makeColProps('标签占比', 'formLabelCol'),
      makeColProps('内容占比', 'formWrapperCol'),
    ],
    
  },
  {
    label: '事件',
    name: 'events',
    type: 'flat-group',
    additionalProps: {
      collapsible: true,
      plain: true,
      titleStyle: 'large',
    } as FormGroupProps,
    children: [

    ],
  }
]

export const FormItems : {
  label: string,
  items: FormItemDef[]
}[] = [
  {
    label: '基础',
    items: [
      {
        label: '文本框',
        icon: 'icon-keshihuapingtaiicon_shurukuang',
        name: 'text',
        expectType: 'string',
        configs: [
          {
            label: '占位符',
            name: 'placeholder',
            type: 'text',
            additionalProps: {
              placeholder: '请输入占位符',
            },
          },
          {
            label: '最大长度',
            name: 'maxlength',
            type: 'number',
            additionalProps: {
              min: 0,
              max: 1000,
            },
          },
        ],
      },
      {
        label: '数字框',
        icon: 'icon-keshihuapingtaiicon_shuzishuru',
        name: 'number',
        expectType: 'number',
        configs: [

        ],
      },
      {
        label: '密码框',
        icon: 'icon-keshihuapingtaiicon_zhagebuju1',
        name: 'password',
        expectType: 'string',
        configs: [

        ],
      },
      {
        label: '文本域',
        icon: 'icon-keshihuapingtaiicon_pingfen1',
        name: 'textarea',
        expectType: 'string',
        configs: [

        ],
      },
      {
        label: '开关',
        icon: 'icon-keshihuapingtaiicon_kaiguan',
        name: 'switch',
        expectType: 'boolean',
        configs: [

        ],
      },
      {
        label: '评分',
        icon: 'icon-pingfen',
        name: 'rate',
        expectType: 'number',
        configs: [

        ],
      },
      {
        label: '单选框',
        icon: 'icon-keshihuapingtaiicon_danxuankuang',
        name: 'radio-value',
        expectType: 'number|string',
        configs: [

        ],
      },
      {
        label: '单选框组',
        icon: 'icon-danxuan',
        name: 'radio-id',
        extraTag: 'data-id',
        expectType: 'number',
        configs: [

        ],
      },
      {
        label: '单复选框',
        icon: 'icon-keshihuapingtaiicon_duoxuankuang1',
        name: 'check-box',
        expectType: 'boolean',
        configs: [

        ],
      },
      {
        label: '单复选框',
        icon: 'icon-keshihuapingtaiicon_duoxuankuang1',
        name: 'check-box-int',
        extraTag: 'data-int',
        expectType: 'number',
        configs: [

        ],
      },
      {
        label: '复选框组',
        icon: 'icon-duoxuan',
        name: 'check-box-list',
        extraTag: 'data-id',
        expectType: 'number[]',
        configs: [

        ],
      },
      {
        label: '下拉框',
        icon: 'icon-xialakuang',
        name: 'select',
        expectType: 'number|string',
        configs: [

        ],
      },
      {
        label: '动态下拉',
        icon: 'icon-xialakuang',
        name: 'select-id',
        extraTag: 'data-id',
        expectType: 'number',
        configs: [

        ],
      },
      {
        label: '日期选择',
        icon: 'icon-riqixuanze',
        name: 'date',
        expectType: 'string|Date',
        configs: [

        ],
      },
      {
        label: '时间选择',
        icon: 'icon-shijianxuanze',
        name: 'time',
        expectType: 'string|Date',
        configs: [

        ],
      },
      {
        label: '日期时间选择',
        icon: 'icon-shijianfanwei',
        name: 'datetime',
        expectType: 'string|Date',
        configs: [

        ],
      },
      {
        label: '时间区间',
        icon: 'icon-shijianfanwei',
        name: 'time-range',
        expectType: '(string|Date)[]',
        configs: [

        ],
      },
      {
        label: '日期区间',
        icon: 'icon-riqifanwei',
        name: 'date-range',
        expectType: '(string|Date)[]',
        configs: [

        ],
      },
      {
        label: '日期时间区间',
        icon: 'icon-shijianfanwei',
        name: 'datetime-range',
        expectType: '(string|Date)[]',
        configs: [

        ],
      },
      {
        label: '滑块',
        icon: 'icon-tiaojie1',
        name: 'slider',
        expectType: 'number',
        configs: [

        ],
      },
      {
        label: '级联选择',
        icon: 'icon-jilianxuanze1',
        name: 'cascader',
        expectType: 'string[]',
        configs: [

        ],
      },
      {
        label: '穿梭框',
        icon: 'icon-chuansuokuang',
        name: 'transfer',
        expectType: '(string|number)[]',
        configs: [

        ],
      },
      {
        label: '富文本',
        icon: 'icon-duohangwenben',
        name: 'richtext',
        expectType: 'string',
        configs: [

        ],
      },
    ],
  },
  {
    label: '布局',
    items: [
      {
        label: '简单',
        icon: 'icon-hangrongqi',
        name: 'flat-simple',
        expectType: 'object',
        isContainer: true,
        configs: [
        ],
      },
      {
        label: '分组',
        icon: 'icon-hangrongqi',
        name: 'flat-group',
        expectType: 'object',
        extraTag: 'group',
        isContainer: true,
        configs: [
        ],
      },
    ],
  },
  {
    label: '嵌套',
    items: [
      {
        label: '对象嵌套',
        icon: 'icon-shebei',
        name: 'object',
        expectType: 'object',
        isContainer: true,
        configs: [
        ],
      },
      {
        label: '对象嵌套',
        icon: 'icon-shebei',
        name: 'object-group',
        expectType: 'object',
        extraTag: 'group',
        isContainer: true,
        configs: [
        ],
      },
      {
        label: '基础数组',
        icon: 'icon-liebiao',
        name: 'array-single',
        expectType: 'any[]',
        extraTag: 'data-single',
        isContainer: true,
        isContainerSingle: true,
        configs: [
        ],
      },
      {
        label: '对象数组',
        icon: 'icon-liebiao',
        name: 'array-object',
        expectType: 'object[]',
        extraTag: 'data-object',
        isContainer: true,
        configs: [
        ],
      },
    ],
  },
  {
    label: '扩展',
    items: [
      {
        label: '签名',
        icon: 'icon-bianji1',
        name: 'signature',
        expectType: 'string',
        configs: [

        ],
      },
      {
        label: '经纬度',
        icon: 'icon-biaoji',
        name: 'select-lonlat',
        expectType: 'number[]',
        configs: [

        ],
      },
      {
        label: '录音',
        icon: 'icon-luyin',
        name: 'recorder',
        expectType: 'number[]',
        configs: [

        ],
      },
    ],
  },
  {
    label: '静态展示',
    items: [
      {
        label: '静态文本',
        icon: 'icon-wenben',
        name: 'static-text',
        configs: [

        ],
      }
    ],
  }
];

export const FormItemsMap = new Map(FormItems.flatMap(group => group.items.map(item => [item.name, item])));

export function getFormItemDef(name: string) {
  return FormItemsMap.get(name);
}