<template>
  <div>
    <div>
      <a-button @click="() => value?.push('')">
        添加 <template #icon><PlusOutlined /></template>
      </a-button>
      <a-popconfirm
        v-if="value && value.length > 0"
        title="真的要清空所有条目吗？"
        @confirm="value?.splice(0, value.length)"
      >
        <a-button class="ml-3" danger >
          <template #icon>
            <CloseSquareOutlined />
          </template>
            清空
        </a-button>
      </a-popconfirm>
    </div>
    <div class="mt-2 position-relative" v-for="(v, k) in value" :key="k">
      <input 
        class="display-inline-block ant-input" 
        style="width:calc(100% - 100px)" 
        :value="value?.[k]"
        :maxlength="maxLength" 
        :disabled="disabled" 
        :placeholder="placeholder"
        @input="(e) => setValue(k, (e.target as HTMLInputElement).value)"
      />
      <a-popconfirm
        title="确定删除此条目吗？"
        @confirm="value?.slice(value.indexOf(v), 1)"
      >
        <a-button class="ml-3">
          <template #icon><DeleteOutlined /></template>
        </a-button>
      </a-popconfirm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, type PropType } from 'vue'
import { PlusOutlined, DeleteOutlined, CloseSquareOutlined } from '@ant-design/icons-vue'

/**
 * 简单的字符串列表动态表单
 */

const emit = defineEmits([ 'update:value', 'blur' ]);
const props = defineProps({
  /**
   * ID
   */
  id: {
    required: false
  },
  /**
   * 参数数组
   */
  value: {
    type: Object as PropType<Array<string>>
  },
  /**
   * 输入框 placeholder
   */
  placeholder: {
    type: String,
    default: '请输入参数值',
  },
  /**
   * 输入框最大输入长度
   */
  maxLength: {
    type: Number,
    default: 50,
  },
  /**
   * sf
   */
  disabled: {
    type: Boolean,
    default: false,
  },
})
const deleteConfirm = ref(false);

function setValue(index: number, value: string) {
  const values = props.value || [];
  values[index] = value;
  emit('update:value', values);
}

</script>