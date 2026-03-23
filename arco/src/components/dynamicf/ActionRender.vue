<template>
  <div class="action-render">
    <a-button
      v-for="(act, k) in actions" 
      :key="k" 
      :class="`type-${act.type}`"
      :block="act.wrap"
      @click="actionClick(act)"
    >
      {{act.text}}
    </a-button>
  </div>
</template>

<script lang="ts" setup>
import type { ActionRenderItem, ActionRenderProps } from './ActionRender';

const props = defineProps<ActionRenderProps & {
  rawModel?: Record<string, unknown>;
}>();

function actionClick(action: ActionRenderItem) {
  if (typeof action.onClick === 'function')
    action.onClick(action.key, props.rawModel ?? {});
  else
    console.warn('action ' + action.key + ' onClick is not a function!');
}
</script>

<style lang="scss" scoped>
.action-render {
  display: flex;
  gap: 10px;

  .wrap {
    display: block;
  }

  .type-primary {
    color: #1677ff;
  }
  .type-danger {
    color: #ff4d4f;
  }
  .type-success {
    color: #52c41a;
  }
  .type-warning {
    color: #faad14;
  }
  .type-secondary {
    color: #666;
  }
}
</style>