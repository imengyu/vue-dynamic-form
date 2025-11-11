<template>
  <span :class="'vc-show-date '+size">
    <span v-if="value !== undefined && value !== null">
      {{ value instanceof Date ? formatDate(value) : '不是日期类型' }}
    </span>
    <span v-else class="text-secondary"><i>{{ nullText }}</i></span>
  </span>
</template>

<script lang="ts" setup>
import { DateUtils } from '@imengyu/imengyu-utils';
import { type PropType } from 'vue';

defineProps({
  nullText: {
    default: '暂无',
    type: String
  },
  size: {
    default: '',
    type: String
  },
  value: {
    type: Object as PropType<Date>,
    default: null,
  }
});

function formatDate(date: Date) {
  return DateUtils.formatDate(date, 'yyyy-MM-dd HH:mm:ss');
}
</script>