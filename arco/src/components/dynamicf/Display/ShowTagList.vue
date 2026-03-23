<template>
  <span v-if="!tags || tags.length == 0">暂无</span>
  <span v-else-if="small">
    {{ tags[0] }}等{{ tags.length }}个
  </span>
  <div v-else-if="tagsC" class="d-flex flex-row flex-wrap">
    <a-tag v-for="(n, k) in tagsC" :key="k">{{ n }}</a-tag>
    <small class="text-primary" v-if="!expand && tags.length > maxCount" @click="expand = true">等{{ tags.length }}个</small>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

export interface ShowTagListProps {
  size?: string;
  maxCount?: number;
  tags?: string[] | null;
}

const props = withDefaults(defineProps<ShowTagListProps>(), {
  size: '',
  maxCount: 10,
  tags: null
});

const expand = ref(false);

const tagsC = computed(() => {
  if (props.tags && !expand.value && props.maxCount < props.tags.length) {
    return props.tags.slice(0, props.maxCount);
  } else {
    return props.tags;
  }
});

const small = computed(() => {
  return props.size === 'small';
});
</script>