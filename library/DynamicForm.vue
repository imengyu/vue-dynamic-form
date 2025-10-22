<script lang="ts">
import { defineComponent, provide, toRefs, ref, h, PropType, onMounted, watch, toRef } from 'vue';
import DynamicFormRoot from './DynamicFormRoot.vue';
import DynamicFormDefaultForm from './DynamicFormBasicControls/Form.vue';
import { 
  defaultDynamicFormOptions, IDynamicFormOptions, MESSAGE_RELOAD, 
  IDynamicFormMessageCenter, IDynamicFormMessageCenterCallback, 
  IDynamicFormObject
} from './DynamicForm';
import { Rule } from 'async-validator';
import { ColProps } from 'DynamicFormBasicControls';

/**
 * 动态表单组件。
 */
export default defineComponent({
  components: {
    DynamicFormRoot,
    DynamicFormDefaultForm,
  },
  props: {
    /**
     * 动态表单选项
     */
    options: {
      type: Object as PropType<IDynamicFormOptions>,
      default: null
    },
    /**
     * 表单数据模型
     */
    model: {
      type: Object,
      default: null
    },
    /**
     * 表单名称, 设置到表单组件上。
     */
    name: {
      type: String,
      default: ''
    },
    /**
     * TODO: 全局参数。用于向每个表单项的参数中添加额外的参数，可以在回调中的 formGlobalParams 中访问。
     */
    globalParams: {
      type: Object as PropType<IDynamicFormObject>,
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
    const { options, model, name } = toRefs(props);

    const finalOptions = ref<IDynamicFormOptions>({
      ...defaultDynamicFormOptions,
      ...options.value,
    });

    watch(options, () => {
      finalOptions.value = {
        ...defaultDynamicFormOptions,
        ...options.value,
      };
    });

    provide('rawModel', model);
    provide('globalParams', toRef(props, 'globalParams'));
    provide('formName', name.value || 'unnamed');
    provide('finalOptions', finalOptions);

    const formEditor = ref();
    const widgetsRefMap = ref<Record<string,() => unknown>>({});
    const messageCenterMap = new Map<string, IDynamicFormMessageCenterCallback>();
      
    provide('widgetsRefMap', widgetsRefMap.value);
    provide('messageCenter', {
      addInstance: (name: string, fn: IDynamicFormMessageCenterCallback) => messageCenterMap.set(name, fn),
      removeInstance: (name: string) => messageCenterMap.delete(name),
    } as IDynamicFormMessageCenter);

    //获取组件引用
    function getFormItemControlRef(key: string) {
      return widgetsRefMap.value[key]?.();
    }
    
    //通过路径访问
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

    //发送通知消息
    function dispatchMessage(messageName: string, data?: unknown, receiveFilter?: RegExp) {
      for (const iterator of messageCenterMap) {
        if (!receiveFilter || receiveFilter.test(iterator[0]))
          iterator[1](messageName, data);
      }
    }

    //发送重新加载消息
    function dispatchReload() {
      dispatchMessage(MESSAGE_RELOAD);
    }

    //获取当前表单中可见的所有字段名
    function getVisibleFormNames() {
      return Array.from(messageCenterMap.keys());
    }

    onMounted(() => {
      setTimeout(() => {
        ctx.emit('ready');
      }, 400);
    });

    ctx.expose({
      /**
       * 获取当前表单中可见的所有字段名
       */
      getVisibleFormNames,
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
       * 默认函数名是 submit ，可以通过 propsMap.submit 自定义。
       * @returns 
       */
      submit: () => formEditor.value[finalOptions.value.internalWidgets?.Form?.propsMap.submit || 'submit'](),
      /**
       * 验证当前表单数据是否有效。同 getFormRef().validate() 。
       * 默认函数名是 validate ，可以通过 propsMap.validate 自定义。
       * @returns 
       */
      validate: () => formEditor.value[finalOptions.value.internalWidgets?.Form?.propsMap.validate || 'validate'](),
      /**
       * 外部修改指定单个 field 的数据
       * @returns 
       */
      setValueByPath: (path: string|string[], value: unknown) => {
        if (Array.isArray(path))
          path = path.join('.');
        return accessFormModel(path, true, value);
      },
      /**
       * 外部获取指定单个 field 的数据
       * @returns 
       */
      getValueByPath: (path: string|string[]) => {
        if (Array.isArray(path))
          path = path.join('.');
        return accessFormModel(path, false, undefined);
      },
      dispatchMessage,
      dispatchReload,
    });

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
@import './Scss/Color.scss';
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
  color: var(--dynamic-form-text-color);
}
</style>