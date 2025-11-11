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
    />
  </div>
</template>

<script lang="ts">
import { StringUtils } from '@imengyu/imengyu-utils';
import { defineComponent } from 'vue';
import ImageFailed from '../../../common/ImageFailed.png';
import ImageEmpty from '../../../common/ImageEmpty.png';

export default defineComponent({
  name: "ShowImageOrNull",
  props: {
    nullImage: {
      type: String,
      default: ImageEmpty,
    },
    failImage: {
      type: String,
      default: ImageFailed,
    },
    size: {
      type: [Number,String],
      default: 30,
    },
    src: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
      imgUrl: '',
    }
  },
  computed: {
    imgSize() : number {
      if (typeof this.size === 'string')
        switch(this.size) {
          case 'default': return 55;
          case 'middle': return 45;
          case 'small': return 25;
        }
      return this.size as number;
    },  
  },
  mounted() {
    setTimeout(() => { this.loadImage(); },100);
  },
  watch: {
    src() { this.loadImage(); }
  },
  methods: {
    loadImage() {
      if(StringUtils.isNullOrEmpty(this.src))
        this.imgUrl = this.nullImage as string;
      else
        this.imgUrl = this.src as string;
    },
    onError() {
      if(this.imgUrl != this.failImage)
        this.imgUrl = this.failImage as string;
    }
  }
});
</script>