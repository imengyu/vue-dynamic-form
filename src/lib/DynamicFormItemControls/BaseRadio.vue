<template>
  <div class="dynamic-form-base-control radio">
    <div class="item" v-for="item in items" :key="item.value">
      <input 
        type="radio"
        :disabled="disabled"
        :id="name+item.value"
        :name="name"
        :value="item.value"
        :checked="value==item.value"
        @change="() => onValueUpdate(item.value)"
      />
      <label :for="name+item.value">{{item.label}}</label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { useInjectFormItemContext } from "../DynamicFormBasicControls";

defineProps({
  name: {
    type: String,
    default: "",
  },
  value: {},
  disabled: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Object as PropType<Array<{
      value: string,
      label: string,
    }>>,
    default: () => ([] as Object),
  }
});

const emit = defineEmits([ 'update:value' ]);

const formContext = useInjectFormItemContext();

function onValueUpdate(v: string) {
  emit('update:value', v);
  formContext?.onFieldChange(v);
}
</script>