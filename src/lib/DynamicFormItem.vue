
<template>
  <div class="dynamic-form-item-wrapper" v-if="(!item.showCondition || item.showCondition(model, item, formRules))">
    <!--对象组-->
    <template v-if="item.type === 'object'">
      <div v-if="model === undefined">
        <span class="dynamic-form-error-alert"> [object] 警告：输入字段 {{ name }} 是 undefined</span>
      </div>
      <template v-else>
        <!--标题-->
        <DynamicFormItemNormal 
          :item="item"
          :name="''"
          :rawModel="rawModel"
          :model="null"
          :noLable="true"
          :disabled="disabled"
        >
          <template #insertion>
            <span class="dynamic-form-object-title">{{ item.label }}</span>
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
          @update:model="(v: unknown) => (model as IDynamicFormObject)[child.name] = v"
          :disabled="disabled"
        />
      </template>
    </template>
    <!--对象组-->
    <FormGroup v-else-if="item.type === 'group-object'" :title="item.label" v-bind="item.additionalProps">
      <div v-if="model === undefined">
        <span class="dynamic-form-error-alert"> [group-object] 警告：输入字段 {{ name }} 是 undefined</span>
      </div>
      <template v-else>
        <Col
          v-for="(child, k) in item.children" 
          v-bind="{ ...item.childrenColProps, ...child.colProps }"
          :key="k"
        >
          <!--循环子条目-->
          <DynamicFormItem 
            :item="child"
            :name="name+'.'+child.name"
            :rawModel="rawModel"
            :model="((model as IDynamicFormObject)[child.name] as IDynamicFormObject)"
            @update:model="(v: unknown) => (model as IDynamicFormObject)[child.name] = v"
            :disabled="disabled"
          />
        </Col>
      </template>
    </FormGroup>
    <!--扁平组-->
    <FormGroup v-else-if="item.type === 'group-flat'" :title="item.label" v-bind="item.additionalProps">
      <div v-if="model === undefined">
        <span class="dynamic-form-error-alert"> [group-flat] 警告：输入字段 {{ name }} 是 undefined</span>
      </div>
      <template v-else>
        <Col
          v-for="(child, k) in item.children" 
          v-bind="{ ...item.childrenColProps, ...child.colProps }"
          :key="k"
        >
          <!--循环子条目-->
          <DynamicFormItem 
            :item="child"
            :name="name+'.'+child.name"
            :rawModel="rawModel"
            :model="((model as IDynamicFormObject)[child.name])"
            @update:model="(v: unknown) => (model as IDynamicFormObject)[child.name] = v"
            :disabled="disabled"
          >
            <template #formCeil="values">
              <slot name="formCeil" v-bind="values" />
            </template>
          </DynamicFormItem>
        </Col>
      </template>
    </FormGroup>
    <!--数组变量组-->
    <DynamicFormItemNormal v-else-if="item.type === 'array-single'" 
      :item="item"
      :name="name"
      :disabled="disabled"
      :model="(model as IDynamicFormObject)"
      :rawModel="rawModel"
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
          <template #child="{ item, kname, model, onUpdateValue }">
            <DynamicFormItem
              :item="item"
              :name="kname"
              :rawModel="rawModel"
              :model="model"
              :disabled="disabled"
              @update:value="(v: unknown) => onUpdateValue(v)"
            />
          </template>
        </FormArrayGroup>
      </template>
    </DynamicFormItemNormal>
    <!--数组对象组-->
    <DynamicFormItemNormal v-else-if="item.type === 'array-object'" 
      :item="item"
      :name="name"
      :disabled="disabled"
      :model="model"
      :rawModel="rawModel"
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
          <template #child="{ item, kname, model, onUpdateValue }">
            <DynamicFormItem
              :item="item"
              :name="kname"
              :rawModel="rawModel"
              :model="model"
              :disabled="disabled"
              @update:value="(v: unknown) => onUpdateValue(v)"
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
      :disabled="disabled"
      :rawModel="rawModel"
      :model="model"
      @update:model="(v: unknown) => $emit('update:model', v)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType } from 'vue';
import { IDynamicFormItem, IDynamicFormObject } from './DynamicForm';
import DynamicFormItemNormal from './DynamicFormItemNormal.vue';
import FormGroup from './DynamicFormItemControls/FormGroup.vue';
import FormArrayGroup from './DynamicFormItemControls/FormArrayGroup.vue';
import Col from './DynamicFormBasicControls/Layout/Col';
import { Rule } from 'async-validator';

/**
 * 动态表单条目渲染组件。
 */
export default defineComponent({
  name: 'DynamicFormItem',
  props: {
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
      defalut: false,
    },
    model: {
      required: true,
    },
    rawModel: {
      type: Object as PropType<IDynamicFormObject>,
      required: true,
    },
  },
  emits: [ 'update:model' ],
  setup() {
    const formRules = inject<Record<string, Rule>>('formRules'); 

    return {
      formRules,
    }
  },
  components: { DynamicFormItemNormal, FormGroup, FormArrayGroup, Col }
});

</script>