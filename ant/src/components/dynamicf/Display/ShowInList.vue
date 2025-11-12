<template>
  <div>{{ result }}</div>
</template>

<script setup lang="ts">
import type { KeyValue } from "@imengyu/js-request-transform";
import { ref, watch, onMounted, defineProps, withDefaults } from "vue";

export interface ShowInListProps {
  noMatchText?: string;
  useProp?: boolean;
  usePropName?: string;
  usePropValue?: string;
  list?: Array<KeyValue> | null;
  value?: any;
}

const props = withDefaults(defineProps<ShowInListProps>(), {
  noMatchText: '暂无',
  useProp: true,
  usePropName: 'id',
  usePropValue: 'name',
  list: null,
  value: null
});

const result = ref('');

const loadText = () => {
  if (props.list && props.value && props.list.length > 0) {
    for (let i = 0, c = props.list.length; i < c; i++) {
      if (props.useProp) {
        if (props.list[i] && props.list[i]?.[props.usePropName] === props.value) {
          result.value = props.list[i]![props.usePropValue] as string;
          return;
        }
      } else {
        if (props.list[i] === props.value) {
          result.value = props.list[i] as unknown as string;
          return;
        }
      }
    }
    result.value = props.noMatchText;
  } else {
    result.value = props.noMatchText;
  }
};

onMounted(() => {
  loadText();
});

watch(
  [() => props.list, () => props.value],
  () => {
    loadText();
  },
  { deep: true }
);
</script>