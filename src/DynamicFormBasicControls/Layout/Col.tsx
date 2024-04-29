import { computed, defineComponent, inject, renderSlot, toRefs } from 'vue';

export interface ColProps {
  /**
   * 列元素偏移距离
   */
  offset?: number;
  /**
   * 列元素宽度
   */
  span?: number;

  style?: object;
  class?: string,
}

/**
 * 24列栅格列组件。
 *
 * 提供了 24列栅格，通过在 Col 上添加 span 属性设置列所占的宽度百分比。
 *
 * 此外，添加 offset 属性可以设置列的偏移宽度，计算方式与 span 相同。
 */
export default defineComponent({
  name: 'Col',
  props: {
    /**
     * 列元素偏移距离
     */
    offset: {
      type: Number,
      default: 0
    },
    /**
     * 列元素宽度
     */
    span: {
      type: Number,
      default: 0
    },
    class: {
      type: String,
      default: undefined,
    },
    style: {
      type: Object,
      default: undefined,
    }
  },
  setup(props, ctx) {
    const { span, offset } = toRefs(props);

    const GRID_SIZE = inject('DynamicFormLayoyGridSize', 24);

    const pec = computed(() => {
      return ((span.value || 0) / GRID_SIZE) * 100;
    });

    return () => (
      <div 
        class={"dynamic-form-col" + (props.class ? (' ' + props.class) : '')}
        style={{
          flexBasis: pec.value > 0 ? `${pec.value}%` : undefined,
          marginLeft: offset.value ? `${(offset.value / GRID_SIZE) * 100}%` : undefined,
          maxWidth: pec.value > 0 ? `${pec.value}%` : undefined,
          ...props.style,
        }}
      >
        { renderSlot(ctx.slots, 'default') }
      </div>
    )
  },
});
