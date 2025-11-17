<template>
  <form
    class="dynamic-form-control"
    :name="name"
    @submit.prevent="handleSubmit"
  >
    <slot />
  </form>
</template>

<script setup lang="ts">
import { provide, ref, onMounted, toRefs, type Ref } from 'vue';
import type { FormContext, FormItemInternalContext, ValidTrigger } from './FormContext';
import Schema, { type Rules, type Rule } from 'async-validator';
import scrollIntoView from 'scroll-into-view-if-needed';
import { ObjectUtils } from '@imengyu/imengyu-utils';
import type { ColProps } from './Layout/Col.vue';

// Form 实例接口
export interface Form {
  clearValidate: (name?: string|string[]) => void;
  resetFields: (name?: string|string[]) => void;
  scrollToField: (name: string) => void;
  validate: (name?: string|string[]) => void;
  submit: (valid?: boolean) => void;
}

// Props 定义
export interface FormProps {
  /**
   * 表单数据对象
   */
  model?: Record<string, unknown>;
  /**
   * 表单验证规则
   */
  rules?: Record<string, Rule>;
  /**
   * 配置 Form.Item 的 colon 的默认值
   */
  colon?: boolean;
  /**
   * 隐藏所有表单项的必选标记
   */
  hideRequiredMark?: boolean;
  /**
   * 统一设置左侧文本宽度
   */
  labelWidth?: number|string;
  /**
   * 统一设置左侧文本对齐
   */
  labelAlign?: 'left'|'center'|'right'|'end';
  /**
   * 统一设置左侧文本的flex占比，默认是2
   */
  labelCol?: ColProps;
  /**
   * 统一设置输入框的flex占比
   */
  wrapperCol?: ColProps;
  /**
   * 统一设置字段校验规则
   * * onBlur 文本框失去焦点时校验
   * * onValueChange 数值更改时校验
   * * submit 提交时校验(默认)
   */
  validateTrigger?: ValidTrigger;
  /**
   * 是否显左边标题，默认是
   */
  showLabel?: boolean;
  /**
   * 表单的名称
   */
  name?: string;
}

// Props 声明
const props = withDefaults(defineProps<FormProps>(), {
  hideRequiredMark: false,
  colon: true,
  labelAlign: "end",
  validateTrigger: 'submit',
  validateOnRuleChange: false,
  showLabel: true,
  name: '',
});

// Emits 声明
const emit = defineEmits<{
  finish: [];
  finishFailed: [errors: unknown];
  submit: [model: Record<string, unknown>];
}>();

// 解构 props
const {
  labelCol, wrapperCol, colon, labelAlign, labelWidth, name, rules,
  validateTrigger, model, showLabel, hideRequiredMark,
} = toRefs(props);

// 初始化状态
const intitalModel = ref<Record<string, unknown>|null>(null);
const formItems = ref(new Map<string, FormItemInternalContext>()) as Ref<Map<string, FormItemInternalContext>>;

// 访问表单模型数据的函数
function accessFormModel(keyName: string, isSet: boolean, setValue: unknown) : unknown {
  const keys = keyName.split('.');
  let ret : unknown = undefined;
  let obj = model.value as Record<string, unknown>;
  let keyIndex = 0;
  let key = keys[keyIndex];
  while (obj) {
    const leftIndex = key.indexOf('[');
    if (leftIndex > 0 && key.endsWith(']')) {
      const arr = obj[key.substring(0, leftIndex)] as Record<string, unknown>[];
      const index = parseInt(key.substring(leftIndex + 1, key.length - 1))    
      obj = arr[index];
      if (keyIndex >= keys.length - 1) {
        ret = obj;
        if (isSet) arr[index] = setValue as Record<string, unknown>;
      }
    } else {
      const newObj = obj[key] as Record<string, unknown>;
      if (keyIndex >= keys.length - 1) {
        ret = newObj;
        if (isSet) obj[key] = setValue as Record<string, unknown>;
      }
      obj = newObj;
    }
    if (keyIndex < keys.length - 1) key = keys[++keyIndex];
    else break;
  }
  return ret;
}

// 表单上下文
const formContext = {
  clearValidate(k) {
    clearValidate(k.getFieldName());
  },
  onFieldBlur: (item: FormItemInternalContext) => {
    // 验证
    if (item.getValidateTrigger() === 'blur')
      validate(item.getFieldName());
  },
  onFieldChange: (item: FormItemInternalContext, newValue: unknown) => {
    accessFormModel(item.getFieldName(), true, newValue);
    // 验证
    if (item.getValidateTrigger() === 'change')
      validate(item.getFieldName());
  },
  addFormItemField: (item: FormItemInternalContext) => {
    formItems.value.set(item.getFieldName(), item);
    return formItems.value.size;
  },
  removeFormItemField: (item: FormItemInternalContext) => {
    formItems.value.delete(item.getFieldName());
  },
  getItemValue: (item: FormItemInternalContext) => {
    return accessFormModel(item.getFieldName(), false, undefined);
  },
  getItemRequieed: (item: FormItemInternalContext) => {
    return checkRuleRequired(item.getFieldName());
  },
  validateTrigger,
  hideRequiredMark,
  colon,
  labelAlign,
  labelCol,
  labelWidth,
  wrapperCol,
  showLabel,
  name,
} as FormContext;

// 检查规则是否必填
function checkRuleRequired(name: string) {
  const rule = getRuleByFieldName(name);
  if (rule instanceof Array)
    return rule.find((r) => r.required === true) !== undefined;
  else if (rule)
    return rule.required === true;
  return false;
}

// 挂载时保存初始模型
onMounted(() => {
  // 保存初始模型
  intitalModel.value = model.value ? 
    ObjectUtils.clone(model.value) as Record<string, unknown> : {};
});

// 提供表单上下文
provide('formContext', formContext);

// 清除验证错误状态
function clearValidate(name?: string|string[]) {
  if (name instanceof Array) {
    name.forEach(k => resetFields(k));
    return;
  }

  if (name) {
    const item = formItems.value.get(name);
    if (item)
      item.setErrorState(null);
  } else {
    for (const v of formItems.value)
      v[1].setErrorState(null);
  }
}

// 重置模型到初始状态
function resetFields(name?: string|string[]) {
  if (name) {
    if (name instanceof Array) {
      name.forEach(k => resetFields(k));
      return;
    }
    if (model.value) {
      model.value[name] = intitalModel.value?.[name] || null;
    }
  } else {
    if (model.value && intitalModel.value) {
      for (const v of formItems.value) {
        model.value[v[0]] = intitalModel.value[v[0]] || null;
      }
    }
  }
}

// 滚动到指定字段
function scrollToField(name: string) {
  const item = formItems.value.get(name);
  if (item) {
    const node = document.getElementById(item.getUniqueId());
    if (node)
      scrollIntoView(node);
  }
}

function getRuleByFieldName(name: string) {
  const item = formItems?.value.get(name);
  if (!item)
    return undefined;
  let rule = item.rules?.value;
  if (!rule)
    rule = rules.value ? rules.value[name] : undefined;
  return rule as Rule|undefined;
}

// 验证表单
function validate(name?: string|string[]) {
  const filteredRules = {} as Record<string, Rule|undefined>;

  clearValidate();

  // 筛选需要验证的字段
  formItems.value.forEach((_, key) => {
    const rule = getRuleByFieldName(key);
    if (rule) {
      if (typeof name === 'string') {
        if (name === key) filteredRules[key] = rule as Rule;
      } else if (typeof name === 'object') {
        if (name.indexOf(key) >= 0) filteredRules[key] = rule as Rule;
      } else
        filteredRules[key] = rule as Rule;
    }
  });

  // 获取当前参数
  const nowValues = model.value || {};

  // 开始验证
  return new Promise<void>((resolve, reject) => {
    const validator = new Schema(filteredRules as Rules);
    validator.validate(nowValues, {}, (errors) => {
      if (errors) {
        // 验证失败，显示错误字段
        for (const key in errors) {
          if (Object.prototype.hasOwnProperty.call(errors, key)) {
            const err = errors[key];
            const k = formItems.value.get(err.field as string);
            if (k)
              k.setErrorState(err.message || `Valid ${err.field} failed!`);
          }
        }
        reject(errors);
      } else {
        // 验证成功，清除之前的验证错误信息
        clearValidate();
        resolve();
      }
    });
  });
}

// 提交表单
function submit(valid = true) {
  if (valid) {
    // 验证
    validate().then(() => {
      emit('finish');
      if (model.value) {
        emit('submit', model.value);
      }
    }).catch((e) => {
      console.warn('submit validate failed: ', e);
      emit('finishFailed', e);
    });
  } else {
    // 直接提交
    if (model.value) {
      emit('submit', model.value);
    }
  }
}

// 处理表单提交事件
function handleSubmit() {
  submit();
}

// 暴露方法
defineExpose({
  validate,
  scrollToField,
  resetFields,
  clearValidate,
  submit,
});
</script>