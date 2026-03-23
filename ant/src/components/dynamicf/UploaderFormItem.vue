<template>
  <a-upload 
    :disabled="disabled"
    v-model:file-list="uploadSubImgList"
    list-type="picture-card"
    :class="uploadClass"
    :max-count="maxUploadCount"
    :show-upload-list="!single"
    v-bind="customProps"
    :customRequest="handleUpload"
    :beforeUpload="handleBeforeUpload"
    @reject="handleUploadSubImgReject"
    @change="handleUploadSubImgChange"
  >
    <template v-if="single">
      <div v-if="Boolean(value)" class="ant-upload-image">
        <a-image
          :src="value ?? ''"
          alt="avatar"
          :width="singleImageSize.width"
          :height="singleImageSize.height"
          :preview="false"
          :fallback="failImage" 
        />
      </div>
      <div v-else :style="{ width: singleImageSize.width, height: singleImageSize.height }">
        <loading-outlined v-if="uploadingSubImg"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">上传</div>
      </div>
    </template>
    <template v-else>
      <loading-outlined v-if="uploadingSubImg"></loading-outlined>
      <plus-outlined v-else></plus-outlined>
      <div class="ant-upload-text">上传</div>
    </template>
  </a-upload>
</template>

<script lang="ts" setup>
/**
 * 上传图片表单控件
 */
import { 
  stringUrlsToUploadedItems,
  type AntUploadRequestOption, type FileInfo, type FileItem, 
  type UploaderFormItemProps
} from './UploaderFormItem';
import { message } from 'ant-design-vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { ref, onMounted, watch } from 'vue';
import FailImage from '../../common/ImageFailed.png';

const props = withDefaults(defineProps<UploaderFormItemProps & {
  value?: unknown;
}>(), {
  disabled: false,
  failImage: FailImage,
  single: false,
  maxFileSize: 0,
  maxUploadCount: 0,
  singleImageSize: () => ({ width: 100, height: 100 }),
  value: undefined,
});

const emits = defineEmits([
  'update:value',
]);

const uploadSubImgList = ref<FileItem[]>([]);
const uploadingSubImg = ref(false);

onMounted(() => {
  //将之前上传的图片包括URL设置到已上传列表中
  if (!props.single) {
    setTimeout(() => {
      uploadSubImgList.value = stringUrlsToUploadedItems(props.value instanceof Array ? (props.value as string[] || []) : [])
    }, 400);
  }
});

const needRemoveItem : string[] = [];

watch(() => props.value, () => {
  if (!props.single) {
    uploadSubImgList.value = stringUrlsToUploadedItems(props.value instanceof Array ? (props.value as string[] || []) : [])
  }
});
watch(uploadSubImgList, (e) => {
  setTimeout(() => {
    if (needRemoveItem.length > 0) {
      //移除不允许上传的项目
      for (let i = 0; i < e.length; i++) {
        if (needRemoveItem.includes(e?.[i]?.uid || '')) 
          uploadSubImgList.value.splice(i, 1);
      }
      needRemoveItem.length = 0;
    }
  }, 300)
});

function handleBeforeUpload(file: FileItem) {
  const result = props.beforeUpload?.(file) ?? true;
  if (!result)
    needRemoveItem.push(file.uid);
  if (props.maxFileSize && props.maxFileSize > 0 && file.size > props.maxFileSize) {
    message.error('文件大小不能超过' + props.maxFileSize + '字节！');
    return false;
  }
  return result;
}
async function handleUpload(requestOption: AntUploadRequestOption) {
  props.upload?.uploadRequest(requestOption);
}
function handleUploadSubImgReject(e: FileInfo) {
  console.log(e);
}
function handleUploadSubImgChange(info: FileInfo) {
  if (info.file.status === 'uploading') {
    uploadingSubImg.value = true;
    return;
  }
  if (info.file.status === 'removed') {
    if (props.single)
      emits('update:value', '');
    else
      emits('update:value', (props.value as string[] || []).filter(url => url != info.file.url));
    return;
  }
  if (info.file.status === 'done') {
    const url = props.upload?.getUrlByUploadResponse(info.file.response) || '';
    if (props.single)
      emits('update:value', url);
    else
      emits('update:value', (props.value as string[] || []).concat([ url ]));
    uploadingSubImg.value = false;
  }
  if (info.file.status === 'error') {
    uploadingSubImg.value = false;
    message.error('上传失败！' + info.file.response);
  }
}
</script>

<style lang="scss">
.ant-upload-image {
  position: relative;
  border: 1px solid #dddddd;
  overflow: hidden;
  border-radius: 8px;
  text-align: center;

  span {
    position: absolute;
    margin: 10px;
    background-color: #e8e8e8;
    border-radius: 8px;
    padding: 5px 10px;
    font-size: 12px;
    z-index: 1;
  }
}

</style>