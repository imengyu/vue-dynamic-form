<template>
  <div :style="{ height: height }"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    height: {
      type: [Number,String],
      default: 0,
    },
  }
});
</script>