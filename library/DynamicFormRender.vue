<script lang="ts">
import { defineComponent, toRefs, h, type PropType, ref } from 'vue';
import DynamicFormRoot from './DynamicFormRoot.vue';
import DynamicFormDefaultForm from './DynamicFormBasicControls/Form.vue';
import type { IDynamicFormObject } from './DynamicForm';
import type { Rule } from 'async-validator';
import type { ColProps } from './DynamicFormBasicControls';
import type { IDynamicFormOptions } from './DynamicFormDefs/DynamicFormOptions';

/**
 * 动态表单组件。
 */
export default defineComponent({
  components: {
    DynamicFormRoot,
    DynamicFormDefaultForm,
  },
  props: {
    finalOptions: {
      type: Object as PropType<IDynamicFormOptions>,
      required: true,
    },
    model: {
      type: Object as PropType<IDynamicFormObject>,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  emits: [ 'finish', 'finishFailed', 'submit' ],
  setup(props, ctx) {

    const { finalOptions, model, name } = toRefs(props);
    const formEditor = ref();

    ctx.expose({
      formEditor,
      getFormRef: () => formEditor.value,
    })

    return () => {

      const renderChildren = () => h(DynamicFormRoot as any, { 
        options: finalOptions.value, 
        model: model.value,
        name: name.value,
      }, ctx.slots);
      const internalWidgetsForm = finalOptions.value.internalWidgets?.Form;
      const {
        formRules = {},
        formLabelWidth = '150px',
        formLabelCol = {},
        formWrapperCol = {},
        formAdditionaProps = {},
        formAdditionalEvents = {},
      } = finalOptions.value;

      //自定义渲染Form
      if (internalWidgetsForm) {
        return h(internalWidgetsForm.component as any, {
          ...props,
          ref: formEditor,
          name: name.value,
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
          name: name.value,
          ref: formEditor,
          rules: formRules as Record<string, Rule>,
          model: model.value,
          labelCol: formLabelCol as ColProps,
          labelWidth: formLabelWidth,
          wrapperCol: formWrapperCol as ColProps,
          ...formAdditionaProps,
          onFinish: () => ctx.emit('finish'),
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
@use './Scss/Color.scss';
@use './Scss/BaseControl.scss';
@use './Scss/Form.scss';

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
  color: var(--dynamic-form-text-color);
}
</style>