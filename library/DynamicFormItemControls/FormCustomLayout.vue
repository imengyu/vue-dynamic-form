<script lang="ts">
import { type PropType, type Slot, type VNode, defineComponent } from 'vue';
import type { IDynamicFormItem } from '../DynamicFormDefs/DynamicFormItem';

export interface FormCustomLayoutProps {
  render: (item: IDynamicFormItem, defaultSlot: Slot) => VNode[];
}

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IDynamicFormItem>,
      required: true,
    },
  },
  setup(props, ctx) {
    const additionalProps = props.item.additionalProps as FormCustomLayoutProps;

    return () => {
      if (additionalProps?.render)
        return additionalProps?.render(props.item, ctx.slots.default!);
      return [];
    }
  },
});
</script>