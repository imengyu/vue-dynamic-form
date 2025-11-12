<template>
  <span
    :class="'vc-show-value'+(block? ' d-block' : '')+(clickable?' link':'')"
    @click="onClick"
  >
    {{ prefix }}
    <template v-if="(value && value!='') || value === 0">
      <span v-if="typeof value === 'number'">{{ numericalPrecision > 0 ? (value as number).toFixed(numericalPrecision) : value }}</span>
      <span v-else-if="typeof value === 'boolean'">{{ value ? '是' : '否' }}</span>
      <span v-else-if="typeof value === 'object'">{{ JSON.stringify(value) }}</span>
      <span v-else>{{ value }}</span>
    </template>
    <span v-else class="text-secondary"><i>{{ nullText }}</i></span>
  </span>
</template>

<script setup lang="ts">
import { ref } from "vue";

export interface ShowValueOrNullProps {
  block?: boolean;
  clickable?: boolean;
  prefix?: string;
  numericalPrecision?: number;
  nullText?: string;
  record?: any;
}

const props = withDefaults(defineProps<ShowValueOrNullProps & {
  value?: any;
}>(), {
  block: false,
  clickable: false,
  prefix: '',
  numericalPrecision: 0,
  nullText: '暂无',
  record: null,
  value: null
});

const emit = defineEmits<{
  click: [record: any];
}>();

const result = ref('');

const onClick = () => {
  if (props.clickable) {
    emit('click', props.record);
  }
};
</script>

<style lang="scss">
.vc-show-value {
  &.link {
    color: #008cff;
    cursor: pointer;
  }
}
</style>