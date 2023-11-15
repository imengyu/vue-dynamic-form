<script lang="ts">
import { PropType, defineComponent, h, inject } from 'vue';
import type { IDynamicFormInternalWidgets, IDynamicFormItem, IDynamicFormTabPageProps } from '../DynamicForm';

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
    const internalWidgets = inject<IDynamicFormInternalWidgets>('internalWidgets');
    const additionalProps = props.item.additionalProps as IDynamicFormTabPageProps;

    return () => {
      if (additionalProps?.renderTabPage)
        return additionalProps?.renderTabPage(props.item, { key: props.tabKey, title: props.item.label as string }, ctx.slots.default!);
      else if (internalWidgets?.TabPage)
        return [ 
          h(internalWidgets?.TabPage.component as any, { 
            [internalWidgets.TabPage.propsMap.key || 'key']: props.tabKey, 
            [internalWidgets.TabPage.propsMap.title || 'title']: props.item.label,
            [internalWidgets.TabPage.propsMap.disabled || 'disabled']: props.item.disabled,
          }, ctx.slots) 
        ];
      return [];
    }
  },
});
</script>