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

export interface ShowDateOrNullProps {
  nullText?: string;
  size?: string;
  value?: Date | null;
}

withDefaults(defineProps<ShowDateOrNullProps>(), {
  nullText: '暂无',
  size: '',
  value: null,
});

function formatDate(date: Date) {
  return DateUtils.formatDate(date, 'yyyy-MM-dd HH:mm:ss');
}
</script>