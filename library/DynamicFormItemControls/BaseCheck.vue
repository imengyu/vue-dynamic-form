<template>
  <div 
    class="dynamic-form-base-control base-checkbox"
    tabindex="0"
    @blur="onBlur"
    @click="onCheckClick"
  >
    <input
      type="checkbox"
      :modelValue="value"
      :id="name"
    />
    <div class="checker-container">
      <IconCheck v-if="value" class="checker" />
    </div>
    <label :for="name">{{text}}</label>
  </div>
</template>

<script lang="ts" setup>
import IconCheck from "../Images/IconCheck.vue";
import { useInjectFormItemContext } from "../DynamicFormBasicControls";

const props = defineProps({
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

function onCheckClick() {
  onValueUpdate(!props.value);
}
function onBlur() {
  formContext.onFieldBlur();
}
function onValueUpdate(v: boolean) {
  emit('update:value', v);
  formContext.onFieldChange(v);
}
</script>