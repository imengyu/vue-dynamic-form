<template>
  <div class="TreeValue">
    <a-tree
      ref="selectRef"
      style="min-width: 150px"
      v-model:expandedKeys="expandedKeys"
      v-model:checkedKeys="checkedKeys"
      checkable
      :data="treeData"
      :loadMore="handleLoadData"
      :allow-clear="allowClear"
      v-bind="customProps"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import type { TreeNode, TreeValueProps } from "./TreeValue";
import type { TreeDataNode } from "ant-design-vue/es/vc-tree-select/interface";
import type { TreeNodeData } from "@arco-design/web-vue";

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

async function handleLoadData(treeNode: TreeNodeData) {
  await doLoadData(treeNode as TreeNode);
}

const doLoadData = (dataRef: TreeNode|undefined) => {
  const { 
    id, 
    level = 0 
  } = dataRef || {};
  const pid = id as number;
  const loadData = props.loadData;
  if (typeof loadData === 'function') {
    return loadData(pid, level).then((d) => {
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
          if (!dataRef.children)
            dataRef.children = [];
          dataRef.children.push(h);
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
      doLoadData(undefined);
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