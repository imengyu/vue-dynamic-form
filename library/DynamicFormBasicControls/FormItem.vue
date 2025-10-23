<template>
  <Row
    class="dynamic-form-control-item"
    :class="{ 'no-bottom-margin': noBottomMargin }"
    :align="center ? 'center' : 'flex-start'"
  >
    <template v-if="labelColValue > 0 && showLabel && formContextProps?.showLabel.value && label">
      <Col
        class="label-container"
        :span="labelColValue"
        :offset="labelCol?.offset ?? formContextProps?.labelCol.value?.offset"
        :style="{ width: labelWidth ?? formContextProps?.labelWidth.value }"
      >
        <label
          :for="uniqueId"
          :style="({
            color: disabled ? labelDisableColor : labelColor,
            textAlign: labelAlign ?? formContextProps?.labelAlign.value,
            ...labelStyle
          } as StyleValue)"
        >
          <span v-if="showRequiredBadge && (required || formContextProps.getItemRequieed(formItemInternalContext)) && formContextProps?.hideRequiredMark.value !== true" class="required">*</span>
          {{ label }}
          <span v-if="(colon || (colon !== false && formContextProps?.colon.value === true)) && label.trim().length > 0" class="colon">:</span>
        </label>
      </Col>
    </template>
    <Col 
      class="wrapper-container"
      :span="wrapperCol?.span ?? formContextProps?.wrapperCol.value?.span"
      :offset="wrapperCol?.offset ?? formContextProps?.wrapperCol.value?.offset"
    >
      <div :id="uniqueId">
        <slot />
        <div v-if="error" class="error-message">{{ error }}</div>
      </div>
    </Col>
  </Row>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, provide, ref, computed, type StyleValue, toRef } from 'vue';
import { type FormContext, FormItemContextContextKey, type FormItemInternalContext, type ValidTrigger } from './FormContext';
import Col, { type ColProps } from './Layout/Col.vue';
import Row from './Layout/Row.vue';

// Props 定义
export interface FormItemProps {
  /**
   * 输入框左侧文本
   */
  label?: string;
  /**
   * 名称，作为提交表单时的标识符
   */
  name?: string | string[];
  /**
   * 是否禁用输入框
   */
  disabled?: boolean;
  /**
   * 是否内容垂直居中
   */
  center?: boolean;
  /**
   * 是否在 label 后面添加冒号
   */
  colon?: boolean;
  /**
   * 是否必填
   */
  required?: boolean;
  /**
   * 是否显示表单必填星号
   */
  showRequiredBadge?: boolean;
  /**
   * 左侧文本对齐
   */
  labelAlign?: 'left'|'center'|'right';
  /**
   * 左侧文本的flex占比，默认是2
   */
  labelCol?: ColProps;
  /**
   * 输入框的flex占比
   */
  wrapperCol?: ColProps;
  /**
   * 左侧文本的样式
   */
  labelStyle?: object;
  /**
   * 左侧文本的颜色
   */
  labelColor?: string;
  /**
   * 左侧文本的禁用颜色
   */
  labelDisableColor?: string;
  /**
   * 设置字段校验的时机
   * * onBlur 文本框失去焦点时校验
   * * onValueChange 数值更改时校验
   * * onSubmit 提交时校验(默认)
   */
  validateTrigger?: ValidTrigger;
  /**
   * 是否显左边标题，默认是
   */
  showLabel?: boolean;
  /**
   * 是否去掉底部编辑，默认否
   */
  noBottomMargin?: boolean;
  /**
   * 左侧文本宽度
   */
  labelWidth?: string | number;
  /**
   * 当前条目的校验规则
   */
  rules?: any|any[];
}

// Props 声明
const props = withDefaults(defineProps<FormItemProps>(),{
  label: "",
  name: "",
  disabled: false,
  center: false,
  colon: true,
  required: false,
  showRequiredBadge: true,
  labelColor: "",
  labelDisableColor: "",
  validateTrigger: 'submit',
  showLabel: true,
  noBottomMargin: false,
});

// 注入表单上下文
const formContextProps = inject<FormContext>('formContext');

// 错误信息状态
const error = ref<string | null>(null);

// 计算 labelColValue
const labelColValue = computed(() => (props.labelCol?.span ?? formContextProps?.labelCol.value?.span) || 2);

// Context for parent
const formItemInternalContext = {
  rules: toRef(props, 'rules'),
  getValidateTrigger: () => props.validateTrigger || formContextProps?.validateTrigger.value || 'submit',
  getFieldName: () => props.name,
  setErrorState(errorMessage) { error.value = errorMessage; },
  getUniqueId,
} as FormItemInternalContext;

// Context for custom children
provide(FormItemContextContextKey, {
  getFieldName: () => typeof props.name === 'string' ? props.name : props.name.join('.'),
  onFieldBlur: () => { formContextProps?.onFieldBlur(formItemInternalContext); },
  onFieldChange: (newValue: unknown) => { formContextProps?.onFieldChange(formItemInternalContext, newValue); },
  clearValidate: () => { formContextProps?.clearValidate(formItemInternalContext); },
});

// Add ref in form
const addNumber = formContextProps?.addFormItemField(formItemInternalContext);
const uniqueId = (formContextProps?.name.value || 'form') + 'Item' + (props.name || `unknowProperity${addNumber}`);

// 清理函数
onBeforeUnmount(() => {
  formContextProps?.removeFormItemField(formItemInternalContext);
});

// 暴露方法
defineExpose({
  error,
});

// 工具函数
function getUniqueId() {
  return uniqueId;
}
</script>