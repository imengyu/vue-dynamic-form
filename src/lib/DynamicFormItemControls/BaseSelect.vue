<template>
  <select
    class="dynamic-form-base-control" 
    :modelValue="value"
    @blur="onBlur"
    @update:modelValue="onValueUpdate">
    <option v-for="(it, k) in options" :key="k" :value="it.value" :selected="it.value === value">{{ it.text }}</option>
  </select>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { IDynamicFormItemSelectOption } from "./BaseSelect";
import { useInjectFormItemContext } from "../DynamicFormBasicControls";

defineProps({
  value: {},
  options: {
    type: Object as PropType<IDynamicFormItemSelectOption[]>,
    default: null,
  },
});

const emit = defineEmits([ 'update:value' ]);

const formContext = useInjectFormItemContext();

function onBlur() {
  formContext.onFieldBlur();
}
function onValueUpdate(v: string) {
  emit('update:value', v);
  formContext.onFieldChange(v);
}
</script>