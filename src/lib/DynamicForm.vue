<script lang="ts">
import { defineComponent, provide, toRefs, ref, h, PropType, onMounted } from 'vue';
import DynamicFormInner from './DynamicFormInner.vue';
import DynamicFormDefaultForm from './DynamicFormBasicControls/Form';
import { defaultDynamicFormOptions, IDynamicFormOptions } from './DynamicForm';

/**
 * 动态表单组件。
 */
export default defineComponent({
  components: {
    DynamicFormInner,
    DynamicFormDefaultForm,
  },
  props: {
    options: {
      type: Object as PropType<IDynamicFormOptions>,
      default: null
    },
    model: {
      type: Object,
      default: null
    },
  },
  emits: [ 
    /**
     * 提交表单且数据验证成功后回调事件
     */
    'finish',
    /**
     * 提交表单且数据验证失败后回调事件
     */
    'finishFailed',
    /**
     * 数据验证成功后回调事件
     */
    'submit',
    /**
     * 表单初始化完成，实例引用已经就绪时发出事件
     */
    'ready',
  ],
  setup(props, ctx) {
    const { options, model } = toRefs(props);
    const finalOptions = {
      ...defaultDynamicFormOptions,
      ...options.value,
    } as IDynamicFormOptions;

    provide('widgetOvrride', finalOptions.widgets || {});
    provide('internalWidgets', finalOptions.internalWidgets);
    provide('formRules', finalOptions.formRules);
    provide('rawModel', model.value);

    const formEditor = ref();
    const widgetsRefMap = ref<Record<string,() => unknown>>({});
      
    provide('widgetsRefMap', widgetsRefMap.value);

    function getFormItemControlRef(key: string) {
      return widgetsRefMap.value[key]?.();
    }
    
    function accessFormModel(keyName: string, isSet: boolean, setValue: unknown) : unknown {
      const keys = keyName.split('.');
      let ret : unknown = undefined;
      let obj = model.value as Record<string, unknown>;
      let keyIndex = 0;
      let key = keys[keyIndex];
      while (obj) {
        const leftIndex = key.indexOf('[');
        if (leftIndex > 0 && key.endsWith(']')) {
          const arr = obj[key.substring(0, leftIndex)] as Record<string, unknown>[];
          const index = parseInt(key.substring(leftIndex + 1, key.length - 1))    
          obj = arr[index];
          if (keyIndex >= keys.length - 1) {
            ret = obj;
            if (isSet) arr[index] = setValue as Record<string, unknown>;
          }
        } else {
          const newObj = obj[key] as Record<string, unknown>;
          if (keyIndex >= keys.length - 1) {
            ret = newObj;
            if (isSet)
              obj[key] = setValue as Record<string, unknown>;
          }
          obj = newObj;
        }
        if (keyIndex < keys.length - 1)
          key = keys[++keyIndex];
        else
          break;
      }
      return ret;
    } 

    onMounted(() => {
      setTimeout(() => {
        ctx.emit('ready');
      }, 400);
    });

    ctx.expose({  
      /**
       * 获取表单组件的 Ref
       * @returns 
       */
      getFormRef: () => formEditor.value,
      /**
       * 获取表单组件的 Ref
       * @returns 
       */
      getFormItemControlRef,
      /**
       * 触发提交。同 getFormRef().submit() 。
       * @returns 
       */
      submit: () => formEditor.value.submit(),
      /**
       * 外部修改指定单个 field 的数据
       * @returns 
       */
      setValueByPath: (path: string, value: unknown) => {
        return accessFormModel(path, true, value);
      },
      /**
       * 外部获取指定单个 field 的数据
       * @returns 
       */
      getValueByPath: (path: string) => {
        return accessFormModel(path, false, undefined);
      },
    });

    return () => {

      const renderChildren = () => h(DynamicFormInner as any, { options: finalOptions, model: model.value }, ctx.slots);
      const internalWidgetsForm = finalOptions.internalWidgets?.Form;
      const {
        formRules = {},
        formLabelWidth = '150px',
        formLabelCol = {},
        formWrapperCol = {},
        formAdditionaProps = {},
        formAdditionalEvents = {},
      } = finalOptions;

      //自定义渲染Form
      if (internalWidgetsForm) {
        return h(internalWidgetsForm.component as any, {
          ...props,
          ref: formEditor,
          [internalWidgetsForm.propsMap.rules || 'rules']: formRules,
          [internalWidgetsForm.propsMap.model || 'model']: model.value,
          [internalWidgetsForm.propsMap.labelWidth || 'labelWidth']: formLabelWidth,
          [internalWidgetsForm.propsMap.labelCol || 'labelCol']: formLabelCol,
          [internalWidgetsForm.propsMap.wrapperCol || 'wrapperCol']: formWrapperCol,
          [internalWidgetsForm.propsMap.onFinish || 'onFinish']: (d: unknown) => ctx.emit('finish', d),
          [internalWidgetsForm.propsMap.onFinishFailed || 'onFinishFailed']: (d: unknown) => ctx.emit('finishFailed', d),
          [internalWidgetsForm.propsMap.onSubmit || 'onSubmit']: (d: unknown) => ctx.emit('submit', d),
          ...formAdditionaProps,
          ...formAdditionalEvents,
        }, {
          default: renderChildren,
        })
      }

      //默认Form
      return (
        h(DynamicFormDefaultForm, {
          ...props,
          ref: formEditor,
          rules: formRules,
          model: model.value,
          labelCol: formLabelCol,
          labelWidth: formLabelWidth,
          wrapperCol: formWrapperCol,
          ...formAdditionaProps,
          onFinish: (d) => ctx.emit('finish', d),
          onFinishFailed: (d) => ctx.emit('finishFailed', d),
          onSubmit: (d) => ctx.emit('submit', d),
          ...formAdditionalEvents,
        }, {
          default: renderChildren,
        })
      )
    };
  },
});
</script>

<style lang="scss">
@import './Scss/BaseControl.scss';
@import './Scss/Form.scss';

.dynamic-form-item-flow {
  display: none;
  position: absolute;
  top: 4px;
  left: 5px;
  bottom: 0;
  z-index: 10;
}
.dynamic-form-item-empty {
  padding: 140px 20px;
  text-align: center;
  color: #5f5f5f;
}
</style>