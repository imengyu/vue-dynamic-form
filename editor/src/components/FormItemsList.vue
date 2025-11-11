<template>
  <ScrollRect scroll="vertical">
    <a-collapse v-model:activeKey="activeKey" :bordered="false">
      <a-collapse-panel 
        v-for="(group, key) in FormItems"
        :key="key" 
        :header="group.label"
      >
        <div class="form-items-list">
          <div 
            v-for="(item, key) in group.items"
            :key="key"
            :draggable="true"
            class="form-item"
            @dragstart="handleDragStart($event, item)"
          >
            <i :class="'iconfont ' + item.icon"></i>
            <p class="form-item-label">{{ item.label }}</p>
            <p v-if="item.extraTag === 'data-id'" class="form-item-extra blue">动态</p>
            <p v-else-if="item.extraTag === 'data-int'" class="form-item-extra pink">数字</p>
            <p v-else-if="item.extraTag === 'group'" class="form-item-extra green">样式</p>
            <p v-else-if="item.extraTag === 'data-single'" class="form-item-extra yellow">单值</p>
            <p v-else-if="item.extraTag === 'data-object'" class="form-item-extra orange">对象</p>
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </ScrollRect>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormItems, type FormItemDef } from '../dynamic/ItemsDef';
import { ScrollRect } from '@imengyu/vue-scroll-rect';

const activeKey = ref(new Array(FormItems.length).fill('').map((_, index) => index.toString()))

const handleDragStart = (e: DragEvent, item: FormItemDef) => {
  e.dataTransfer?.setData('text/plain', JSON.stringify(item));
}

</script>

<style scoped lang="scss">
.form-items-list {
  display: flex;
  flex-wrap: wrap;

  .form-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    cursor: pointer;
    padding: 10px 0;
    flex: 0 0 33%;

    &:hover {
      background-color: #f5f5f5;
    }

    i {
      font-size: 33px;
      margin-bottom: 5px;
    }
    p {
      font-size: 14px;
      margin: 0;
    }

    .form-item-extra {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 11px;
      padding: 2px 5px;
      border-radius: 3px;

      &.blue {
        background-color: #e6f7ff;
        color: #409eff;
      }
      &.pink {
        background-color: #fff0f6;
        color: #ff4d94;
      }
      &.green {
        background-color: #e6fffb;
        color: #52c41a;
      }
      &.yellow {
        background-color: #fffbe6;
        color: #faad14;
      }
      &.orange {
        background-color: #fff2e6;
        color: #fa8c16;
      }
    }
  }
}
</style>
