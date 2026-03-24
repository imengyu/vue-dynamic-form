<template>
  <a-cascader
    :modelValue="value"
    :options="options"
    :loadMore="doLoadData"
    :placeholder="placeholder"
    @update:modelValue="onUpdateValue"
    v-bind="(customProps as any)"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref, toRefs, watch } from "vue";
import type { CascaderProps, CascaderFormItemProps } from "./CascaderFormItem";
import type { CascaderOption } from "@arco-design/web-vue";

const props = withDefaults(defineProps<CascaderFormItemProps & {
  value?: number[]
}>(), {
  placeholder: '请选择地址',
  loadAtStart: true,
  loadCascaderToCurrentValueAtStart: true,
  onSelectFindIdKey: 'id',
});
const emit = defineEmits([
  'update:value'
]);


const { loadAtStart, loadCascaderToCurrentValueAtStart, value, loadData, onSelect } = toRefs(props);
const options = ref<CascaderProps['options']>([]);

const doLoadData = (option: CascaderOption, done: (children?: CascaderOption[] | undefined) => void) => {
  loadData.value(option.value as number, option)
    .then((d) => {
      if (!d)
        throw new Error("loadData return invalid data!");
      if (!parent) {
        //这个时候加载一下默认选择项目
        if (loadCascaderToCurrentValueAtStart.value)
          doLoadDataToCurrentValue();
      }
      done(d);
    }).catch((e) => {
      console.error(e);
    });
};

function onUpdateValue(_v: unknown) {
  const value = _v as number[];
  emit('update:value', value);

  //选中后回调
  if (typeof onSelect.value === 'function') {
    const objArr = [] as unknown[];
    const valueArrNow = value.concat();
    //通过ID查找指定的对象
    let optionsCurrent = options.value as CascaderProps['options'];
    for (let i = 0; i < value.length; i++) {
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
    onSelect.value(value, objArr);
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
      loadData.value(valueArrNow[index]!, option)
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
    doLoadData([], (v) => {
      options.value = v || [];
    });
});

watch(value, () => {
  doLoadDataToCurrentValue();
});

</script>