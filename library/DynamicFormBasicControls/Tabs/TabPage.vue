<template>
  <div v-if="show" class="dynamic-form-tab-page">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, onMounted, onUnmounted, computed, watch, getCurrentInstance, Ref } from 'vue'

const props = defineProps<{
  title: string,
  disabled?: boolean,
}>()

const key = computed(() => (getCurrentInstance()?.vnode.key?.toString()) || '')
const emit = defineEmits<{
  (e: 'update:key', value: string | number): void
}>()

// 生成唯一key
const tabKey = ref<string | number>(key.value || `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
const tabContext = inject<{
  registerTabPage: (key: string | number, title: string, disabled: boolean) => void
  unregisterTabPage: (key: string | number) => void,
  currentActiveKey: Ref<string | number | null>
}>('TabContext');

const show = computed(() => tabContext?.currentActiveKey.value === tabKey.value)

onMounted(() => {
  if (tabContext) {
    tabContext.registerTabPage(tabKey.value, props.title, props.disabled || false)
  }
})
onUnmounted(() => {
  if (tabContext) {
    tabContext.unregisterTabPage(tabKey.value)
  }
})
watch(key, (newKey) => {
  if (newKey !== undefined) {
    // 如果key发生变化，需要先取消注册旧的key，再注册新的key
    if (tabContext) {
      tabContext.unregisterTabPage(tabKey.value)
      tabKey.value = newKey
      tabContext.registerTabPage(tabKey.value, props.title, props.disabled || false)
    }
    emit('update:key', newKey)
  }
});

</script>

<style lang="scss" scoped>
.dynamic-form-tab-page {
  width: 100%;
  min-height: 100px;
}
</style>