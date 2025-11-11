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

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ShowValueOrNull",
  data() {
    return {
      result: ''
    }
  },
  emits: [ 'click' ],
  props: {
    block: {
      default: false,
      type: Boolean
    },
    clickable: {
      default: false,
      type: Boolean
    },
    prefix: {
      default: '',
      type: String
    },
    numericalPrecision: {
      default: 0,
      type: Number
    },
    nullText: {
      default: '暂无',
      type: String
    },
    record: {
      default: null,
    },
    value: {
      type: null,
      default: null,
    },
  },
  methods: {
    onClick() {
      if (this.clickable)
        this.$emit('click', this.record);
    },
  },
});
</script>

<style lang="scss">
.vc-show-value {
  &.link {
    color: #008cff;
    cursor: pointer;
  }
}
</style>