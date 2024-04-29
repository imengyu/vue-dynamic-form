<template>
  <select
    class="dynamic-form-base-control" 
    @blur="onBlur"
    @change="(e: Event) => onValueUpdate(options[parseInt((e.target as HTMLSelectElement).value)].value)"
  >
    <option v-for="(it, k) in options" :key="k" :value="k" :selected="it.value === value">{{ it.text }}</option>
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
function onValueUpdate(v: unknown) {
  emit('update:value', v);
  formContext.onFieldChange(v);
}
</script>