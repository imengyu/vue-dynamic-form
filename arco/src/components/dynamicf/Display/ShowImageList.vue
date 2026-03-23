<template>
  <span v-if="!images||images.length==0">无图片</span>
  <div v-else-if="images" class="image-list">
    <a-image 
      v-for="(image, k) in (showAll ? images : images.filter((_: unknown, i: number) => i < maxCount))"
      :key="k"
      :width="imgSize"
      :height="imgSize"
      :src="image"
      :fallback="failImage"
    />
    <div v-if="images.length > maxCount" class="overflow-count" :style="{ 
      width: `${imgSize}px`, 
      height: `${imgSize}px`,
      lineHeight: `${imgSize}px`,
    }" @click="showAll=!showAll">
      {{showAll ? '折叠' : `+${images.length - maxCount}` }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ImageFailed from '../../../common/ImageFailed.png';

export interface ShowImageListProps {
  images?: string[] | null;
  size?: number | string;
  maxCount?: number;
  failImage?: string;
}

const props = withDefaults(defineProps<ShowImageListProps>(), {
  images: null,
  size: 30,
  maxCount: 5,
  failImage: ImageFailed
});

const showAll = ref(false);

const imgSize = computed(() : number => {
  if (typeof props.size === 'string') {
    switch(props.size) {
      case 'default': return 45;
      case 'middle': return 30;
      case 'small': return 20;
    }
  }
  return Number(props.size);
});
</script>

<style lang="scss">
.image-list {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;

  .overflow-count {
    color: #fff;
    background-color: rgba(0,0,0,0.5);
    text-align: center;
    cursor: pointer;
  }
  .ant-image {
    background-color: #ececec;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>