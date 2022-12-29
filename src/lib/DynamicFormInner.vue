<!-- eslint-disable vue/no-mutating-props -->
<template>
  <!--空显示-->
  <slot name="empty" v-if="options.formItems.length == 0">
    <div class="dynamic-form-item-empty">暂无可供您编辑的数据</div>
  </slot>
  <!--行-->
  <Row
    type="flex"
    :wrap="true"
    justify="space-between"
  >
    <!--列-->
    <Col
      v-for="(item, index) in options.formItems"
      :key="index"
      :span="24"
    >
      <!--表单条目渲染核心-->
      <DynamicFormItem 
        :item="item"
        :name="item.name"
        :rawModel="model"
        :model="model[item.name]"
        :parentModel="model"
        @update:value="(v: unknown) => model[item.name] = v"
        :disabled="options.disabled"
      >
        <template #arrayButtonAdd="props">
          <slot name="formArrayButtonAdd" v-bind="props" />
        </template>
        <template #arrayButtons="props">
          <slot name="formArrayButtons" v-bind="props" />
        </template>
        <template #formCeil="values">
          <slot name="formCeil" v-bind="values" />
        </template>
      </DynamicFormItem>
    </Col>
  </Row>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IDynamicFormOptions, IDynamicFormObject } from './DynamicForm';
import DynamicFormItem from './DynamicFormItem.vue';
import Col from './DynamicFormBasicControls/Layout/Col';
import Row from './DynamicFormBasicControls/Layout/Row';

/**
 * 动态表单组件。
 */
export default defineComponent({
  components: {
    DynamicFormItem,
    Col,
    Row,
  },
  props: {
    model: {
      type: Object as PropType<IDynamicFormObject>,
      default: null
    },
    options: {
      type: Object as PropType<IDynamicFormOptions>,
      default: null
    },
  },
});
</script>
