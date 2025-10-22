
<template>
  <Col 
    v-if="evaluateCallback(item.hidden) !== true"
    :class="[
      'dynamic-form-item-wrapper',
      finalOptions?.nestObjectMargin !== false && item.nestObjectMargin !== false ? 'nest-with-margin' : '',
    ]"
    v-bind="{
      ...colProps,
      ...(item.colProps as {})
    }"
  >
    <!--对象组-->
    <DynamicFormCheckEmpty 
      v-if="item.type === 'object'" 
      :model="model"
      :modelWithDefault="finalModel"
      :suppressEmptyError="finalOptions?.suppressEmptyError || item.suppressEmptyError"
      :name="name"
      checkType="object"
    >
      <!--标题-->
      <DynamicFormItemNormal 
        v-if="item.label"
        :item="item"
        :name="''"
        :rawModel="rawModel"
        :model="null"
        :noLabel="true"
        :disabled="disabled || evaluateCallback(item.disabled)"
      >
        <template #insertion>
          <span v-if="item.label" class="dynamic-form-object-title">{{ evaluateCallback(item.label) }}</span>
        </template>
      </DynamicFormItemNormal>
      <!--循环子条目-->
      <DynamicFormItemContainer 
        v-for="(child, k) in item.children"
        :key="k"
        :item="child"
        :name="name+'.'+child.name"
        :rawModel="rawModel"
        :model="(finalModel as IDynamicFormObject)[child.name]"
        :parentModel="finalModel"
        :parentName="name"
        @update:model="(v: unknown) => (model as IDynamicFormObject)[child.name] = v"
        :disabled="disabled || evaluateCallback(item.disabled)"
      />
    </DynamicFormCheckEmpty>
    <!--对象组-->
    <DynamicFormCheckEmpty 
      v-else-if="item.type === 'group-object'" 
      :model="model"
      :modelWithDefault="finalModel"
      :suppressEmptyError="finalOptions?.suppressEmptyError || item.suppressEmptyError"
      :name="name"
      checkType="object"
    >
      <FormGroup :title="evaluateCallback(item.label)" v-bind="(item.additionalProps as object)">
        <Row v-bind="item.rowProps">
          <!--循环子条目-->
          <DynamicFormItemContainer 
            v-for="(child, k) in item.children" 
            :key="k"
            :item="child"
            :colProps="{ ...item.childrenColProps, ...child.colProps }"
            :name="name+'.'+child.name"
            :rawModel="rawModel"
            :model="((finalModel as IDynamicFormObject)[child.name] as IDynamicFormObject)"
            :parentModel="finalModel"
            :parentName="name"
            @update:model="(v: unknown) => (model as IDynamicFormObject)[child.name] = v"
            :disabled="disabled || evaluateCallback(item.disabled)"
          />
        </Row>
      </FormGroup>
    </DynamicFormCheckEmpty>
    <!--扁平组-->
    <FormGroup v-else-if="item.type === 'group-flat'" :title="evaluateCallback(item.label)" v-bind="(item.additionalProps as object)">
      <Row v-bind="item.rowProps">
        <!--循环子条目-->
        <DynamicFormItemContainer 
          v-for="(child, k) in item.children" 
          :colProps="{ ...item.childrenColProps, ...child.colProps }"
          :key="k"
          :item="child"
          :name="parentName ? `${parentName}.${child.name}` : child.name"
          :rawModel="rawModel"
          :model="((parentModel as IDynamicFormObject)[child.name])"
          :parentModel="parentModel"
          :parentName="parentName"
          @update:model="(v: unknown) => (parentModel as IDynamicFormObject)[child.name] = v"
          :disabled="disabled || evaluateCallback(item.disabled)"
        >
          <template #formCeil="values">
            <slot name="formCeil" v-bind="(values as FormCeilProps)" />
          </template>
        </DynamicFormItemContainer>
      </Row>
    </FormGroup>
    <!--自定义扁平组-->
    <FormCustomLayout v-else-if="item.type === 'custom-flat'" :item="item">
      <!--循环子条目-->
      <DynamicFormItemContainer 
        v-for="(child, k) in item.children" 
        :colProps="{ ...item.childrenColProps, ...child.colProps }"
        :key="k"
        :item="child"
        :name="parentName ? `${parentName}.${child.name}` : child.name"
        :rawModel="rawModel"
        :model="((parentModel as IDynamicFormObject)[child.name])"
        :parentModel="parentModel"
        :parentName="parentName"
        @update:model="(v: unknown) => (parentModel as IDynamicFormObject)[child.name] = v"
        :disabled="disabled || evaluateCallback(item.disabled)"
      >
        <template #formCeil="values">
          <slot name="formCeil" v-bind="(values as FormCeilProps)" />
        </template>
      </DynamicFormItemContainer>
    </FormCustomLayout>
    <!--标签页-->
    <DynamicFormTab 
      v-else-if="item.type === 'custom-tab'"
      :item="item"
    >
      <template
        v-for="(child, k) in item.children" 
        :key="k"
      >
        <DynamicFormTabPage
          v-if="evaluateCallback(child.hidden) !== true"
          :tab-key="child.name"
          :item="child"
        >
          <!--循环子条目-->
          <DynamicFormItemContainer 
            v-for="(formRow, k) in child.children" 
            :colProps="{ ...child.childrenColProps, ...formRow.colProps }"
            :key="k"
            :item="formRow"
            :name="parentName ? `${parentName}.${formRow.name}` : formRow.name"
            :rawModel="rawModel"
            :model="((parentModel as IDynamicFormObject)[formRow.name])"
            :parentModel="parentModel"
            :parentName="parentName"
            @update:model="(v: unknown) => (parentModel as IDynamicFormObject)[formRow.name] = v"
            :disabled="disabled || evaluateCallback(formRow.disabled)"
          >
            <template #formCeil="values">
              <slot name="formCeil" v-bind="(values as FormCeilProps)" />
            </template>
          </DynamicFormItemContainer>
        </DynamicFormTabPage>
      </template>
    </DynamicFormTab>
    <!--扁平普通-->
    <DynamicFormItemNormal v-else-if="item.type === 'simple-flat'" 
      :item="item"
      :name="name"
      :disabled="disabled || evaluateCallback(item.disabled)"
      :model="(finalModel as IDynamicFormObject)"
      :rawModel="rawModel"
      :parentModel="parentModel"
      :parentName="parentName"
    >
      <template #insertion>
        <Row v-bind="item.rowProps">
          <!--循环子条目-->
          <DynamicFormItemContainer 
            v-for="(child, k) in item.children" 
            :key="k"
            :item="child"
            :colProps="{ ...item.childrenColProps, ...child.colProps }"
            :name="parentName ? `${parentName}.${child.name}` : child.name"
            :rawModel="rawModel"
            :model="((parentModel as IDynamicFormObject)[child.name])"
            :parentModel="parentModel"
            :parentName="parentName"
            @update:model="(v: unknown) => (parentModel as IDynamicFormObject)[child.name] = v"
            :disabled="disabled || evaluateCallback(item.disabled)"
          >
            <template #formCeil="values">
              <slot name="formCeil" v-bind="(values as FormCeilProps)" />
            </template>
          </DynamicFormItemContainer>
        </Row>
      </template>
    </DynamicFormItemNormal>
    <!--数组变量组-->
    <DynamicFormCheckEmpty 
      v-else-if="item.type === 'array-single'"
      :model="model"
      :modelWithDefault="finalModel"
      :suppressEmptyError="finalOptions?.suppressEmptyError || item.suppressEmptyError"
      :name="name"
      checkType="array"
    >
      <DynamicFormItemNormal 
        :item="item"
        :name="name"
        :disabled="disabled || evaluateCallback(item.disabled)"
        :model="(finalModel as IDynamicFormObject)"
        :rawModel="rawModel"
        :parentModel="parentModel"
        :parentName="name"
      >
        <template #insertion>
          <FormArrayGroup
            :model="(finalModel as unknown as unknown[])"
            :item="item"
            :name="name"
            :rawModel="rawModel"
            :isObject="false"
            :addCallback="item.newChildrenObject"
            :deleteCallback="item.deleteChildrenCallback"
            v-bind="(item.additionalProps as IDynamicFormObject)"
          >
            <template #addButton="props">
              <slot name="arrayButtonAdd" v-bind="props" />
            </template>
            <template #itemButton="props">
              <slot name="arrayButtons" v-bind="props" />
            </template>
            <template #child="{ item, kname, model: child, onUpdateValue }">
              <DynamicFormItemContainer
                :item="item"
                :name="kname"
                :rawModel="rawModel"
                :model="child"
                :parentModel="model"
                :parentName="name"
                :disabled="disabled || evaluateCallback(item.disabled)"
                @update:model="(v: unknown) => onUpdateValue(v)"
              />
            </template>
          </FormArrayGroup>
        </template>
      </DynamicFormItemNormal>
    </DynamicFormCheckEmpty>
    <!--数组对象组-->
    <DynamicFormCheckEmpty 
      v-else-if="item.type === 'array-object'"
      :model="model"
      :modelWithDefault="finalModel"
      :suppressEmptyError="finalOptions?.suppressEmptyError || item.suppressEmptyError"
      :name="name"
      checkType="array"
    >
      <DynamicFormItemNormal  
        :item="item"
        :name="name"
        :disabled="disabled || evaluateCallback(item.disabled)"
        :model="finalModel"
        :rawModel="rawModel"
        :parentModel="parentModel"
        :parentName="parentName"
      >
        <template #insertion>
          <FormArrayGroup
            :model="(finalModel as unknown as unknown[])"
            :item="item"
            :name="name"
            :rawModel="rawModel"
            :isObject="true"
            :addCallback="item.newChildrenObject"
            :deleteCallback="item.deleteChildrenCallback"
            v-bind="(item.additionalProps as IDynamicFormObject)"
          >
            <template #addButton="props">
              <slot name="arrayButtonAdd" v-bind="props" />
            </template>
            <template #itemButton="props">
              <slot name="arrayButtons" v-bind="props" />
            </template>
            <template #child="{ item, kname, model: child, onUpdateValue }">
              <DynamicFormItemContainer
                :item="item"
                :name="kname"
                :rawModel="rawModel"
                :model="child"
                :parentModel="model"
                :parentName="name"
                :disabled="disabled || evaluateCallback(item.disabled)"
                @update:model="(v: unknown) => onUpdateValue(v)"
              />
            </template>
          </FormArrayGroup>
        </template>
      </DynamicFormItemNormal>
    </DynamicFormCheckEmpty>
    <!--正常条目-->
    <DynamicFormItemNormal
      v-else
      :item="item"
      :name="name"
      :disabled="disabled || evaluateCallback(item.disabled)"
      :rawModel="rawModel"
      :parentModel="parentModel"
      :model="finalModel"
      @update:model="(v: unknown) => $emit('update:model', v)"
    >
      <template #formCeil="values">
        <slot name="formCeil" v-bind="(values as FormCeilProps)" />
      </template>
    </DynamicFormItemNormal>
  </Col>
</template>

<script lang="ts" setup>
import { inject, PropType, Ref, toRefs, computed, provide } from 'vue';
import { IDynamicFormItem, IDynamicFormItemCallback, IDynamicFormObject, IDynamicFormOptions, IDynamicFormRef, IEvaluateCallback } from './DynamicForm';
import { Rules } from 'async-validator';
import DynamicFormItemNormal, { FormCeilProps } from './DynamicFormItemNormal.vue';
import FormGroup from './DynamicFormItemControls/FormGroup.vue';
import FormArrayGroup from './DynamicFormItemControls/FormArrayGroup.vue';
import DynamicFormTab from './DynamicFormTab/DynamicFormTab.vue';
import DynamicFormTabPage from './DynamicFormTab/DynamicFormTabPage.vue';
import FormCustomLayout from './DynamicFormItemControls/FormCustomLayout.vue';
import Col, { ColProps } from './DynamicFormBasicControls/Layout/Col.vue';
import Row from './DynamicFormBasicControls/Layout/Row.vue';
import DynamicFormCheckEmpty from './DynamicFormCheckEmpty.vue';

/**
 * 动态表单条目包装组件，处理基础类型分支、数据传入、回调处理、事件传递。
 */

const props = defineProps({
  item: {
    type: Object as PropType<IDynamicFormItem>,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  model: {
    type: null
  },
  parentModel: {
    type: null
  },
  parentName: {
    type: String,
    default: null,
  },
  rawModel: {
    type: Object as PropType<IDynamicFormObject>,
    required: true,
  },
  colProps: {
    type: Object as PropType<ColProps>,
    default: null,
  }
});

defineEmits([	'update:model' ]);
defineSlots<{
  formCeil(props: FormCeilProps): any,
  arrayButtonAdd(props: {
    onClick: () => void;
  }): any,
  arrayButtons(props: {
    onDeleteClick: () => void;
    onUpClick: () => void;
    onDownClick: () => void;
  }): any,
}>()

const propsP = toRefs(props);
const finalOptions = inject<Ref<IDynamicFormOptions>>('finalOptions'); 
const globalParams = inject<Ref<IDynamicFormObject>>('globalParams');
const formRef = inject<IDynamicFormRef>('formRef');

//处理默认值
const finalModel = computed(() => {
  const val = props.model
  if (val !== undefined && val !== null)
    return props.model;
  if (props.item.defaultValue) {
    if (typeof props.item.defaultValue === 'function')
      return props.item.defaultValue();
    return props.item.defaultValue;
  }
  return null;
});

//处理回调函数
function evaluateCallback<T>(val: T|IDynamicFormItemCallback<T>) {
  if (typeof val === 'object' && typeof (val as IDynamicFormItemCallback<T>).callback === 'function')
    return (val as IDynamicFormItemCallback<T>).callback(
      finalModel.value, 
      propsP.rawModel.value,
      propsP.parentModel?.value,
      {
        item: propsP.item.value,
        form: formRef!,
        formGlobalParams: globalParams?.value || {},
        formRules: (finalOptions?.value.formRules ?? {}) as Record<string, Rules>,
      }
    );
  return val as T;
}

provide<IEvaluateCallback>('evaluateCallback', evaluateCallback);
</script>