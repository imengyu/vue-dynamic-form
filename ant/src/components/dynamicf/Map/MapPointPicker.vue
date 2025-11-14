<template>
  <div :style="{ width, height }" class="map-point-picker">
    <img src="./Maker.png" />
    <span class="lonlat">经纬度：{{ Number(center[0]).toFixed(6) }}, {{ Number(center[1]).toFixed(6) }}</span>
    <AddressSercher v-if="showSearch" v-model="address" @choosedAddress="handleChoosedAddress" />
    <el-amap
      style="width: 100%"
      :center="center"
      :zoom="zoom"
      :dragEnable="!disabled"
      :zoomEnable="!disabled"
      :rotateEnable="!disabled"
      :keyboardEnable="!disabled"
      :doubleClickZoom="!disabled"
      :scrollWheel="!disabled"
      @init="handleInit"
      @update:center="handleUpdateCenter"
      v-bind="$attrs"
    >
    </el-amap>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, type PropType, type Ref } from 'vue';
import { defaultCenter } from './MapConfig';
import AddressSercher, { type AddressItem } from './AddressSercher.vue';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Object as PropType<(number|string)[]>,
    default: () => defaultCenter.concat()
  },
  zoom: {
    type: Number,
    default: 12
  },
  width: {
    type: [Number, String],
    default: '100%'
  },
  height: {
    type: [Number, String],
    default: '300px'
  },
  showSearch: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue' ])
const center = ref(defaultCenter) as Ref<number[]>;
let map: any = null;

const address = ref('');

function handleInit(mapRef: any) {
  map = mapRef;
}
function handleChoosedAddress(address: AddressItem) {
  center.value = [Number(address.lng), Number(address.lat)];
  handleUpdateCenter(center.value);
  map.setCenter(center.value);
}
function loadCenter() {
  if (props.modelValue)
    center.value = [Number(props.modelValue[0]), Number(props.modelValue[1])];
  else
    center.value = defaultCenter.concat();
  if (isNaN(center.value[0]!)) center.value[0] = defaultCenter[0]!;
  if (isNaN(center.value[1]!)) center.value[1] = defaultCenter[1]!;
}

watch(() => props.modelValue, (newVal) => {
  loadCenter()
})
function handleUpdateCenter(newVal: (number|string)[]) {
  emit('update:modelValue', newVal);
}

onMounted(() => {
  loadCenter();
})

defineExpose({
  moveTo(lonlat: (number|string)[], zoom?: number) {
    map.setCenter(lonlat);
    if (zoom) {
      map.setZoom(zoom);
    }
  }
})

</script>

<style lang="scss" scoped>
div {
  position: relative;
  border: 1px solid #ccc;
  border-radius: 10px;

  :deep(.address-searcher) {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    z-index: 20;
  }
}
.lonlat {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 12px;
  padding: 10px;
  color: #333;
  background-color: #fff;
  z-index: 100;
}
img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  pointer-events: none;
  z-index: 2;
}
</style>