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

<script lang="ts">
import type { SelectProps } from "ant-design-vue";
import { defineComponent, type PropType } from "vue";
import type { TreeDataItem } from "../IdAsValueTree";

export type SelectTreeIdLoadDataFun = (pid: string|number, level: number) => Promise<TreeDataItem[]>;
export type SelectTreeIdCheckClickableFun = (item: TreeDataItem) => Promise<boolean>;

export type SelectTreeIdGetDiaplayValue = (ref: SelectTreeIdInterface) => string;
export type SelectTreeIdGetRef = (ref: SelectTreeIdInterface) => void;

/**
 * SelectTreeId 的公共接口
 */
export interface SelectTreeIdInterface {
  /**
   * 获取某个ID的树(正排列)
   * @param value 要获取的ID
   */
  getTree(value: number) : Array<TreeDataItem>;
  /**
   * 获取某个ID的Lablel
   * @param value 要获取的ID
   */
  getLableByValue(value: number) : string;
  /**
   * 重新加载数据
   */
  reload(): void;
}
/**
 * SelectTreeId 的公共接口
 */
export interface SelectTreeIdProps {
  /**
   * 允许清除
   */
  allowClear?: boolean,
  /**
   * 多选？
   */
  multiple?: boolean,
  dropdownStyle?: Record<string, unknown>,
  disabled?: boolean,
  placeholder?: string,
  /**
   * 未找到数据时的文案
   */
  notFoundContent?: string,
  /**
   * 初始化时加载数据
   */
  loadAtStart?: boolean,
  /**
   * 加载数据
   */
  loadData?: SelectTreeIdLoadDataFun,
  /**
   * 自定义检查条目是否可点击回调
   */
  checkClickable?: SelectTreeIdCheckClickableFun,
  /**
   * 获取显示数据回调
   */
  getDisplayValue?: SelectTreeIdGetDiaplayValue,
  /**
   * 是否在非激活时显示临时字符串（防止树形数据没有加载，而无法显示当前值）
   */
  showDisplayValueBeforeEdit?: boolean,
  /**
   * 子数据最大层级
   */
  maxLevel?: number,
  /**
   * 是否只有最后一级可以点击
   */
  onlyLastLevelClickable?: boolean,
  /**
   * a-select 其他自定义参数
   */
  customProps?: SelectProps,
}

/**
 * 使用数据的ID作为value的下拉框包装
 */
export default defineComponent({
  name: "SelectTreeId",
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
    multiple: {
      default: false,
      type: Boolean
    },
    dropdownStyle: {
      type: Object,
      default: () => { return { maxHeight: '400px', overflow: 'auto' } }
    },
    disabled: {
      default: false,
      type: Boolean
    },
    placeholder: {
      default: '请选择，输入可进行搜索',
      type: String
    },
    notFoundContent: {
      default: '未找到数据，请换个搜索词再试',
      type: String
    },
    loadAtStart: {
      default: true,
      type: Boolean
    },
    value: {
      default: null,
    },
    loadData: {
      type: Function as PropType<SelectTreeIdLoadDataFun>,
      default: null,
    },
    checkClickable: {
      type: Function as PropType<SelectTreeIdCheckClickableFun>,
      default: null,
    },
    getDisplayValue: {
      type: Function as PropType<SelectTreeIdGetDiaplayValue>,
      default: null,
    },
    defaultDisplayValue: {
      type: String,
      default: '',
    },
    showDisplayValueBeforeEdit: {
      default: false,
      type: Boolean
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
      type: Object as PropType<SelectProps>,
      default: null,
    },
  },
  computed: {
    displayValue() : string {
      if (this.valueV != null && this.valueV != 0 && this.defaultDisplayValue != '')
        return this.defaultDisplayValue;
      if (this.getDisplayValue)
        return (this.getDisplayValue as SelectTreeIdGetDiaplayValue)(this as SelectTreeIdInterface); 
      return '';
    },
  },
  methods: {
    handleChange(value: unknown) {
      this.$nextTick(() => {
        if(value != this.value) {
          this.$emit('update:value', value); 
          this.$emit('change', value); 
        }
      })
    },
    handleLoadData(treeNode: { dataRef: TreeDataItem }) {
      return new Promise((resolve: (value?: unknown) => void) => {
        const { id, level } = treeNode.dataRef;
        this.doLoadData(id, level as number).then(() => resolve()).catch(() => resolve());
      });
    },
    handleDisplayValueClick() {
      this.showDisplayValue = false;
      setTimeout(() => {
        (this.$refs.selectRef as {
          focus: () => void
        }).focus();
      }, 200);
    },
    handleSelectBlur() {
      if(this.showDisplayValueBeforeEdit) {
        if(this.valueV != null && this.valueV != 0 && this.defaultDisplayValue != '')
          this.showDisplayValue = true;
        else if (this.getLableByValue(this.valueV as number) === '') //只有没有在列表中搜索到数据时，才显示临时数据
          this.showDisplayValue = true;
      }
    },
    doLoadData(pid: string|number|null, level: number) {
      const loadData = this.loadData;
      if(typeof loadData === 'function') {
        return (loadData as SelectTreeIdLoadDataFun)(pid as string, level).then((d) => {
          for(let i = this.treeData.length - 1; i >= 0; i--)
            if(this.treeData[i]?.pId == pid)
              this.treeData.splice(i, 1);
          d.forEach(h => {
            h.level = level + 1;
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
            this.treeData.push(h)
          });
        });
      } else 
        return Promise.resolve();
    },

    /**
     * 获取某个ID的树(正排列)
     */
    getTree(value: number) {
      const result = new Array<TreeDataItem>();
      let child : TreeDataItem|null = this.treeData.find((v) => v.id == value) as TreeDataItem;
      while(child) {
        result.unshift(child);
        if(child.pId == 0) child = null;
        else child = this.treeData.find((v) => v.id == (child as TreeDataItem).pId) as TreeDataItem;
      }
      return result;
    },
    /**
     * 获取某个ID的Lablel
     */
    getLableByValue(value: number) {
      const data = this.treeData;
      for (let i = 0; i < data.length; i++) {
        if(data[i]?.value == value) {
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
      this.doLoadData(0, 0) 
    },
  },
  watch: {
    value(v) {
      this.valueV = v;
    },
    showDisplayValueBeforeEdit(v, old) {
      if(!old && v) {
        this.showDisplayValue = true;
      }
    },
  },
  data() {
    return {
      showDisplayValue: false,
      valueV: null as null|number|string,
      treeData: [] as TreeDataItem[],
    }
  },
  mounted() { 
    this.valueV = this.value;
    if(this.showDisplayValueBeforeEdit)
      this.showDisplayValue = true;
    setTimeout(() => { 
      if(this.loadAtStart) {
        this.treeData = [];
        this.doLoadData(0, 0) ;
      }
    } , 300);
  }
});
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