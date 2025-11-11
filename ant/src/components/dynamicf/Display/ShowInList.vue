<template>
  <div>{{ result }}</div>
</template>

<script lang="ts">
import type { KeyValue } from "@imengyu/js-request-transform";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  name: "ShowInList",
  data() {
    return {
      result: ''
    }
  },
  props: {
    noMatchText: {
      type: String,
      default: '暂无',
    },
    useProp: {
      type: Boolean,
      default: true,
    },
    usePropName: {
      type: String,
      default: 'id',
    },
    usePropValue: {
      type: String,
      default: 'name',
    },
    list: {
      type: Object as PropType<Array<KeyValue>>,
      default: null,
    },
    value: {
      default: null,
    }
  },
  mounted: function() {
    this.loadText();
  },
  watch: {
    list() { this.loadText(); },
    value() { this.loadText(); }
  },
  methods: {
    loadText() {
      const list = this.list as Array<KeyValue>;
      if(list && this.value && list.length > 0){
        for(let i = 0, c = list.length; i < c; i++){
          if(this.useProp)
            if(list[i]![this.usePropName as string] == this.value) {
              this.result = list[i]![this.usePropValue as string] as string;
              return;
            }
          else
            if(list[i] == this.value) {
              this.result = list[i] as unknown as string;
              return;
            }
        }
        this.result = this.noMatchText as string;
      }else this.result = this.noMatchText as string;
    }
  }
});
</script>