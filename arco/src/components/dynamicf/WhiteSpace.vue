<template>
  <div :style="{ height: height }"></div>
</template>

<script lang="ts" setup>
import type { WhiteSpaceProps } from "./WhiteSpace";

const props = defineProps<WhiteSpaceProps>();
</script>