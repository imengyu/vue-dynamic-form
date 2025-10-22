<template>
  <div :class="['dynamic-form-error-alert', props.type ]">
    <img v-if="computedIcon" class="icon" :src="computedIcon" alt="">
    <div>
      <span class="message">{{ message }}</span>
      <span v-if="extraMessage" class="extra-message">{{ extraMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import IconError from '../../Images/IconError.svg';
import IconWarning from '../../Images/IconWarning.svg';

const props = defineProps({
  message: {
    type: String,
    default: '',
  },
  extraMessage: {
    type: String,
    default: '',
  },
  type: {
    type: String as PropType<'error' | 'warning'>,
    default: 'error',
  },
})

const computedIcon = computed(() => {
  if (props.type === 'error') {
    return IconError
  } else if (props.type === 'warning') {
    return IconWarning
  }
  return "";
})
</script>