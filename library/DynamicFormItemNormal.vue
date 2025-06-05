<script lang="ts">
import { defineComponent, h, inject, PropType, Ref, ref, renderSlot, toRefs } from 'vue';
import { IDynamicFormItem, IDynamicFormItemCallback, IDynamicFormOptions } from './DynamicForm';
import { Rules } from 'async-validator';
import { VNode } from 'vue';
import DynamicFormItemRenderer, { DynamicFormItemRendererInterface } from './DynamicFormItemRenderer/DynamicFormItemRenderer.vue';
import FormItem from './DynamicFormBasicControls/FormItem';

/**
 * 动态表单条目渲染组件。
 */
export default defineComponent({
  name: 'DynamicFormItem',
  props: {
    item: {
      type: Object as PropType<IDynamicFormItem>,
      required: true,
    },
    name: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    model: {
    },
    parentModel: {
    },
    rawModel: {
      type: Object as PropType<Record<string, unknown>>,
    },
    noLable: {
      type: Boolean,
      default: false
    },
    formWrapperColDefault: {
      type: Object,
      default: null
    },
    formLabelColDefault: {
      type: Object,
      default: null
    },
  },
  emits: [ 'update:model' ],
  setup(props, ctx) {
    const {
       model, rawModel, parentModel, 
       name, item, disabled, noLable,
       formWrapperColDefault, formLabelColDefault
    } = toRefs(props);

    function onModelUpdate(newVal: unknown) {
      ctx.emit('update:model', newVal);
    }

    const finalOptions = inject<Ref<IDynamicFormOptions>>('finalOptions'); 
    const widgetsRefMap = inject<Record<string,() => unknown>>('widgetsRefMap'); 
    const currentFormItem = ref<DynamicFormItemRendererInterface>(); 

    function evaluateCallback(val: unknown|IDynamicFormItemCallback<unknown>) {
      if (typeof val === 'object' && typeof (val as IDynamicFormItemCallback<unknown>).callback === 'function')
        return (val as IDynamicFormItemCallback<unknown>).callback(
          model.value, 
          rawModel.value, 
          parentModel.value, 
          item.value, 
          (finalOptions?.value.formRules ?? {}) as Record<string, Rules>
        );
      return val as unknown;
    }
    function evaluateCallbackObj(val: Record<string, unknown|IDynamicFormItemCallback<unknown>>) {
      const newObj = {} as Record<string, unknown>;
      for (const key in val) {
        if (Object.prototype.hasOwnProperty.call(val, key))
          newObj[key] = evaluateCallback(val[key]);
      }
      return newObj;
    }

    if (widgetsRefMap && name.value)
      widgetsRefMap[name.value] = () => {
        return currentFormItem.value?.getRef();
      };

    function renderChildrenSlot() {
      const formRules = finalOptions?.value.formRules;
      const vnodes = [] as VNode[];
      //前缀渲染
      if (item.value.additionalSlot?.dynamicFormPrefix)
        vnodes.push(...item.value.additionalSlot.dynamicFormPrefix());

      //外部引用
      if (ctx.slots.insertion) {
        vnodes.push(renderSlot(ctx.slots, 'insertion'));
      }
      //自定义
      else if (item.value.type === 'custom') {
        vnodes.push(renderSlot(ctx.slots, 'formCeil', {
          name: name.value,
          item: item.value,
          model: model.value,
          onModelUpdate: (v: unknown) => onModelUpdate(v),
          rawModel: rawModel.value,
          parentModel: parentModel.value,
          rule: formRules ? formRules[item.value.name] : undefined,
          disabled: disabled.value,
        }));
      }
      //静态文字
      else if (item.value.type === 'static-text') {
        vnodes.push(h('span', { ...evaluateCallbackObj(item.value.additionalProps as {}) }, [
          (model.value || evaluateCallback((item.value.additionalProps as Record<string, unknown>)?.text)) as string
        ]));
      }
      //提交按钮
      else if (item.value.type === 'base-button') {
        vnodes.push(h('button', { 
          type: item.value.name === 'submit' ? 'submit' : (item.value.name === 'reset' ? 'reset' : ''),
          class: 'dynamic-form-base-control base-button',
          ...evaluateCallbackObj(item.value.additionalProps as {}) as {},
        }, [ ((item.value.additionalProps as Record<string, unknown>)?.text || evaluateCallback(item.value.label)) as string ]));
      }
      //库组件
      else {
        vnodes.push(h(DynamicFormItemRenderer, {
          ref: currentFormItem,
          value: model.value,
          rawModel: rawModel.value,
          parentModel: parentModel.value,
          'onUpdate:value': (v: unknown) => onModelUpdate(v),
          item: item.value,
          name: name.value,
          disabled: disabled.value,
          additionalProps: evaluateCallbackObj(item.value.additionalProps as Record<string, unknown>),
        }));
      }

      //后缀渲染
      if (item.value.additionalSlot?.dynamicFormSuffix) 
        vnodes.push(...item.value.additionalSlot.dynamicFormSuffix());

      return vnodes;
    }

    return () => {
      const internalWidgetsFormItem = finalOptions?.value.internalWidgets?.FormItem;

      //自定义渲染Form
      if (internalWidgetsFormItem) {
        return h(internalWidgetsFormItem.component as any, {
          ...item.value.formProps as {},
          colon: noLable.value !== true,
          [internalWidgetsFormItem.propsMap.label || 'label']: noLable.value ? '' : evaluateCallback(item.value.label),
          [internalWidgetsFormItem.propsMap.name || 'name']: name.value,
          [internalWidgetsFormItem.propsMap.labelCol || 'labelCol']: item.value.formLabelCol ?? formLabelColDefault.value,
          [internalWidgetsFormItem.propsMap.wrapperCol || 'wrapperCol']: item.value.formWrapperCol ?? formWrapperColDefault.value,
        }, {
          default: renderChildrenSlot,
        })
      }

      //默认Form
      return (
        h(FormItem, {
          colon: noLable.value !== true,
          ...item.value.formProps as {},
          labelCol: item.value.formLabelCol ?? formLabelColDefault.value as any,
          wrapperCol: item.value.formWrapperCol ?? formWrapperColDefault.value as any,
          label: noLable.value ? '' : evaluateCallback(item.value.label) as string,
          name: name.value,
        }, {
          default: renderChildrenSlot,
        })
      )
    }
  },
  components: { DynamicFormItemRenderer, FormItem }
});

</script>