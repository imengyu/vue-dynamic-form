<template>
  <DynamicFormRender 
    ref="formInnerRef"
    :finalOptions="finalOptions" 
    :model="model" 
    :name="name" 
    @finish="emits('finish')"
    @finishFailed="emits('finishFailed', $event)"
    @submit="emits('submit', $event)"
  />
</template>

<script setup lang="ts" generic="T extends IDynamicFormOptions">
import { provide, toRefs, ref, onMounted, toRef, computed } from 'vue';
import { 
  MESSAGE_RELOAD, 
  type IDynamicFormMessageCenter, type IDynamicFormMessageCenterCallback, 
  type IDynamicFormProps,
} from './DynamicForm';
import { requireNotNull } from '@imengyu/imengyu-utils';
import { defaultDynamicFormOptions } from './DynamicFormDefs/DynamicFormOptions';
import type { IDynamicFormOptions, IDynamicFormRef } from './DynamicFormDefs/DynamicFormOptions';
import type { IDynamicFormItem } from './DynamicFormDefs/DynamicFormItem';
import DynamicFormRender from './DynamicFormRender.vue';

/**
 * 动态表单组件。
 */

const props = withDefaults(defineProps<IDynamicFormProps<T>>(), {
  model: () => ({}),
  name: '',
  options: () => defaultDynamicFormOptions as T,
});

const emits = defineEmits<{
  /**
   * 提交表单且数据验证成功后回调事件
   */
  finish: [];
  /**
   * 提交表单且数据验证失败后回调事件
   */
  finishFailed: [errors: unknown];
  /**
   * 数据验证成功后回调事件
   */
  submit: [model: Record<string, unknown>];
  /**
   * 表单初始化完成，实例引用已经就绪时发出事件
   */
  ready: [];
}>();


const { options, model, name } = toRefs(props);
const finalOptions = computed<IDynamicFormOptions>(() => ({
  ...defaultDynamicFormOptions,
  ...options.value,
}));

provide('rawModel', model);
provide('globalParams', toRef(props, 'globalParams'));
provide('finalOptions', finalOptions);
provide('editmode', Boolean(props.editorContext));
provide('editorContext', props.editorContext);

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

//初始化默认值到模型
function initDefaultValuesToModel() {
  function loopItems(key: string, parentKey: string, type: string, items: IDynamicFormItem[]) {
    let i = 0;
    for (const item of items) {
      let currentKey = key;
      switch (type) {
        case 'flat-simple':
        case 'flat-group':
          currentKey = (parentKey ? parentKey + '.' : '') + item.name;
          break;
        default:
        case 'object':
        case 'object-group':
          currentKey = (key ? key + '.' : '') + item.name;
          break
        case 'array':
          currentKey = (parentKey ? parentKey + '.' : '') + `[${i}]`;
          break;
        case 'array-object':
          currentKey = (parentKey ? parentKey + '.' : '') + `[${i}]` + item.name;
          break;
      }
      if (item.children) {
        loopItems(currentKey, key, item.type || '', item.children);
      }
      //console.log(currentKey);
      if (item.defaultValue !== undefined) {
        const oldValue = accessFormModel(currentKey, false, undefined);
        if (oldValue !== undefined && oldValue !== null)
          continue;
        let v = item.defaultValue;
        if (typeof v === 'function')
          v = v();
        accessFormModel(currentKey, true, v);
      }
      i++;
    }
  }
  loopItems('', '', '', finalOptions.value.formItems);
}

//获取当前表单中可见的所有字段名
function getVisibleFormNames() {
  return Array.from(messageCenterMap.keys());
}

onMounted(() => {
  setTimeout(() => {
    emits('ready');
  }, 400);
});

const formInnerRef = ref();
const formRef : IDynamicFormRef = {
  initDefaultValuesToModel,
  getVisibleFormNames,
  getFormRef: () => formInnerRef.value.getFormRef(),
  getFormItemControlRef: getFormItemControlRef as any,
  submit() {
    return requireNotNull(this.getFormRef<any>(), 'Form instance was not created!')
      [finalOptions.value.internalWidgets?.Form?.propsMap.submit || 'submit']();
  },
  validate() {
    return requireNotNull(this.getFormRef<any>(), 'Form instance was not created!')
      [finalOptions.value.internalWidgets?.Form?.propsMap.validate || 'validate']();
  },
  setValueByPath: (path: string|string[], value: unknown) => {
    if (Array.isArray(path))
      path = path.join('.');
    return accessFormModel(path, true, value);
  },
  getValueByPath: (path: string|string[]) => {
    if (Array.isArray(path))
      path = path.join('.');
    return accessFormModel(path, false, undefined);
  },
  dispatchMessage,
  dispatchReload,
};

provide('formRef', formRef);
provide('formName', name.value || 'unnamed');

defineExpose(formRef);

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