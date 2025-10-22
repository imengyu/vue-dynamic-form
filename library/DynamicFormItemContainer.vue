
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
    <template v-if="item.type === 'object'">
      <div v-if="model === undefined">
        <span class="dynamic-form-error-alert"> [object] Warn: Input field {{ name }} is undefined</span>
      </div>
      <template v-else>
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
        <DynamicFormItem 
          v-for="(child, k) in item.children"
          :key="k"
          :item="child"
          :name="name+'.'+child.name"
          :rawModel="rawModel"
          :model="(model as IDynamicFormObject)[child.name]"
          :parentModel="model"
          :parentName="name"
          @update:model="(v: unknown) => (model as IDynamicFormObject)[child.name] = v"
          :disabled="disabled || evaluateCallback(item.disabled)"
        />
      </template>
    </template>
    <!--对象组-->
    <FormGroup v-else-if="item.type === 'group-object'" :title="evaluateCallback(item.label)" v-bind="(item.additionalProps as object)">
      <div v-if="model === undefined">
        <span class="dynamic-form-error-alert"> [group-object] Warn: Input field {{ name }} is undefined</span>
      </div>
      <Row v-else v-bind="item.rowProps">
        <!--循环子条目-->
        <DynamicFormItem 
          v-for="(child, k) in item.children" 
          :key="k"
          :item="child"
          :colProps="{ ...item.childrenColProps, ...child.colProps }"
          :name="name+'.'+child.name"
          :rawModel="rawModel"
          :model="((model as IDynamicFormObject)[child.name] as IDynamicFormObject)"
          :parentModel="model"
          :parentName="name"
          @update:model="(v: unknown) => (model as IDynamicFormObject)[child.name] = v"
          :disabled="disabled || evaluateCallback(item.disabled)"
        />
      </Row>
    </FormGroup>
    <!--扁平组-->
    <FormGroup v-else-if="item.type === 'group-flat'" :title="evaluateCallback(item.label)" v-bind="(item.additionalProps as object)">
      <Row v-bind="item.rowProps">
        <!--循环子条目-->
        <DynamicFormItem 
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
            <slot name="formCeil" v-bind="values" />
          </template>
        </DynamicFormItem>
      </Row>
    </FormGroup>
    <!--自定义扁平组-->
    <FormCustomLayout v-else-if="item.type === 'custom-flat'" :item="item">
      <!--循环子条目-->
      <DynamicFormItem 
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
          <slot name="formCeil" v-bind="values" />
        </template>
      </DynamicFormItem>
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
          <DynamicFormItem 
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
              <slot name="formCeil" v-bind="values" />
            </template>
          </DynamicFormItem>
        </DynamicFormTabPage>
      </template>
    </DynamicFormTab>
    <!--扁平普通-->
    <DynamicFormItemNormal v-else-if="item.type === 'simple-flat'" 
      :item="item"
      :name="name"
      :disabled="disabled || evaluateCallback(item.disabled)"
      :model="(model as IDynamicFormObject)"
      :rawModel="rawModel"
      :parentModel="parentModel"
      :parentName="parentName"
    >
      <template #insertion>
        <Row v-bind="item.rowProps">
          <!--循环子条目-->
          <DynamicFormItem 
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
              <slot name="formCeil" v-bind="values" />
            </template>
          </DynamicFormItem>
        </Row>
      </template>
    </DynamicFormItemNormal>
    <!--数组变量组-->
    <DynamicFormItemNormal v-else-if="item.type === 'array-single'" 
      :item="item"
      :name="name"
      :disabled="disabled || evaluateCallback(item.disabled)"
      :model="(model as IDynamicFormObject)"
      :rawModel="rawModel"
      :parentModel="parentModel"
      :parentName="name"
    >
      <template #insertion>
        <FormArrayGroup
          :model="(model as unknown as unknown[])"
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
            <DynamicFormItem
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
    <!--数组对象组-->
    <DynamicFormItemNormal v-else-if="item.type === 'array-object'" 
      :item="item"
      :name="name"
      :disabled="disabled || evaluateCallback(item.disabled)"
      :model="model"
      :rawModel="rawModel"
      :parentModel="parentModel"
      :parentName="parentName"
    >
      <template #insertion>
        <FormArrayGroup
          :model="(model as unknown as unknown[])"
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
            <DynamicFormItem
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
    <!--正常条目-->
    <DynamicFormItemNormal
      v-else
      :item="item"
      :name="name"
      :disabled="disabled || evaluateCallback(item.disabled)"
      :rawModel="rawModel"
      :parentModel="parentModel"
      :model="model"
      @update:model="(v: unknown) => $emit('update:model', v)"
    >
      <template #formCeil="values">
        <slot name="formCeil" v-bind="values" />
      </template>
    </DynamicFormItemNormal>
  </Col>
</template>

<script lang="ts" setup>
import { inject, PropType, Ref, toRefs } from 'vue';
import { IDynamicFormItem, IDynamicFormItemCallback, IDynamicFormObject, IDynamicFormOptions } from './DynamicForm';
import { Rules } from 'async-validator';
import DynamicFormItemNormal from './DynamicFormItemNormal.vue';
import FormGroup from './DynamicFormItemControls/FormGroup.vue';
import FormArrayGroup from './DynamicFormItemControls/FormArrayGroup.vue';
import DynamicFormTab from './DynamicFormTab/DynamicFormTab.vue';
import DynamicFormTabPage from './DynamicFormTab/DynamicFormTabPage.vue';
import FormCustomLayout from './DynamicFormItemControls/FormCustomLayout.vue';
import Col, { ColProps } from './DynamicFormBasicControls/Layout/Col.vue';
import Row from './DynamicFormBasicControls/Layout/Row.vue';

/**
 * 动态表单条目渲染组件。
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
    type: Boolean
  },
  model: {
    required: true,
  },
  parentModel: {
    required: true,
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

const propsP = toRefs(props);
const finalOptions = inject<Ref<IDynamicFormOptions>>('finalOptions'); 

function evaluateCallback<T>(val: T|IDynamicFormItemCallback<T>) {
  if (typeof val === 'object' && typeof (val as IDynamicFormItemCallback<T>).callback === 'function')
    return (val as IDynamicFormItemCallback<T>).callback(
      propsP.model.value, 
      propsP.rawModel.value,
      propsP.parentModel.value,
      propsP.item.value,
      (finalOptions?.value.formRules ?? {}) as Record<string, Rules>,
    );
  return val as T;
}
</script>