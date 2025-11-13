<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable vue/no-mutating-props -->
<script lang="ts">
import { defineComponent, h, inject, markRaw, onBeforeUnmount, onMounted, type PropType, type Ref, ref, toRefs, watch } from "vue";
import { type IDynamicFormItem, type IDynamicFormOptions, MESSAGE_RELOAD } from "../DynamicForm";
import { type IDynamicFormMessageCenter } from "../DynamicForm";
import { DynamicFormItemRegistry, type DynamicFormItemRegistryItem } from "./DynamicFormItemRegistry";
import BaseCheckVue from "../DynamicFormItemControls/BaseCheck.vue";
import BaseDivider from "../DynamicFormItemControls/BaseDivider.vue";
import BaseInputVue from "../DynamicFormItemControls/BaseInput.vue";
import BaseRadio from "../DynamicFormItemControls/BaseRadio.vue";
import BaseSelectVue from "../DynamicFormItemControls/BaseSelect.vue";
import BaseTextAreaVue from "../DynamicFormItemControls/BaseTextArea.vue";
import Alert from "../DynamicFormBasicControls/Blocks/Alert.vue";
import NextTabButton from "../DynamicFormBasicControls/Blocks/NextTabButton.vue";

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
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    parentModel: {
      type: null,
      default: null,
    },
    value: {
      type: null,
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    additionalProps: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => ({}),
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

    const formName = inject('formName', '');

    function getRef() {
      return componentRef.value;
    }
    function onUpdateValue(v: unknown) {
      //通知更新
      if (item.value?.watch)
        item.value.watch(value.value, v, rawModel.value, getRef);
      context.emit('update:value', v);
    }
    function registerInternalDynamicFormItemControls() : void {
      //注册所有内置表单组件类型
      if (!registeredInternal) {
        registeredInternal = true;
        DynamicFormItemRegistry.register('base-text', markRaw(BaseInputVue));
        DynamicFormItemRegistry.register('base-select', markRaw(BaseSelectVue));
        DynamicFormItemRegistry.register('base-textarea', markRaw(BaseTextAreaVue));
        DynamicFormItemRegistry.register('base-check', markRaw(BaseCheckVue));
        DynamicFormItemRegistry.register('base-radio', markRaw(BaseRadio));
        DynamicFormItemRegistry.register('base-divider', markRaw(BaseDivider));
        DynamicFormItemRegistry.register('base-next-tab-button', markRaw(NextTabButton));
      }
    }
    function findComponent() {
      const itemValue = (item.value as IDynamicFormItem);

      if (!itemValue?.type) {
        componentInstance.value = null;
        return;
      }

      let type : DynamicFormItemRegistryItem|null = null;
      if (finalOptions?.value.widgets)
        type = (finalOptions.value.widgets as Record<string, DynamicFormItemRegistryItem>)[itemValue.type];

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

    const finalOptions = inject<Ref<IDynamicFormOptions>>('finalOptions'); 
    const rawModel = inject<Ref<Record<string, unknown>>>('rawModel', ref({})); 
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
      item.value?.mounted?.(value.value, rawModel.value, getRef);
    });
    onBeforeUnmount(() => {
      //移除事件中心
      messageCenter?.removeInstance(name.value!)
      //通知钩子
      item.value?.beforeUnmount?.(value.value, rawModel.value, getRef());
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
          disabled: disabled.value,
          item: item.value,
          rawModel: rawModel.value,
          parentModel: parentModel.value,
          name: name.value,
          'data-dynamic-form-item-name': item.value.name,
          'data-dynamic-form-item-type': item.value.type,
          ...(additionalProps.value as Record<string, unknown>),
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

        try {
          return h(componentInstance.value, props, additionalSlot);
        } catch (error) {
          return h(Alert, {
            type: 'error',
            message: 'DynamicForm render error: ' + (error instanceof Error ? error.message : 'Unknown Error'),
            extraMessage: `At form ${formName || 'unnamed'}: ${name.value || 'unnamed'}`,
          });
        }
        
      } else {
        return h(Alert, {
          type: 'error',
          message: `DynamicForm: Not found component instance for type ${(item.value as IDynamicFormItem)?.type || 'unknown'}`,
          extraMessage: `At form ${formName || 'unnamed'}: ${name.value || 'unnamed'}`,
        });
      }
    }
  },
});

</script>