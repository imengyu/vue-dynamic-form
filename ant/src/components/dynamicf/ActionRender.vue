<template>
  <span>
    <a-button
      v-for="(act, k) in actions" 
      :key="k" 
      :class="`mr-3 text-${act.type}` + (act.wrap ? ' display-block' : '')"
      @click="actionClick(act)"
    >{{act.text}}</a-button>
  </span>
</template>

<script lang="ts">
import type { DataModel } from '@imengyu/js-request-transform';
import type { ActionRenderItem } from './ActionRender';
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  props: {
    rawModel: {
      type: Object as PropType<Record<string, unknown>>,
    },
    actions: {
      type: Object as PropType<Array<ActionRenderItem>>,
    },
  },
  methods: {
    actionClick(action: ActionRenderItem) {
      if (typeof action.onClick === 'function')
        action.onClick(action.key, this.rawModel as DataModel);
      else
        console.warn('action ' + action.key + ' onClick is not a function!');
    },
  },
});
</script>