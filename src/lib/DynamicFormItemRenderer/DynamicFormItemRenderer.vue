<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable vue/no-mutating-props -->
<script lang="ts">
import { defineComponent, h, inject, markRaw, onBeforeUnmount, onMounted, PropType, ref, toRefs, watch } from "vue";
import { IDynamicFormItem, MESSAGE_RELOAD } from "../DynamicForm";
import { IDynamicFormMessageCenter } from "../DynamicFormInternal";
import BaseCheckVue from "../DynamicFormItemControls/BaseCheck.vue";
import BaseDivider from "../DynamicFormItemControls/BaseDivider.vue";
import BaseInputVue from "../DynamicFormItemControls/BaseInput.vue";
import BaseRadio from "../DynamicFormItemControls/BaseRadio.vue";
import BaseSelectVue from "../DynamicFormItemControls/BaseSelect.vue";
import BaseTextAreaVue from "../DynamicFormItemControls/BaseTextArea.vue";
import { DynamicFormItemRegistry, DynamicFormItemRegistryItem } from "./DynamicFormItemRegistry";

let registeredInternal = false;

export interface DynamicFormItemRendererInterface {
  getRef: () => unknown,
}
/**
 * 动态表单条目渲染组件。
 */
export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IDynamicFormItem>,
    },
    disabled: {
      type: Boolean
    },
    parentModel: {
    },
    value: {
    },
    name: {
      type: String
    },
    additionalProps: {
      type: Object as PropType<Record<string, unknown>>,
    },
  },
  emits: [ 
    'update:value'
  ],
  setup(props, context) {
    const {
      item,
      additionalProps,
      disabled,
      parentModel,
      value,
      name,
    } = toRefs(props);

    const componentRef = ref();
    const componentInstance = ref(null as any);
    const componentAdditionalProps = ref(null as any);
    const componentValueName = ref(null as any);
    const componentOnUpdateValueName = ref(null as any);

    function getRef() {
      return componentRef.value;
    }
    function onUpdateValue(v: unknown) {
      //通知更新
      if (item.value?.watch)
        item.value.watch(value.value, v, getRef);
      context.emit('update:value', v);
    }
    function registerInternalDynamicFormItemControls() : void {
      //注册所有内置表单组件类型
      if (!registeredInternal) {
        registeredInternal = true;
        DynamicFormItemRegistry.registerDynamicFormItemControl('base-text', markRaw(BaseInputVue));
        DynamicFormItemRegistry.registerDynamicFormItemControl('base-select', markRaw(BaseSelectVue));
        DynamicFormItemRegistry.registerDynamicFormItemControl('base-textarea', markRaw(BaseTextAreaVue));
        DynamicFormItemRegistry.registerDynamicFormItemControl('base-check', markRaw(BaseCheckVue));
        DynamicFormItemRegistry.registerDynamicFormItemControl('base-radio', markRaw(BaseRadio));
        DynamicFormItemRegistry.registerDynamicFormItemControl('base-divider', markRaw(BaseDivider));
      }
    }
    function findComponent() {
      const itemValue = (item.value as IDynamicFormItem);

      if (!itemValue?.type) {
        componentInstance.value = null;
        return;
      }

      let type : DynamicFormItemRegistryItem|null = null;
      if (widgetOvrride)
        type = (widgetOvrride as Record<string, DynamicFormItemRegistryItem>)[itemValue.type];

      if (type == null)
        type = DynamicFormItemRegistry.findDynamicFormItemByType(itemValue.type);

      if (type == null) {
        componentInstance.value = null;
        return;
      }
      
      componentInstance.value = type.componentInstance;
      componentAdditionalProps.value = type.additionalProps;
      componentValueName.value = type.valueName;
      componentOnUpdateValueName.value = 'onUpdate:'+ type.valueName;
    }

    const rawModel = inject<Record<string, unknown>>('rawModel'); 
    const widgetOvrride = inject<Record<string, DynamicFormItemRegistryItem>>('widgetOvrride'); 
    const messageCenter = inject<IDynamicFormMessageCenter>('messageCenter'); 
    
    watch(item, () => {
      findComponent();
    });
    onMounted(() => {
      registerInternalDynamicFormItemControls();
      findComponent();
      //注册事件中心
      messageCenter?.addInstance(name.value!, onMessage)
      //通知钩子
      item.value?.mounted?.(value.value, getRef);
    });
    onBeforeUnmount(() => {
      //移除事件中心
      messageCenter?.removeInstance(name.value!)
      //通知钩子
      item.value?.beforeUnmount?.(getRef());
    });

    function onMessage(messageName: string, data: unknown) {
      switch (messageName) {
        case MESSAGE_RELOAD:
          if (typeof componentRef.value?.reload === 'function')
            componentRef.value.reload();
          break;
        default:
          if (typeof componentRef.value?.message === 'function')
            componentRef.value.message(messageName, data);
          break;
      }
      //通知钩子
      item.value?.message?.(messageName, data, getRef());
    }

    context.expose({
      onUpdateValue,
      registerInternalDynamicFormItemControls,
      findComponent,
      getRef,
      rawModel,
      widgetOvrride,
      componentRef,
      componentInstance,
      componentAdditionalProps,
      componentValueName,
      componentOnUpdateValueName,
    });

    return () => {
      if (componentInstance.value) {
        const props = {
          ref: componentRef,
          ...(componentAdditionalProps.value as Record<string, unknown>),
          ...(additionalProps.value as Record<string, unknown>),
          disabled: disabled.value,
          item: item.value,
          rawModel: rawModel,
          parentModel: parentModel.value,
          name: name.value,
          //双向数据绑定属性
          [componentValueName.value]: value.value,
          [componentOnUpdateValueName.value]: (v: unknown) => onUpdateValue(v),
        } as Record<string, unknown>;

        const additionalEvents = item.value?.additionalEvents as Record<string, unknown>;
        const additionalDirectProps = item.value?.additionalDirectProps as Record<string, unknown>;
        const additionalSlot = item.value?.additionalSlot;

        if (additionalDirectProps && typeof additionalDirectProps === 'object') {
          for (const key in additionalDirectProps)
            props[key] = additionalDirectProps[key];
        }
        if (additionalEvents) {
          for (const key in additionalEvents) {
            //转换名称
            props[`on${key.charAt(0).toLocaleUpperCase()}${key.substring(1)}`] = additionalEvents[key];
          }
        }

        return h(componentInstance.value, props, additionalSlot);
        
      } else {
        return h('span', {
          class: 'dynamic-form-error-alert'
        }, `警告：未找到表单组件实例 ${(item.value as IDynamicFormItem)?.type || '未知'} ${JSON.stringify(widgetOvrride || {})}`);
      }
    }
  },
});

</script>