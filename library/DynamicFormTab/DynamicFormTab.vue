<script lang="ts">
import { PropType, Ref, defineComponent, h, inject, ref } from 'vue';
import type { IDynamicFormItem, IDynamicFormOptions, IDynamicFormTabProps } from '../DynamicForm';

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IDynamicFormItem>,
      required: true,
    },
  },
  setup(props, ctx) {
    const finalOptions = inject<Ref<IDynamicFormOptions>>('finalOptions'); 
    const additionalProps = props.item.additionalProps as IDynamicFormTabProps;
    const activeKey = ref(additionalProps?.defaultActiveKey || '');

    return () => {
      const internalWidgets = finalOptions?.value.internalWidgets;
      if (additionalProps?.renderTab) {
        return additionalProps.renderTab(props.item, {
          activeKey: activeKey.value,
          defaultActiveKey: additionalProps.defaultActiveKey,
          'onUpdate:activeKey': (v) => activeKey.value = v,
        }, ctx.slots.default!);
      }
      else if (internalWidgets?.Tab) {
        return [ h(internalWidgets.Tab.component as any, {
          [internalWidgets.Tab.propsMap.activeKey || 'activeKey']: activeKey.value,
          [internalWidgets.Tab.propsMap.defaultActiveKey || 'defaultActiveKey']: additionalProps?.defaultActiveKey,
          [`onUpdate:${internalWidgets.Tab.propsMap.activeKey || 'activeKey'}`]: (v: string) => activeKey.value = v,
          ...additionalProps?.tabProps,
        }, ctx.slots) ];
      }
      return [];
    }
  },
});
</script>