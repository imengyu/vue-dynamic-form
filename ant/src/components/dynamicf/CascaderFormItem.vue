<template>
  <a-cascader
    :value="value"
    :options="options"
    :load-data="doLoadData"
    :placeholder="placeholder"
    @update:value="onUpdateValue"
    change-on-select
    v-bind="(customProps as any)"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, type PropType, ref, toRefs, watch } from "vue";
import type { CascaderProps } from "ant-design-vue";
import type { CascaderFormItemLoadDataFun, CascaderFormItemOnChooseFun } from "./CascaderFormItem";

export default defineComponent({
  props: {
    loadData: {
      type: Function as PropType<CascaderFormItemLoadDataFun>,
      default: null,
    },
    placeholder: {
      type: String,
      default: '请选择地址',
    },
    loadAtStart:  {
      type: Boolean,
      default: true,
    },
    loadCascaderToCurrentValueAtStart: {
      type: Boolean,
      default: true,
    },
    value: {},
    /**
     * 选择后回调
     */
    onSelect: {
      type: Function as PropType<CascaderFormItemOnChooseFun>,
      default: null,
    },
    onSelectFindIdKey: {
      type: String,
      default: 'id',
    },
    /**
     * a-cascader 其他自定义参数
     */
    customProps: {
      //type: Object as PropType<CascaderProps>,
      default: null,
    },
  },
  emits: [
    'update:value'
  ],
  setup(props, context) {

    const { loadAtStart, loadCascaderToCurrentValueAtStart, value, loadData, onSelect } = toRefs(props);
    const options = ref<CascaderProps['options']>([]);

    const doLoadData = ((selectedOptions) => {
      const parent = selectedOptions && selectedOptions.length > 0 ? selectedOptions[selectedOptions.length - 1] : null;
      loadData.value(parent?.value as number, selectedOptions ? selectedOptions.length : 0, parent)
        .then((d) => {
          if (!d)
            throw new Error("loadData return invalid data!");
          if (parent) {
            //添加数据至指定层级下方
            if (!parent.children)
              parent.children = d;
            else
              parent.children = parent.children.concat(d);
          } else {
            //添加数据
            options.value = d;
            //这个时候加载一下默认选择项目
            if (loadCascaderToCurrentValueAtStart.value)
              doLoadDataToCurrentValue();
          }
        }).catch((e) => {
          console.error(e);
        });
    }) as CascaderProps['loadData'];

    function onUpdateValue(v: number[]) {
      context.emit('update:value', v);

      //选中后回调
      if (typeof onSelect.value === 'function') {
        const objArr = [] as unknown[];
        const valueArrNow = v.concat();
        //通过ID查找指定的对象
        let optionsCurrent = options.value as CascaderProps['options'];
        for (let i = 0; i < v.length; i++) {
          if (!optionsCurrent)
            break;
          const item = optionsCurrent.find(k => k.value === valueArrNow[i]);
          if (item) {
            objArr.push(item);
            optionsCurrent = item.children;//下一级
          } else {
            break;
          }
        }
        //回调
        onSelect.value(v, objArr);
      }
    }

    //加载树形数据至当前选中层级
    function doLoadDataToCurrentValue() {
      const valueArrNow = (value.value as number[]).concat();

      function findChildren(index: number, optionsCurrent: CascaderProps['options']) {
        if (!optionsCurrent)
          return;
        //当前级数据，查找是否存在，
        const option = optionsCurrent.find(k => k.value === valueArrNow[index]);
        if (option && (!option.children || option.children.length === 0)) {
          //存在，尝试加载下一级数据
          loadData.value(valueArrNow[index]!, index, option)
            .then((d) => {
              if (!d)
                throw new Error("loadData return invalid data!");
              if (parent) {
                if (!option.children)
                  option.children = d;
                else
                  option.children = option.children.concat(d);
                
                //如果还没有达到输入选择的层级，则进行下一次加载
                if (index < valueArrNow.length - 1) {
                  findChildren(index + 1, option.children);
                }
              }
            }).catch((e) => {
              console.error(e);
            });
        }
      }

      findChildren(0, options.value);
    }

    onMounted(() => {
      if (loadAtStart.value && typeof doLoadData === 'function')
        doLoadData([]);
    });

    watch(value, () => {
      doLoadDataToCurrentValue();
    });

    return {
      doLoadData,
      doLoadDataToCurrentValue,
      onUpdateValue,
      options,
    };
  },
});
</script>