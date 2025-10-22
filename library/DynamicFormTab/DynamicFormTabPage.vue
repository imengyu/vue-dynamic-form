<script lang="ts">
import { PropType, Ref, defineComponent, h, inject } from 'vue';
import type { IDynamicFormOptions, IDynamicFormItem, IDynamicFormTabPageProps, IEvaluateCallback } from '../DynamicForm';
import TabPage from '../DynamicFormBasicControls/Tabs/TabPage.vue';

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IDynamicFormItem>,
      required: true,
    },
    tabKey: {
      type: null,
      required: true,
    },
  },
  setup(props, ctx) {
    const finalOptions = inject<Ref<IDynamicFormOptions>>('finalOptions'); 
    const additionalProps = props.item.additionalProps as IDynamicFormTabPageProps;
    const evaluateCallback = inject<IEvaluateCallback>('evaluateCallback');

    return () => {
      const internalWidgets = finalOptions?.value.internalWidgets;
      if (additionalProps?.renderTabPage)
        return additionalProps?.renderTabPage(props.item, { key: props.tabKey, title: props.item.label as string }, ctx.slots.default!);
      else if (internalWidgets?.TabPage)
        return [ 
          h(internalWidgets.TabPage.component as any, { 
            [internalWidgets.TabPage.propsMap.key || 'key']: props.tabKey, 
            [internalWidgets.TabPage.propsMap.title || 'title']: props.item.label,
            [internalWidgets.TabPage.propsMap.disabled || 'disabled']: props.item.disabled,
          }, ctx.slots) 
        ];
      return [
        h(TabPage, {
          key: props.tabKey,
          title: props.item.label as string,
          disabled: evaluateCallback?.(props.item.disabled) ?? false,
        }, ctx.slots)
      ];
    }
  },
});
</script>