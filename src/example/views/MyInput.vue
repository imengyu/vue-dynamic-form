<template>
  <div>
    <input  />

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
function onValueUpdate(v: boolean) {
  emit('update:value', v);
  formContext.onFieldChange(v);
}
</script>