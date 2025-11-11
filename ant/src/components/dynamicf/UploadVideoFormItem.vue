<template>
  <a-upload 
    v-bind="customProps"
    :disabled="disabled"
    v-model:file-list="uploadSubImgList"
    list-type="picture"
    :class="uploadClass"
    :max-count="single ? 1 : maxCount"
    :customRequest="handleUpload"
    :beforeUpload="handleBeforeUpload"
    @change="handleUploadSubImgChange"
    @reject="handleUploadSubImgReject"
  >
    <a-button v-if="!disabled">
      <upload-outlined></upload-outlined>
      上传
    </a-button>
    <span v-if="disabled && uploadSubImgList.length == 0">暂无</span>
  </a-upload>
</template>

<script lang="ts" setup>
/**
 * 上传图片表单控件
 */
import { 
  stringUrlsToUploadedItems, type UploadCoInterface, 
  type AntUploadRequestOption, type FileInfo, type FileItem 
} from './UploadImageFormItem';
import { message, type UploadProps } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { type PropType, ref, onMounted, watch } from 'vue';
import FailImage from '../../common/ImageFailed.png';

const props = defineProps({
  /**
   * 是否禁用
   */
  disabled: {
    type: Boolean,
    default: false
  },
  /**
   * 预览图加载失败时显示图片
   */
  failImage: {
    type: String,
    default: () => FailImage,
  },
  /**
   * 上传工厂类
   */
  uploadCo: {
    type: Object as PropType<UploadCoInterface>,
    default: null,
  },
  /**
   * 上传之前的自定义检查回调
   * (file: FileItem) => boolean
   * 如果返回false，将停止上传
   */
  beforeUpload: {
    type: Function,
    default: null,
  },
  /**
   * 类样式
   */
  uploadClass: {},
  /**
   * 是否限制单图上传
   */
  single: {
    type: Boolean,
    default: false
  },
  /**
   * single 为false时，限制最多上传图片的数量
   */
  maxCount: {
    type: Number,
    default: 0,
  },
  /**
   * single 模式下图片显示大小
   */
  singleImageSize: {
    type: Object as PropType<{ width: number, height: number }>,
    default: () => ({ width: 250, height: 150 })
  },
  /**
   * 参数，可以是单张 string，多张 string[]
   */
  value: {},
  /**
   * a-upload 其他自定义参数
   */
  customProps: {
    type: Object as PropType<UploadProps>,
    default: null,
  },
});

const emits = defineEmits([
  'update:value',
]);

const uploadSubImgList = ref<FileItem[]>([]);
const uploadingSubImg = ref(false);

function loadValue() {
uploadSubImgList.value = stringUrlsToUploadedItems(
  props.value instanceof Array ? (props.value as string[] || []) : [
    props.value as string
  ])
}

onMounted(() => {
  //将之前上传的图片包括URL设置到已上传列表中
  setTimeout(loadValue, 400);
});

const needRemoveItem : string[] = [];

watch(() => props.value, () => {
  loadValue();
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
  return result;
}
function handleUpload(requestOption: AntUploadRequestOption) {
  props.uploadCo?.uploadRequest(requestOption);
}
function handleUploadSubImgReject(e: FileInfo) {
  console.log(e);
  message.error('上传失败！' + e.file.response);
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
    const url = props.uploadCo?.getUrlByUploadResponse(info.file.response) || '';
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
.ant-upload-video {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border: 1px solid #666666;
  background-color: #e8e8e8;
  border-radius: 8px;
  text-align: center;
}

</style>