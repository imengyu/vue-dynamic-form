<template>
  <div class="check-box-list">
    <a-spin v-if="loadStatus === 'loading'" />
    <a-alert 
      v-else-if="loadStatus === 'error'" 
      message="加载失败" 
      description="点击重新加载" 
      type="error" 
      show-icon 
      class="pointer"
      @click="handleLoadData"
    />
    <a-checkbox-group 
      v-else 
      :value="modelValue" 
      :disabled="disabled"
      :options="data2"
      @update:value="handleChange" 
    >
    </a-checkbox-group>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type PropType } from 'vue';

export interface CheckBoxListItem {
  label: string;
  value: any;
  disable?: boolean;
}
export interface CheckBoxListProps {
  loadData: () => Promise<CheckBoxListItem[]>;
}

const props = defineProps({
  modelValue: {
    type: [Array, null] as PropType<any[] | null>,
    default: () => null
  },
  loadData: {
    type: Function as PropType<CheckBoxListProps['loadData']>,
    default: () => Promise.resolve([])
  },
  disabled: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue', 'change'])

const loadStatus = ref<'loading' | 'error' | 'success'>('loading');
const loadError = ref('');
const data2 = ref<CheckBoxListItem[]>([]);

const handleChange = (checkedValues: any[]) => {
  emit('update:modelValue', checkedValues);
  emit('change', checkedValues);
}
const handleLoadData = () => {
  loadStatus.value = 'loading';
  loadError.value = '';
  
  props.loadData().then((v) => {
    data2.value = v;
    loadStatus.value = 'success';
  }).catch((e) => {
    loadError.value = e.message || '加载失败';
    loadStatus.value = 'error';
  });
}
const reload = () => {
  handleLoadData();
}

defineExpose({ reload });

onMounted(() => {
  handleLoadData();
});
</script>