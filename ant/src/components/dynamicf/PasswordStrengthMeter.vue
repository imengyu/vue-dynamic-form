<template>
  <div class="password-meter">
    <div class="bar">
      <div :class="'level'+level"></div>
    </div>
    <span :class="'level'+level">密码强度 {{levelString}}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { checkPassWordSecrityLevel } from '@imengyu/imengyu-utils'

/**
 * 密码强度显示组件
 */
export default defineComponent({
  props: {
    password: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      level: 0,
      levelString: '',
    }
  },
  watch: {
    password(v: string) {
      this.level = Math.floor((checkPassWordSecrityLevel(v) / 100) * 5);
      switch(this.level) {
        case 0: this.levelString = '非常弱'; break;
        case 1: this.levelString =  '弱'; break;
        case 2: this.levelString =  '中等'; break;
        case 3: this.levelString =  '强'; break;
        case 4: this.levelString =  '非常强'; break;
      }
    },
  }
})
</script>

<style lang="scss">
.password-meter {
  position: relative;
  height: 20px;
  margin: 10px 0;

  .bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 130px;
    background-color: #e7e7e7;
    border: 1px solid #a1a1a1;

    div {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;

      &.level0 {
        width: 0;
        background-color: #000;
      }
      &.level1 {
        width: 25%;
        background-color: #ca410a;
      }
      &.level2 {
        width: 50%;
        background-color: #d8c40c;
      }
      &.level3 {
        width: 75%;
        background-color: #9ab814;
      }
      &.level4 {
        width: 100%;
        background-color: #2fbe0b;
      } 
    }
  }
  > span {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100px;
    right: 0;
    font-size: 12px;

    &.level0 {
      color: #646464;
    }
    &.level1 {
      color: #a8380c;
    }
    &.level2 {
      color: #af9f0e;
    }
    &.level3 {
      color: #91ac18;
    }
    &.level4 {
      color: #26920b;
    }
  }



}
</style>
