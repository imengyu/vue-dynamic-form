
<template>
  <div v-if="model && (!item.showCondition || item.showCondition(model, item, formRules))">
    <!--对象组-->
    <template v-if="item.type === 'object'">
      <!--循环子条目-->
      <DynamicFormItem 
        v-for="(child, k) in item.children"
        :key="k"
        :item="child"
        :name="item.name+'.'+child.name"
        :rawModel="rawModel"
        :model="((model[item.name] as Record<string, unknown>)[child.name] as Record<string, unknown>)"
        :disabled="disabled"
      />
    </template>
    <!--对象组-->
    <FormGroup v-else-if="item.type === 'group-object'" :title="item.label" v-bind="item.additionalProps">
      <Col
        v-for="(child, k) in item.children" 
        v-bind="{ ...item.childrenColProps, ...child.colProps }"
        :key="k"
      >
        <!--循环子条目-->
        <DynamicFormItem 
          :item="child"
          :name="item.name+'.'+child.name"
          :rawModel="rawModel"
          :model="((model[item.name] as Record<string, unknown>)[child.name] as Record<string, unknown>)"
          :disabled="disabled"
        />
      </Col>
    </FormGroup>
    <!--扁平组-->
    <FormGroup v-else-if="item.type === 'group-flat'" :title="item.label" v-bind="item.additionalProps">
      <Col
        v-for="(child, k) in item.children" 
        v-bind="{ ...item.childrenColProps, ...child.colProps }"
        :key="k"
      >
        <!--循环子条目-->
        <DynamicFormItem 
          :item="child"
          :model="model"
          :name="item.name+'.'+child.name"
          :rawModel="rawModel"
          :disabled="disabled"
        >
          <template #formCeil="{item,model,rawModel,rule,disabled}">
            <slot 
              name="formCeil"
              :item="item"
              :model="model"
              :rawModel="rawModel"
              :rule="rule"
              :disabled="disabled"
            />
          </template>
        </DynamicFormItem>
      </Col>
    </FormGroup>
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
          :model="model"
          :item="item"
          :rawModel="rawModel"
          :addCallback="item.newChildrenObject"
          :deleteCallback="item.deleteChildrenCallback"
          v-bind="(item.additionalProps as Record<string, unknown>)"
        >
          <template #addButton="props">
            <slot name="arrayButtonAdd" v-bind="props" />
          </template>
          <template #deleteButton="props">
            <slot name="arrayButtonDelete" v-bind="props" />
          </template>
          <template #child="{ item, kname, model }">
            <DynamicFormItem
              :item="item"
              :name="kname"
              :rawModel="rawModel"
              :model="model"
              :disabled="disabled"
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
      :model="model"
      :rawModel="rawModel"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType } from 'vue';
import { IDynamicFormItem } from './DynamicForm';
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
      type: String
    },
    disabled: {
      type: Boolean
    },
    model: {
      type: Object as PropType<Record<string, unknown>>,
    },
    rawModel: {
      type: Object as PropType<Record<string, unknown>>,
    },
  },
  setup() {
    const formRules = inject<Record<string, Rule>>('formRules'); 

    return {
      formRules,
    }
  },
  components: { DynamicFormItemNormal, FormGroup, FormArrayGroup, Col }
});

</script>