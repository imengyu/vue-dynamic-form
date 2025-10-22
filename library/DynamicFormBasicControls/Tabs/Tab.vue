<template>
  <div class="dynamic-form-tabs">
    <div class="dynamic-form-tabs-nav">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        :class="[
          'dynamic-form-tabs-tab',
          { 'is-active': activeKey === tab.key },
          { 'is-disabled': tab.disabled }
        ]"
        @click="handleTabClick(tab)"
      >
        {{ tab.title }}
      </div>
    </div>
    <div class="dynamic-form-tabs-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, provide, watch } from 'vue'

const props = defineProps<{
  activeKey?: string | number
  defaultActiveKey?: string | number
}>()

const emit = defineEmits<{
  (e: 'update:activeKey', value: string | number): void
  (e: 'change', value: string | number): void
}>()

const tabs = ref<Array<{
  key: string | number
  title: string
  disabled: boolean
}>>([])
const currentActiveKey = ref<string | number | null>(null)
const registerTabPage = (key: string | number, title: string, disabled: boolean) => {
  tabs.value.push({ key, title, disabled })
}
const unregisterTabPage = (key: string | number) => {
  const index = tabs.value.findIndex(tab => tab.key === key)
  if (index > -1) {
    tabs.value.splice(index, 1)
  }
}

// 提供注册方法给TabPage
provide('TabContext', {
  registerTabPage,
  unregisterTabPage,
  currentActiveKey,
})

const handleTabClick = (tab: { key: string | number, disabled: boolean }) => {
  if (tab.disabled) return
  currentActiveKey.value = tab.key
  emit('update:activeKey', tab.key)
  emit('change', tab.key)
}
watch(() => props.activeKey, (newVal) => {
  if (newVal !== undefined) {
    currentActiveKey.value = newVal
  }
}, { immediate: true })
watch(currentActiveKey, (newVal) => {
  if (newVal !== null && props.activeKey === undefined) {
    emit('update:activeKey', newVal)
  }
})

// 组件挂载时初始化
onMounted(() => {
  if (currentActiveKey.value === null) {
    // 如果没有设置activeKey，尝试使用defaultActiveKey
    if (props.defaultActiveKey !== undefined) {
      currentActiveKey.value = props.defaultActiveKey
    } else if (tabs.value.length > 0) {
      // 如果都没有设置，使用第一个可用的tab
      const firstAvailableTab = tabs.value.find(tab => !tab.disabled)
      if (firstAvailableTab) {
        currentActiveKey.value = firstAvailableTab.key
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.dynamic-form-tabs {
  width: 100%;
}
.dynamic-form-tabs-nav {
  display: flex;
  border-bottom: 1px solid var(--dynamic-form-border-color);
}
.dynamic-form-tabs-tab {
  padding: 8px 16px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
  margin-right: 16px;

  &:hover {
    color: var(--dynamic-form-primary-color);
  }
  &.is-active {
    color: var(--dynamic-form-primary-color);
    border-bottom-color: var(--dynamic-form-primary-color2);
  }
  &.is-disabled {
    cursor: not-allowed;
    color: var(--dynamic-form-secondary-color);

    &:hover {
      color: var(--dynamic-form-secondary-color);
    }
  }
}
.dynamic-form-tabs-content {
  padding: 16px 0;
}
</style>