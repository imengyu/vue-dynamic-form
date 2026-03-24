<template>
  <a-select
    :modelValue="(valueV as string)"
    :mode="multiple ? 'multiple' : 'combobox'"
    :allowClear="allowClear"
    :allowSearch="showSearch"
    :disabled="disabled"
    :placeholder="placeholder"
    :default-active-first-option="false"
    :options="finalData"
    :filterOption="showSearch && filterDirectly ? filterOption : false"
    @update:FileStatus ="handleChange"
    @search="handleSearch"
    :fieldNames="{
      label: 'text',
      value: 'value',
      options: 'options',
    }"
    v-bind="customProps"
    style="min-width: 150px"
  >
    <template v-if="renderOption" #option="data">
      <VNodeRenderer :render="(renderOption as any)" :data="data" />
    </template>
    <template v-if="notFoundContent" #empty>
      <a-empty :description="notFoundContent" />
    </template>
    <a-select-option v-if="showNull" :value="null">(空)</a-select-option>
  </a-select>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, type Ref, computed } from "vue";
import { Debounce, StringUtils } from "@imengyu/imengyu-utils";
import VNodeRenderer from "../../../components/VNodeRenderer.vue";
import type { DropdownValues, LoadDataFun, SelectIdProps } from "./SelectId";
import type { SelectOptionData } from "@arco-design/web-vue";

/**
 * 使用数据的ID作为value的下拉框包装
 */
const props = withDefaults(defineProps<SelectIdProps<any> & {
  value?: string|number|null
}>(), {
  allowClear: false,
  multiple: false,
  disabled: false,
  showSearch: true,
  placeholder: "输入可进行搜索",
  notFoundContent: "未找到数据，请换个搜索词再试",
  loadAtStart: true,
  filterDirectly: true,
});
const emit = defineEmits([
  "update:value",
  "change",
  "loaded",
]);
const valueV = ref<string|number|null|undefined>(null);
const data = ref<DropdownValues<any>[]>([]) as Ref<DropdownValues<any>[]>;
const finalData = computed<SelectOptionData[]>(() => {
  return data.value.map(item => ({
    label: item.text as string,
    value: item.value as string|number,
  }));
});
const lastSearchValue = ref('');

const searchDebunce = new Debounce(500, () => {
  if (!props.filterDirectly)
    doLoadData(lastSearchValue.value);
})
const handleSearch = (val: string) => {
  lastSearchValue.value = val;
  searchDebunce.executeWithDelay();
};
const handleChange = (value: unknown) => {
  emit("change", value);
  emit("update:value", value);
};
const doLoadData = (val: string | null) => {
  if (typeof props.loadData === "function") {
    const oldValue = valueV.value;
    valueV.value = null;
    (props.loadData as LoadDataFun<any>)(val).then((d) => {
      data.value = d;
      setTimeout(() => {
        valueV.value = oldValue;
        emit("loaded");
      }, 30);
    });
  }
};
const filterOption = (input: string, option: SelectOptionData) => {
  return !props.filterDirectly || (option.label || '').toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const getLableByValue = (value: number) => {
  for (let i = 0; i < data.value.length; i++) {
    if (data.value[i]?.value == value) {
      return data.value[i]?.text;
    }
  }
  return "";
};
const reload = (clearValue = false) => {
  if (clearValue) {
    valueV.value = null;
    handleChange(null);
  }
  data.value = [];
  doLoadData(props.intitialSearchValue as string);
};


// watch(() => props.loadData, () => {
//   doLoadData(props.intitialSearchValue);
// });
watch(() => props.intitialSearchValue, (v) => {
  if (!props.filterDirectly && !StringUtils.isNullOrEmpty(v)) {
    doLoadData(v!);
  }
});
watch(() => props.value, (v) => {
  valueV.value = v;
});


onMounted(() => {
  valueV.value = props.value;
  setTimeout(() => {
    if (props.loadAtStart) {
      doLoadData(props.intitialSearchValue as string);
    }
  }, 300);
});


defineExpose({
  getLableByValue,
  reload
});
</script>