<script lang="ts">
import { defineComponent, h, inject, PropType, ref, renderSlot, toRefs } from 'vue';
import { IDynamicFormInternalWidgets, IDynamicFormItem } from './DynamicForm';
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
      type: Object as PropType<Record<string, unknown>>,
    },
    rawModel: {
      type: Object as PropType<Record<string, unknown>>,
    },
  },
  setup(props, ctx) {
    const { model, rawModel, name, item, disabled } = toRefs(props);

    function onModelUpdate(key: string, newVal: unknown) {
      // eslint-disable-next-line vue/no-mutating-props
      (model.value as Record<string, unknown>)[key] = newVal;
    }

    const formRules = inject<Record<string, Rule>>('formRules'); 
    const internalWidgets = inject<IDynamicFormInternalWidgets>('internalWidgets'); 
    const widgetsRefMap = inject<Record<string,() => unknown>>('widgetsRefMap'); 
    const currentFormItem = ref<DynamicFormItemRendererInterface>(); 

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
          item: item.value,
          model: model.value?.[item.value.name] || model.value,
          rawModel: rawModel.value,
          rule: formRules ? formRules[item.value.name] : undefined,
          disabled: disabled.value,
        });
      }
      //静态文字
      else if (item.value.type === 'static-text') {
        return h('span', { ...item.value.additionalProps as {}}, [
          (model.value?.[item.value.name] || (item.value.additionalProps as Record<string, unknown>)?.text) as string
        ]);
      }
      //提交按钮
      else if (item.value.type === 'base-button') {
        return h('button', { 
          type: item.value.name === 'submit' ? 'submit' : (item.value.name === 'reset' ? 'reset' : ''),
          class: 'dynamic-form-base-control base-button',
          ...item.value.additionalProps as {},
        }, [ item.value.label ]);
      }
      //库组件
      else {
        return h(DynamicFormItemRenderer, {
          ref: currentFormItem,
          value: model.value?.[item.value.name],
          rawModel: rawModel.value,
          'onUpdate:value': (v: unknown) => onModelUpdate(item.value.name, v),
          item: item.value,
          disabled: disabled.value,
          additionalProps: (item.value.additionalProps as Record<string, unknown>),
        });
      }
    }

    return () => {
      const internalWidgetsFormItem = internalWidgets?.FormItem;

      //自定义渲染Form
      if (internalWidgetsFormItem) {
        return h(internalWidgetsFormItem, {
          ...item.value.formProps,
          [internalWidgetsFormItem.propsMap.label || 'label']: item.value.label,
          [internalWidgetsFormItem.propsMap.name || 'name']: item.value.name,
        }, {
          default: renderChildrenSlot,
        })
      }

      //默认Form
      return (
        h(FormItem, {
          ...item.value.formProps,
          label: item.value.label,
          name: item.value.name,
        }, {
          default: renderChildrenSlot,
        })
      )
    }
  },
  components: { DynamicFormItemRenderer, FormItem }
});

</script>