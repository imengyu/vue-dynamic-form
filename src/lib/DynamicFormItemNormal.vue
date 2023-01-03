<script lang="ts">
import { defineComponent, h, inject, PropType, ref, renderSlot, toRefs } from 'vue';
import { IDynamicFormInternalWidgets, IDynamicFormItem, IDynamicFormItemCallback } from './DynamicForm';
import DynamicFormItemRenderer, { DynamicFormItemRendererInterface } from './DynamicFormItemRenderer/DynamicFormItemRenderer.vue';
import FormItem from './DynamicFormBasicControls/FormItem';
import { Rule } from 'async-validator';

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
  },
  emits: [ 'update:model' ],
  setup(props, ctx) {
    const { model, rawModel, parentModel, name, item, disabled, noLable } = toRefs(props);

    function onModelUpdate(newVal: unknown) {
      ctx.emit('update:model', newVal);
    }

    const formRules = inject<Record<string, Rule>>('formRules'); 
    const internalWidgets = inject<IDynamicFormInternalWidgets>('internalWidgets'); 
    const widgetsRefMap = inject<Record<string,() => unknown>>('widgetsRefMap'); 
    const currentFormItem = ref<DynamicFormItemRendererInterface>(); 

    function evaluateCallback(val: unknown|IDynamicFormItemCallback<unknown>) {
      if (typeof val === 'function')
        return val(model.value, rawModel.value, parentModel.value, item.value, formRules);
      return val;
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
      //外部引用
      if (ctx.slots.insertion) {
        return renderSlot(ctx.slots, 'insertion');
      }
      //自定义
      else if (item.value.type === 'custom') {
        return renderSlot(ctx.slots, 'formCeil', {
          name: name.value,
          item: item.value,
          model: model.value,
          onModelUpdate: (v: unknown) => onModelUpdate(v),
          rawModel: rawModel.value,
          parentModel: parentModel.value,
          rule: formRules ? formRules[item.value.name] : undefined,
          disabled: disabled.value,
        });
      }
      //静态文字
      else if (item.value.type === 'static-text') {
        return h('span', { ...evaluateCallbackObj(item.value.additionalProps as {}) }, [
          (model.value || evaluateCallback(item.value.additionalProps as Record<string, unknown>)?.text) as string
        ]);
      }
      //提交按钮
      else if (item.value.type === 'base-button') {
        return h('button', { 
          type: item.value.name === 'submit' ? 'submit' : (item.value.name === 'reset' ? 'reset' : ''),
          class: 'dynamic-form-base-control base-button',
          ...evaluateCallbackObj(item.value.additionalProps as {}),
        }, [ (item.value.additionalProps as Record<string, unknown>)?.text as string || evaluateCallback(item.value.label) ]);
      }
      //库组件
      else {
        return h(DynamicFormItemRenderer, {
          ref: currentFormItem,
          value: model.value,
          rawModel: rawModel.value,
          parentModel: parentModel.value,
          'onUpdate:value': (v: unknown) => onModelUpdate(v),
          item: item.value,
          name: name.value,
          disabled: disabled.value,
          additionalProps: evaluateCallbackObj(item.value.additionalProps as Record<string, unknown>),
        });
      }
    }

    return () => {
      const internalWidgetsFormItem = internalWidgets?.FormItem;

      //自定义渲染Form
      if (internalWidgetsFormItem) {
        return h(internalWidgetsFormItem.component as any, {
          ...item.value.formProps as {},
          colon: noLable.value !== true,
          [internalWidgetsFormItem.propsMap.label || 'label']: noLable.value ? '' : evaluateCallback(item.value.label),
          [internalWidgetsFormItem.propsMap.name || 'name']: name.value,
        }, {
          default: renderChildrenSlot,
        })
      }

      //默认Form
      return (
        h(FormItem, {
          colon: noLable.value !== true,
          ...item.value.formProps as {},
          label: noLable.value ? '' : evaluateCallback(item.value.label),
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