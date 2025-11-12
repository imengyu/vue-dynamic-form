<template>
  <div :style="{
    display: 'inline-block',
    overflow: 'hidden',
    width: `${imgSize}px`,
    height: `${imgSize}px`,
  }">
    <a-image
      :src="imgUrl"
      :fallback="failImage"
      :width="imgSize"
      :height="imgSize"
      @error="onError"
    />
  </div>
</template>

<script setup lang="ts">
import { StringUtils } from '@imengyu/imengyu-utils';
import { ref, computed, watch, onMounted } from 'vue';
import ImageFailed from '../../../common/ImageFailed.png';
import ImageEmpty from '../../../common/ImageEmpty.png';

export interface ShowImageOrNullProps {
  nullImage?: string;
  failImage?: string;
  size?: number | string;
  src?: string | null;
}

const props = withDefaults(defineProps<ShowImageOrNullProps>(), {
  nullImage: ImageEmpty,
  failImage: ImageFailed,
  size: 30,
  src: null
});

const imgUrl = ref('');

const imgSize = computed((): number => {
  if (typeof props.size === 'string')
    switch(props.size) {
      case 'default': return 55;
      case 'middle': return 45;
      case 'small': return 25;
    }
  return props.size as number;
});

const loadImage = () => {
  if(StringUtils.isNullOrEmpty(props.src))
    imgUrl.value = props.nullImage;
  else
    imgUrl.value = props.src || '';
};

const onError = () => {
  if(imgUrl.value != props.failImage)
    imgUrl.value = props.failImage;
};

onMounted(() => {
  setTimeout(() => { loadImage(); }, 100);
});

watch(() => props.src, () => {
  loadImage();
});
</script>