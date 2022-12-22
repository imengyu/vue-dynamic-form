<template>
  <input
    class="dynamic-form-base-control"
    type="text" 
    :value="value"
    @blur="onBlur"
    @update:modelValue="(e: string) => onValueUpdate(e)"
    @change="(e: Event) => onValueUpdate((e.target as HTMLInputElement).value)"
  />
</template>

<script lang="ts" setup>
import { useInjectFormItemContext } from "../DynamicFormBasicControls";

defineProps({
  value: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([ 'update:value' ]);

const formContext = useInjectFormItemContext();

function onBlur() {
  formContext.onFieldBlur();
}
function onValueUpdate(v: string) {
  console.log('onValueUpdate', v);
  emit('update:value', v);
  
  formContext.onFieldChange(v);
}
</script>