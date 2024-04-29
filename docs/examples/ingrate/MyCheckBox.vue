
<template>
  <div>
    <input
      type="checkbox"
      :modelValue="value"
      :id="name"
      @update:modelValue="onValueUpdate"
      @change="(e: Event) => onValueUpdate((e.target as HTMLInputElement).checked)"
    />
    <label :for="name">{{text}}</label>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  //这是传入的数据
  value: {},
  //你可以定义其他自定义属性，可以通过 additionalProps 传入。
  name: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
});

const emit = defineEmits([ 'update:value' ]);

function onValueUpdate(v: boolean) {
  emit('update:value', v);//这里是为了数据可以双向绑定
}
</script>