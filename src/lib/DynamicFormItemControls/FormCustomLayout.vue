<script lang="ts">
import { PropType, defineComponent } from 'vue';
import type { IDynamicFormItem, FormCustomLayoutProps } from '../DynamicForm';

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