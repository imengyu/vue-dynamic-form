<script lang="ts">
import { PropType, Ref, defineComponent, h, inject, onBeforeUnmount, onMounted, ref } from 'vue';
import { IDynamicFormMessageCenter, MESSAGE_TAB_ACTIVE, MESSAGE_TAB_NEXT, type IDynamicFormItem, type IDynamicFormOptions, type IDynamicFormTabProps } from '../DynamicForm';
import Tab from '../DynamicFormBasicControls/Tabs/Tab.vue';

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
    const messageCenter = inject<IDynamicFormMessageCenter>('messageCenter'); 
    
    onMounted(() => {
      //注册事件中心
      messageCenter?.addInstance(props.item.name, onMessage)
    });
    onBeforeUnmount(() => {
      //移除事件中心
      messageCenter?.removeInstance(props.item.name)
    });

    function onMessage(messageName: string, data: unknown) {
      switch (messageName) {
        case MESSAGE_TAB_NEXT: {
          const keys = props.item.children?.map((item) => item.name) || [];
          activeKey.value = keys[keys.indexOf(activeKey.value) + 1] || keys[0];
          break;
        }
        case MESSAGE_TAB_ACTIVE:
          activeKey.value = data as string;
          break;
        default:
          break;
      }
    }

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
      return [
        h(Tab, {
          activeKey: activeKey.value,
          defaultActiveKey: additionalProps?.defaultActiveKey,
          'onUpdate:activeKey': (v: string) => activeKey.value = v,
          ...additionalProps?.tabProps,
        }, ctx.slots)
      ];
    }
  },
});
</script>