<template>
  <div class="IdAsValueTree">
    <a-tree
      ref="selectRef"
      style="min-width: 150px"
      :defaultOpen="true"
      v-model:expandedKeys="expandedKeys"
      v-model:checkedKeys="checkedKeys"
      checkable
      :tree-data="treeData"
      :load-data="handleLoadData"
      :allow-clear="allowClear"
      v-bind="customProps"
    />
  </div>
</template>

<script lang="ts">
import type { TreeProps } from "ant-design-vue";
import { defineComponent, type PropType } from "vue";
import type { IdAsValueTreeCheckClickableFun, IdAsValueTreeLoadDataFun, TreeNode } from "./IdAsValueTree";

/**
 * 使用数据的ID作为value的tree包装
 */
export default defineComponent({
  name: "IdAsValueTree",
  emits: [
    'update:value',
    'change',
    'blur',
  ],
  props: {
    allowClear: {
      default: true,
      type: Boolean
    },
    disabled: {
      default: false,
      type: Boolean
    },
    loadAtStart: {
      default: true,
      type: Boolean
    },
    value: {
      default: null,
    },
    loadData: {
      type: Function as PropType<IdAsValueTreeLoadDataFun>,
      default: null,
    },
    checkClickable: {
      type: Function as PropType<IdAsValueTreeCheckClickableFun>,
      default: null,
    },
    maxLevel: {
      default: 0,
      type: Number,
    },
    onlyLastLevelClickable: {
      default: false,
      type: Boolean
    },
    /**
     * a-select 其他自定义参数
     */
    customProps: {
      type: Object as PropType<TreeProps>,
      default: null,
    },
  },
  methods: {
    handleChange() {
      this.$nextTick(() => {
        this.$emit('update:value', this.checkedKeys); 
        this.$emit('change', this.checkedKeys); 
      })
    },
    handleLoadData(treeNode: { dataRef: TreeNode }|null) {
      return new Promise((resolve: (value?: unknown) => void) => {
        this.doLoadData(treeNode?.dataRef || null).then(() => resolve()).catch(() => resolve());
      });
    },
    doLoadData(dataRef: TreeNode|null) {
      const { id, level } = dataRef || { id: 0, level: 0 };
      const pid = id as number;
      const loadData = this.loadData;
      if(typeof loadData === 'function') {
        return (loadData as IdAsValueTreeLoadDataFun)(pid, level as number).then((d) => {
          if (dataRef && !dataRef.children)
            dataRef.children = [];
          d.forEach(h => {
            h.level = level as number + 1;
            if(this.maxLevel > 0 && h.level >= this.maxLevel)
              h.isLeaf = true;
            if(typeof this.checkClickable === 'function')
              this.checkClickable(h).then((v: boolean) => h.selectable = v);
            else if(this.maxLevel > 0) { 
              if(h.level >= this.maxLevel)
                h.selectable = false;
              if(this.onlyLastLevelClickable) 
                h.selectable = (h.level == this.maxLevel);
            }
            if (dataRef)
              dataRef.children?.push(h);
            else
              this.treeData.push(h);
          });
        });
      } else 
        return Promise.resolve();
    },

    /**
     * 获取某个ID的树(正排列)
     */
    getTree(value: number) {
      const result = new Array<TreeNode>();
      let child : undefined|TreeNode = (this.treeData as TreeNode[]).find((v) => v.id == value);
      while(child) {
        result.unshift(child);
        if(child.pid == 0) child = undefined;
        else child = (this.treeData as TreeNode[]).find((v) => v.id == (child as TreeNode).pid);
      }
      return result;
    },
    /**
     * 获取某个ID的Lablel
     */
    getLableByValue(value: number) {
      const data = this.treeData;
      for (let i = 0; i < data.length; i++) {
        if(data[i]?.id == value) {
          return data[i]!.title;
        }
      }
      return '';
    },
    /**
     * 重新加载数据
     */
    reload() {
      this.treeData = [];
    },
  },
  watch: {
    value(v) {
      this.checkedKeys = (v as string[]);
    },
    checkedKeys() {
      this.handleChange();
    },
  },
  data() {
    return {
      expandedKeys: [] as string[],
      checkedKeys: [] as string[],
      treeData: [] as TreeNode[],
    }
  },
  mounted() { 
    this.checkedKeys = (this.value as unknown as string[]) || [];
    setTimeout(() => { 
      if(this.loadAtStart) {
        this.treeData = [];
        this.handleLoadData(null);
      }
    } , 300);
  }
});
</script>

<style>
.IdAsValueTree {
  border: 1px solid #efefef;
  padding: 10px;
}
</style>