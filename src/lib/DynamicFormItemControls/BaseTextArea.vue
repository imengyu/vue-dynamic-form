<template>
  <textarea
    class="dynamic-form-base-control"
    :rows="rows"
    :cols="cols"
    :maxlength="maxlength"
    :modelValue="value"
    @blur="onBlur"
    @update:modelValue="onValueUpdate"
  ></textarea>
</template>

<script lang="ts" setup>
import { useInjectFormItemContext } from "../DynamicFormBasicControls";

defineProps({
  value: {
    type: String,
    default: "",
  },
  cols: {
    type: Number,
    default: undefined,
  },
  rows: {
    type: Number,
    default: undefined,
  },
  maxlength: {
    type: Number,
    default: undefined,
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