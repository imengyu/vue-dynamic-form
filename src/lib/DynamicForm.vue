<script lang="ts">
import { defineComponent, provide, toRefs, ref, h, PropType } from 'vue';
import DynamicFormInner from './DynamicFormInner.vue';
import DynamicFormDefaultForm from './DynamicFormBasicControls/Form';
import { IDynamicFormOptions } from './DynamicForm';

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
  ],
  setup(props, ctx) {
    const { options: options, model } = toRefs(props);

    provide('widgetOvrride', options.value.widgets || {});
    provide('internalWidgets', options.value.internalWidgets);
    provide('formRules', options.value.formRules);
    provide('rawModel', model.value);

    const formEditor = ref();
    const widgetsRefMap = ref<Record<string,() => unknown>>({});
      
    provide('widgetsRefMap', widgetsRefMap.value);

    function getFormItemControlRef(key: string) {
      return widgetsRefMap.value[key]?.();
    }
    
    ctx.expose({
      getFormRef: () => formEditor.value,
      getFormItemControlRef,
    });

    return () => {

      const renderChildren = () => h(DynamicFormInner as any, { options: options.value, model: model.value }, ctx.slots);
      const internalWidgetsForm = options.value.internalWidgets?.Form;
      const {
        formRules = {},
        formLabelWidth = '150px',
        formLabelCol = {},
        formWrapperCol = {},
        formAdditionaProps = {},
        formAdditionalEvents = {},
      } = options.value;

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