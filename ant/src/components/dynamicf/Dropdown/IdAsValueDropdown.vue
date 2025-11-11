<template>
  <a-select
    :value="valueV"
    :mode="multiple ? 'multiple' : 'combobox'"
    :allowClear="allowClear"
    :showSearch="showSearch"
    :disabled="disabled"
    :placeholder="placeholder"
    :default-active-first-option="false"
    :notFoundContent="notFoundContent"
    :options="data"
    :filterOption="showSearch && filterDirectly ? filterOption : false"
    @update:value="handleChange"
    @search="handleSearch"
    v-bind="customProps"
    style="min-width: 150px"
  >
    <template v-if="renderOption" #option="data">
      <VNodeRenderer :render="(renderOption as any)" :data="data" />
    </template>
    <a-select-option v-if="showNull" :value="null">(空)</a-select-option>
  </a-select>
</template>

<script lang="ts" setup>
import VNodeRenderer from "../../../components/VNodeRenderer.vue";
import { type SelectProps } from "ant-design-vue";
import { ref, watch, onMounted, type PropType, type VNode, type Ref } from "vue";
import type { DropdownValues, LoadDataFun } from "./IdAsValueDropdown";
import type { DataModel } from "@imengyu/js-request-transform";
import { Debounce, StringUtils } from "@imengyu/imengyu-utils";

type RenderOption<T> = (data: {
  value: unknown,
  label: string,
  raw: T
}) => VNode;

/**
 * 使用数据的ID作为value的下拉框包装
 */

// 定义props
const props = defineProps({
  showNull: {
    default: false,
    type: Boolean
  },
  renderOption: {
    default: null,
    type: Function as PropType<RenderOption<DataModel>>
  },
  allowClear: {
    default: false,
    type: Boolean
  },
  multiple: {
    default: false,
    type: Boolean
  },
  disabled: {
    default: false,
    type: Boolean
  },
  showSearch: {
    default: true,
    type: Boolean
  },
  placeholder: {
    default: "输入可进行搜索",
    type: String
  },
  notFoundContent: {
    default: "未找到数据，请换个搜索词再试",
    type: String
  },
  loadAtStart: {
    default: true,
    type: Boolean
  },
  filterDirectly: {
    default: true,
    type: Boolean
  },
  value: {
    default: null,
  },
  intitialSearchValue: {
    default: null,
    type: String
  },
  loadData: {
    type: Function as PropType<LoadDataFun<DataModel>>,
    default: null,
  },
  /**
   * a-select 其他自定义参数
   */
  customProps: {
    type: Object as PropType<SelectProps>,
    default: null,
  },
});

// 定义事件
const emit = defineEmits([
  "update:value",
  "change",
  "loaded",
]);

// 响应式数据
const valueV = ref(null);
const data = ref<DropdownValues<DataModel>[]>([]) as Ref<DropdownValues<DataModel>[]>;
const lastLoadValue = ref(null);
const lastSearchValue = ref('');

// 方法定义
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
    (props.loadData as LoadDataFun<DataModel>)(val).then((d) => {
      data.value = d;
      setTimeout(() => {
        valueV.value = oldValue;
        emit("loaded");
      }, 30);
    });
  }
};

const filterOption = (input: string, option: {
  label: string;
}) => {
  return !props.filterDirectly || option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const getLableByValue = (value: number) => {
  for (let i = 0; i < data.value.length; i++) {
    if (data.value[i]?.value == value) {
      return data.value[i]?.label;
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

// 监听变化
watch(() => props.loadData, () => {
  doLoadData(props.intitialSearchValue);
});

watch(() => props.intitialSearchValue, (v) => {
  if (!props.filterDirectly && !StringUtils.isNullOrEmpty(v)) {
    doLoadData(v);
  }
});

watch(() => props.value, (v) => {
  valueV.value = v;
});

// 生命周期钩子
onMounted(() => {
  valueV.value = props.value;
  setTimeout(() => {
    if (props.loadAtStart) {
      doLoadData(props.intitialSearchValue as string);
    }
  }, 300);
});

// 暴露方法给父组件使用
defineExpose({
  getLableByValue,
  reload
});
</script>