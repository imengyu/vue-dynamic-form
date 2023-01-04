<template>
  <div class="home-area">
    <div class="big-title">
      <h1>vue-dynamic-form</h1>
      <p class="big">一个用数据驱动的 Vue3 动态表单组件</p>
      <p>快速写表单的另一种选择</p>
    </div>
    <div class="big-start">
      <button class="primary" @click="goStart">立即开始</button>
      <button @click="goView">查看演示</button>
    </div>
    <div class="big-demo">
      <BasicUseage />
    </div>
    <div class="big-fe">

    </div>
  </div>
</template>

<script lang="ts" setup>
import BasicUseage from '../src/example/views/BasicUseageDocHome.vue';

function goStart() {
  location.href = './guide/about.html'
}
function goView() {
  window.open('https://imengyu.top/pages/vue-dynamic-form-demo/');
}
</script>

<style lang="scss">
.demo-row {
  display: flex;
  flex-direction: row;
}
.demo-col {
  display: flex;
  flex-direction: column;
}
.demo-alert {
  width: 100%;
  padding: 8px 16px;
  margin: 0;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  background-color: #efefef;
  overflow: hidden;
  opacity: 1;
  display: block;

  &.success {
    background-color: #cef1bc;
    color: #67c23a;
  }
  &.error {
    background-color: #f1cdcd;
    color: #f56c6c;
  }
}
.demo-result {
  min-height: 100px;
  padding: 10px;
  background-color: #fff;
  border: none;
}
div.demo-result {
  white-space: pre;
}

$primary-color: #50af21;

html[class="dark"] {
  
  .big-title {
    h1 {
      color: $primary-color;
    }
    p {
      color: #b1b1b1;

      &.big {
        color: #fff;
      }

    }
  }
  .big-start {
    button {
      border: 1px solid #535353;
      color: #eee;
      background-color: #3a3a3a;
    }
  }
  .demo-result {
    background-color: #2f2f2f;
  }
  .dynamic-form-control-item label {
    color: #fff;
  }
  .ͼ2 .cm-gutters {
    background-color: #2f2f2f;
    color: #eee;
  }
  .ͼ2 .cm-activeLineGutter {
    background-color: #6e6e6e;
  }
}

.home-area {
  max-width: 1152px;
  margin: 0 auto;
}
.big-title {
  margin-top: 10px;

  h1 {
    color:$primary-color;
    line-height: 64px;
    font-size: 56px;
    font-weight: bold;
  }
  p {
    font-size: 26px;
    line-height: 34px;
    color: #3b3b3b;

    &.big {
      font-size: 36px;
      line-height: 55px;
      color: #000;
      font-weight: bold;
    }

  }
}
.big-demo {
}
.big-start {
  padding: 20px 0 40px 0;

  button {
    font-size: 16px;
    padding: 10px 20px;
    border-radius: 30px;
    outline: none;
    appearance: none;
    border: 1px solid #c2c2c2;
    color: #333;
    background-color: #f0f0f0;
    margin-right: 10px;

    &.primary {
      border: 1px solid $primary-color;
      color: #fff;
      background-color: $primary-color;
    }
  }
}
</style>