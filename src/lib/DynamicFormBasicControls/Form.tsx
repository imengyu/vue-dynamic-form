import Schema, { Rules, Rule } from 'async-validator';
import { defineComponent, PropType, toRefs, provide, ref, onMounted, renderSlot } from 'vue';
import { FormContext, FormItemInternalContext, ValidTrigger } from './FormContext';
import ObjectUtils from './Utils/ObjectUtils';
import scrollIntoView from 'scroll-into-view-if-needed'

/**
 * Form 实例接口
 */
export interface Form {
  clearValidate:(name?: string|string[]) => void;
  resetFields: (name?: string|string[])  => void;
  scrollToField: (name: string) => void;
  validate: (name?: string|string[])  => void;
  submit: (valid?: boolean) => void;
}

export interface FormProps {
  /**
   * 表单数据对象
   */
  model?: Record<string, unknown>;
  /**
   * 表单验证规则
   */
  rules?: Record<string, unknown>;
  /**
   * 配置 Form.Item 的 colon 的默认值
   */
  colon?: boolean;
  /**
   * 隐藏所有表单项的必选标记
   */
  hideRequiredMark?: boolean;
  /**
   * 统一设置左侧文本对齐
   */
  labelAlign?: 'left'|'center'|'right';
  /**
   * 统一设置左侧文本的flex占比，默认是2
   */
  labelCol?: number;
  /**
   * 统一设置输入框的flex占比
   */
  wrapperCol?: number;
  /**
   * 统一设置字段校验规则
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
   * 表单的名称
   */
  name?: string;
}

/**
 * 表单条目组件。
 */
export default defineComponent({
  name: 'Form',
  props: {
    model: {
      type: Object,
      default: null,
    },
    rules: {
      type: Object,
      default: null,
    },
    hideRequiredMark: {
      type: Boolean,
      default: false,
    },
    colon: {
      type: Boolean,
      default: true,
    },
    labelAlign: {
      type: String as PropType<'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent'>,
      default: "end",
    },
    labelWidth: {
      type: [String,Number],
      default: undefined,
    },
    labelCol: {
      type: Object,
      default: null
    },
    wrapperCol: {
      type: Object,
      default: null
    },
    validateTrigger: {
      type: String as PropType<ValidTrigger>,
      default: 'onSubmit',
    },
    validateOnRuleChange: {
      type: Boolean,
      default: false,
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      default: '',
    },
  },
  emits: [
    /**
     * 提交表单且数据验证成功后回调事件
     */
    'finish',
    /**
     * 提交表单且数据验证失败后回调事件
     */
    'finishFailed',
    /**
     * 数据验证成功后回调事件
     */
    'submit',
  ],
  setup(props, ctx) {
    const { slots } = ctx;
    const { 
      labelCol, wrapperCol, colon, labelAlign, labelWidth, name, rules,
      validateTrigger, model, showLabel, hideRequiredMark,
    } = toRefs(props);

    const intitalModel = ref<Record<string, unknown>|null>(null);
    const formItems = ref(new Map<string, FormItemInternalContext>());

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
            if (isSet)
              obj[key] = setValue as Record<string, unknown>;
          }
          obj = newObj;
        }
        if (keyIndex < keys.length - 1)
          key = keys[++keyIndex];
        else
          break;
      }
      return ret;
    } 

    //Context
    const formContext = {
      onFieldBlur: (item: FormItemInternalContext) => {
        //validate
        if (item.getValidateTrigger() === 'blur')
          validate(item.getFieldName());
      },
      onFieldChange: (item: FormItemInternalContext, newValue: unknown) => {
        accessFormModel(item.getFieldName(), true, newValue)
        //validate
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
    } as FormContext;

    function checkRuleRequired(name: string) {
      const rule = rules.value[name];
      if (rule instanceof Array)
        return rule.find((r) => r.required === true) !== undefined;
      else if (rule)
        return rule.required === true;
    }

    onMounted(() => {
      //Save intital model
      intitalModel.value = model.value ? 
        ObjectUtils.clone(model.value) as Record<string, unknown> : {};
    });

    provide('formContext', formContext);

    //Clear valid error state
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
    //Reset model to intital state
    function resetFields(name?: string|string[]) {
      if (name) {
        if (name instanceof Array) {
          name.forEach(k => resetFields(k));
          return;
        }
        model.value[name] = intitalModel.value?.[name] || null;
      } else {
        for (const v of formItems.value)
          model.value[v[0]] = intitalModel.value?.[v[0]] || null;
      }
    }
    //Scroll to field
    function scrollToField(name: string) {
      const item = formItems.value.get(name);
      if (item) {
        const node = document.getElementById(item.getUniqueId());
        if (node)
          scrollIntoView(node);
      }
    }
    //Valid
    function validate(name?: string|string[]) {
      const filteredRules = {} as Record<string, Rule|undefined>;

      clearValidate();

      //筛选需要验证的字段
      formItems.value.forEach((_, key) => {
        const rule = rules.value ? rules.value[key] : undefined;
        if (rule) {
          if (typeof name === 'string') {
            if (name === key) filteredRules[key] = rule;
          } else if (typeof name === 'object') {
            if (name.indexOf(key) >= 0) filteredRules[key] = rule;
          } else
            filteredRules[key] = rule;
        }
      });

      //获取当前参数
      const nowValues = model.value;

      //开始验证
      return new Promise<void>((resolve, reject) => {
        const validator = new Schema(filteredRules as Rules);
        validator.validate(nowValues, {}, (errors) => {
          if (errors) {
            //验证失败，把错误字段显示
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
            //验证成功，去除之前的验证错误信息
            clearValidate();
            resolve();
          }
        });
      });
    }
    //Submit form
    function submit(valid = true) {
      if (valid) {
        //验证
        validate().then(() => {
          ctx.emit('finish');
          ctx.emit('submit', model.value);
        }).catch((e) => {
          console.warn('submit validate failed: ', e);
          ctx.emit('finishFailed', e);
        });
      } else {
        //提交
        ctx.emit('submit', model.value);
      }
    }

    ctx.expose({
      validate,
      scrollToField,
      resetFields,
      clearValidate,
      submit,
    });

    return () => {
      return (
        <form
          class="dynamic-form-control" 
          name={name.value}
          onSubmit={(e: Event) => {
            e.preventDefault();
            submit();
          }}
        >{ renderSlot(slots, 'default') }</form>
      );
    };
  },
});