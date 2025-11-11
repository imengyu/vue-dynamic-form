<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { ScrollRect } from '@imengyu/vue-scroll-rect';
import type { SelectProps } from 'ant-design-vue';

// 定义Props
const props = defineProps<{
  modelValue?: string;
  disabled?: boolean;
}>();

// 定义Emits
const emit = defineEmits<{
  'update:modelValue': [value: string];
  'choosedAddress': [address: AddressItem];
}>();

export interface AddressItem {
  name: string;
  lng: number;
  lat: number;
  address: string;
}

// 状态管理
const inputValue = ref(props.modelValue);
const addressList = ref<Array<AddressItem>>([]);
const loading = ref(false);
const openList = ref(false);

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue ;
});



// 调用高德API搜索地址
async function searchAddress() {
  if (!inputValue.value?.trim()) return;
  loading.value = true;
  openList.value = true;

  try {
    const apiKey = '8fd09264c33678141f609588c432df0e';
    const url = `https://restapi.amap.com/v3/place/text?key=${apiKey}&keywords=${encodeURIComponent(inputValue.value)}&citylimit=true&offset=10&page=1`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === '1' && data.pois && data.pois.length > 0) {
      console.log('搜索到的地址:', data.pois);
      
      addressList.value = data.pois.map((item: any) => ({
        name: item.name,
        lng: parseFloat(item.location.split(',')[0]),
        lat: parseFloat(item.location.split(',')[1]),
        address: item.address ? `${item.cityname}${item.adname}${item.address} ${item.name}` : item.name
      }));
    } else {
      addressList.value = [];
    }
  } catch (error) {
    console.error('搜索地址失败:', error);
    addressList.value = [];
  } finally {
    loading.value = false;
  }
}

// 选择地址
function handleSelectAddress(address: any) {
  // 更新输入值
  inputValue.value = address.address;
  // 关闭下拉列表
  openList.value = false;
  
  // 发送详细地址信息
  emit('choosedAddress', {
    name: address.name,
    lng: address.lng,
    lat: address.lat,
    address: address.address
  });
}

watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue ?? '');
})

// 处理输入变化
function handleInputChange(value: string) {
  inputValue.value = value;
  emit('update:modelValue', value);
}

// 处理点击搜索按钮
function handleSearch() {
  searchAddress();
}

// 定义select组件的选项
const selectOptions = computed<SelectProps['options']>(() => {
  return addressList.value.map(item => ({
    label: item.name,
    value: item.address,
    data: item
  }));
});
</script>

<template>
  <div class="address-searcher">
    <div class="input-wrapper">
      <a-input
        v-model:value="inputValue"
        mode="combobox"
        :options="selectOptions"
        :disabled="props.disabled"
        :show-search="true"
        :default-active-first-option="false"
        :filter-option="false"
        :not-found-content="'暂无匹配的可选地址，可修改关键字扩大搜索范围'"
        placeholder="请输入地址"
        style="width: 100%;"
        @select="(value: string, option: any) => handleSelectAddress(option?.data)"
        @search="handleInputChange"
      />
    </div>
    <a-popover placement="bottomRight" trigger="click" v-model:open="openList" >
      <template #content>
        <ScrollRect scroll="vertical">
          <a-list class="list" size="small" itemLayout="vertical" :data-source="selectOptions">
            <template #renderItem="{ item }">
              <div class="list-item" @click="handleSelectAddress(item.data)">
                <div class="list-item-content">
                  <div class="list-item-title">{{ item.label }}</div>
                  <div class="list-item-desc">{{ item.value }}</div>
                </div>
              </div>
            </template>
          </a-list>
        </ScrollRect>
      </template>
      <template #title>
        <span>模糊地址查询</span>
      </template>
      <a-button :disabled="props.disabled" type="primary" :loading="loading" @click="handleSearch">
        <SearchOutlined />
        搜索
      </a-button>
    </a-popover>
  </div>
</template>

<style scoped lang="scss">
.address-searcher {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;

  .input-wrapper {
    flex: 1;
  }
}
.list {
  width: 50vw;
  max-width: 600px;
  max-height: 70vh;

  .list-item {
    padding: 8px 12px;
    cursor: pointer;
    &:hover {
      background-color: #f5f5f5;
    }
  }
  .list-item-content {
    display: flex;
    flex-direction: column;
  }
  .list-item-title {
    font-size: 14px;
    font-weight: 500;
  }
  .list-item-desc {
    font-size: 12px;
    color: #999;
  }
}
</style>
