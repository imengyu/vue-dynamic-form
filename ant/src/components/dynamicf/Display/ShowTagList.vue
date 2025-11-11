<template>
  <span v-if="!tags||tags.length==0">暂无</span>
  <span v-else-if="small">
    {{ tags[0] }}等{{tags.length}}个
  </span>
  <div v-else-if="tagsC" class="d-flex flex-row flex-wrap">
    <a-tag v-for="(n, k) in tagsC" :key="k">{{n}}</a-tag>
    <small class="text-primary" v-if="!expand && tags.length > maxCount" @click="expand=true">等{{tags.length}}个</small>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  name: "ShowImageList",
  data() {
    return {
      expand: false,
    };
  },
  computed: {
    tagsC() {
      if (!this.expand && this.maxCount < this.tags.length)
        return this.tags.slice(0, this.maxCount)
      else
        return this.tags;
    },
    small() {
      return this.size === 'small';
    },
  },
  props: {
    size: {
      type: String,
      default: '',
    },
    maxCount: {
      type: Number,
      default: 10,
    },
    tags: {
      type: Object as PropType<Array<string>>,
      default: null,
    },
  },
});
</script>