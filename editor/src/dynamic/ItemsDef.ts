import type { IDynamicFormItem } from "@imengyu/vue-dynamic-form"
import type { SimpleRadioValueFormItemProps, SimpleSelectValueFormItemProps } from "@imengyu/vue-dynamic-form-ant";

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
    label: '是否显示冒号',
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
          label: '垂直布局',
          value: 'vertical',
        },
        {
          label: '水平布局',
          value: 'horizontal',
        },
      ],
      value: 'vertical',
      customProps: {},
    } as SimpleSelectValueFormItemProps,
  },
  {
    label: '标签位置',
    name: 'labelAlign',
    type: 'radio-value',
    additionalProps: {
      options: [
        {
          label: '左侧',
          value: 'left',
        },
        {
          label: '居中',
          value: 'center',
        },
        {
          label: '右侧',
          value: 'right',
        },
      ],
    } as SimpleRadioValueFormItemProps,
  },
  {
    label: '标签宽度',
    name: 'labelWidth',
    type: 'number',
    additionalProps: {
      placeholder: '请输入标签宽度',
    },
  }
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
        label: '简单布局',
        icon: 'icon-hangrongqi',
        name: 'simple-flat',
        expectType: 'object',
        configs: [
        ],
      },
      {
        label: '分组',
        icon: 'icon-hangrongqi',
        name: 'group-flat',
        expectType: 'object',
        extraTag: 'group',
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
        configs: [
        ],
      },
      {
        label: '对象嵌套',
        icon: 'icon-shebei',
        name: 'group-object',
        expectType: 'object',
        extraTag: 'group',
        configs: [
        ],
      },
      {
        label: '基础数组',
        icon: 'icon-liebiao',
        name: 'array',
        expectType: 'any[]',
        extraTag: 'data-single',
        configs: [
        ],
      },
      {
        label: '对象数组',
        icon: 'icon-liebiao',
        name: 'array-object',
        expectType: 'object[]',
        extraTag: 'data-object',
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