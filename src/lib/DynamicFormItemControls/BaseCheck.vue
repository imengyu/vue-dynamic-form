<template>
  <div>
    <input
      class="dynamic-form-base-control base-checkbox"
      type="checkbox"
      :modelValue="value"
      :id="name"
      @update:modelValue="onValueUpdate"
      @blur="onBlur"
    />
    <label :for="name">{{text}}</label>
  </div>
</template>

<script lang="ts" setup>
import { useInjectFormItemContext } from "../DynamicFormBasicControls";

defineProps({
  value: {},
  name: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
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