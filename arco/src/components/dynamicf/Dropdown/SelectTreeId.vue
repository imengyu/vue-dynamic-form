<template>
  <div v-if="showDisplayValue" class="display-value" @click="handleDisplayValueClick">
    <span>{{displayValue}}</span>
  </div>
  <a-tree-select
    v-else
    ref="selectRef"
    style="min-width: 150px"
    :defaultOpen="true"
    :value="valueV"
    :dropdown-style="dropdownStyle"
    :notFoundContent="notFoundContent"
    :tree-data="treeData"
    :load-data="handleLoadData"
    :treeDataSimpleMode="true"
    :placeholder="placeholder"
    :allow-clear="allowClear"
    :multiple="multiple"
    :fieldNames="{
      label: 'text',
      value: 'value',
      children:'children',
    }"
    v-bind="customProps"
    @blur="handleSelectBlur"
    @update:value="handleChange"
  />
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import type { TreeDataItem } from "../TreeValue";
import type { SelectTreeIdGetDiaplayValue, SelectTreeIdInterface, SelectTreeIdProps } from "./SelectTreeId";

/**
 * 使用数据的ID作为value的下拉框包装
 */

const props = withDefaults(defineProps<SelectTreeIdProps & {
  value?: string|number|null
}>(), {
  allowClear: true,
  multiple: false,
  disabled: false,
  showSearch: true,
  placeholder: "请选择，输入可进行搜索",
  notFoundContent: "未找到数据，请换个搜索词再试",
  loadAtStart: true,
  filterDirectly: true,
  maxLevel: 0,
  dropdownStyle: () => ({ maxHeight: '400px', overflow: 'auto' })
})
const emit = defineEmits([
  'update:value',
  'change',
  'blur',
]);

const showDisplayValue = ref(false);
const valueV = ref<null|number|string>(null);
const treeData = ref<TreeDataItem[]>([]);
const selectRef = ref();

const displayValue = computed(() => {
  if (valueV.value != null && valueV.value != 0 && props.defaultDisplayValue != '')
    return props.defaultDisplayValue;
  if (props.getDisplayValue)
    return (props.getDisplayValue as SelectTreeIdGetDiaplayValue)(expose); 
  return '';
});

function handleChange(value: unknown) {
  nextTick(() => {
    if(value != valueV.value) {
      emit('update:value', value); 
      emit('change', value); 
    }
  })
}
function  handleLoadData(treeNode: { dataRef: TreeDataItem }) {
  return new Promise((resolve: (value?: unknown) => void) => {
    const { id, level } = treeNode.dataRef;
    doLoadData(id, level as number).then(() => resolve()).catch(() => resolve());
  });
}
function  handleDisplayValueClick() {
  showDisplayValue.value = false;
  setTimeout(() => {
    (selectRef.value as {
      focus: () => void
    }).focus();
  }, 200);
}
function  handleSelectBlur() {
  if(props.showDisplayValueBeforeEdit) {
    if(valueV.value != null && valueV.value != 0 && props.defaultDisplayValue != '')
      showDisplayValue.value = true;
    else if (getLableByValue(valueV.value as number) === '') //只有没有在列表中搜索到数据时，才显示临时数据
      showDisplayValue.value = true;
  }
}
function  doLoadData(pid: string|number|null, level: number) {
  const loadData = props.loadData;
  if(typeof loadData === 'function') {
    return loadData(pid as string, level).then((d) => {
      for(let i = treeData.value.length - 1; i >= 0; i--)
        if(treeData.value[i]?.pId == pid)
          treeData.value.splice(i, 1);
      d.forEach(h => {
        h.level = level + 1;
        if(props.maxLevel > 0 && h.level >= props.maxLevel)
          h.isLeaf = true;
        if(typeof props.checkClickable === 'function')
          props.checkClickable(h).then((v: boolean) => h.selectable = v);
        else if(props.maxLevel > 0) { 
          if(h.level >= props.maxLevel)
            h.selectable = false;
          if(props.onlyLastLevelClickable) 
            h.selectable = (h.level == props.maxLevel);
        }
        treeData.value.push(h)
      });
    });
  } else 
    return Promise.resolve();
}

/**
 * 获取某个ID的树(正排列)
 */
function getTree(value: number) {
  const result = new Array<TreeDataItem>();
  let child : TreeDataItem|null = treeData.value.find((v) => v.id == value) as TreeDataItem;
  while(child) {
    result.unshift(child);
    if(child.pId == 0) child = null;
    else child = treeData.value.find((v) => v.id == (child as TreeDataItem).pId) as TreeDataItem;
  }
  return result;
}
/**
 * 获取某个ID的Lablel
 */
function getLableByValue(value: number) {
  const data = treeData.value;
  for (let i = 0; i < data.length; i++) {
    if(data[i]?.value == value)
      return data[i]!.title || '';
  }
  return '';
}
/**
 * 重新加载数据
 */
function reload() {
  treeData.value = [];
  doLoadData(0, 0) 
}


watch(() => props.value, (v) => {
  valueV.value = v || null;
});
watch(() => props.showDisplayValueBeforeEdit, (v, old) => {
  if(!old && v) {
    showDisplayValue.value = true;
  }
});

onMounted(() => { 
  valueV.value = props.value || null;
  if(props.showDisplayValueBeforeEdit)
    showDisplayValue.value = true;
  setTimeout(() => { 
    if(props.loadAtStart) {
      treeData.value = [];
      doLoadData(0, 0) ;
    }
  } , 300);
});

const expose : SelectTreeIdInterface = {
  getTree,
  getLableByValue,
  reload,
};

defineExpose(expose);
</script>

<style lang="scss" scoped>
.display-value {
  min-width: 150px;
  padding: 4px 11px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  line-height: 1.5715;
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
}
//暗黑主题
body[data-theme="dark"] {
  .display-value {
    color: #dedede;
    background-color: #1f1f1f;
    border: 1px solid #434343;
  }
}
</style>