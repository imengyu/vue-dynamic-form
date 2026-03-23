<template>
  <div class="TreeValue">
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

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import type { TreeNode, TreeValueProps } from "./TreeValue";

const props = withDefaults(defineProps<TreeValueProps & {
  value?: (string|number)[]
}>(), {
  allowClear: true,
  disabled: false,
  loadAtStart: true,
  maxLevel: 0,
  onlyLastLevelClickable: false,
});

const emit = defineEmits(['update:value','change','blur']);

const selectRef = ref();
const expandedKeys = ref<(string|number)[]>([]);
const checkedKeys = ref<(string|number)[]>([]);
const treeData = ref<TreeNode[]>([]);

const handleChange = () => {
  nextTick(() => {
    emit('update:value', checkedKeys.value);
    emit('change', checkedKeys.value);
  });
};

const handleLoadData = (treeNode: { dataRef: TreeNode } | null) => {
  return new Promise((resolve: (value?: unknown) => void) => {
    doLoadData(treeNode?.dataRef || null).then(() => resolve()).catch(() => resolve());
  });
};

const doLoadData = (dataRef: TreeNode | null) => {
  const { id, level } = dataRef || { id: 0, level: 0 };
  const pid = id as number;
  const loadData = props.loadData;
  if (typeof loadData === 'function') {
    return loadData(pid, level as number).then((d) => {
      if (dataRef && !dataRef.children) {
        dataRef.children = [];
      }
      d.forEach(h => {
        h.level = level as number + 1;
        if (props.maxLevel > 0 && h.level >= props.maxLevel) {
          h.isLeaf = true;
        }
        if (typeof props.checkClickable === 'function') {
          props.checkClickable(h).then((v: boolean) => h.selectable = v);
        } else if (props.maxLevel > 0) {
          if (h.level >= props.maxLevel) {
            h.selectable = false;
          }
          if (props.onlyLastLevelClickable) {
            h.selectable = (h.level == props.maxLevel);
          }
        }
        if (dataRef) {
          dataRef.children?.push(h);
        } else {
          treeData.value.push(h);
        }
      });
    });
  } else {
    return Promise.resolve();
  }
};

/**
 * 获取某个ID的树(正排列)
 */
const getTree = (value: number) => {
  const result = new Array<TreeNode>();
  let child: undefined | TreeNode = treeData.value.find((v) => v.id == value);
  while (child) {
    result.unshift(child);
    if (child.pid == 0) child = undefined;
    else child = treeData.value.find((v) => v.id == (child as TreeNode).pid);
  }
  return result;
};

/**
 * 获取某个ID的Lablel
 */
const getLableByValue = (value: number) => {
  const data = treeData.value;
  for (let i = 0; i < data.length; i++) {
    if (data[i]?.id == value) {
      return data[i]!.title;
    }
  }
  return '';
};

/**
 * 重新加载数据
 */
const reload = () => {
  treeData.value = [];
};

watch(() => props.value, (v) => {
  checkedKeys.value = (v as string[]) || [];
});

watch(checkedKeys, () => {
  handleChange();
});

onMounted(() => {
  checkedKeys.value = (props.value as unknown as string[]) || [];
  setTimeout(() => {
    if (props.loadAtStart) {
      treeData.value = [];
      handleLoadData(null);
    }
  }, 300);
});

defineExpose({
  getTree,
  getLableByValue,
  reload
});
</script>

<style>
.TreeValue {
  border: 1px solid #efefef;
  padding: 10px;
}
</style>