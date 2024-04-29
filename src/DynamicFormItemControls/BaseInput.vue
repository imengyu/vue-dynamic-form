<template>
  <input
    class="dynamic-form-base-control"
    :type="password?'password':'text'" 
    :value="value"
    :placeholder="placeholder"
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
  password: {
    type: Boolean,
    default: false,
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