<template>
  <div class="sign">
    <vue-esign v-show="showSign" ref="esign" :disabled="disabled" />
    <div v-show="!showSign" class="history">
      <img :src="modelValue" alt="历史签名" />
    </div>
    <div v-if="!disabled" class="footer">
      <div v-if="state === 'default'" class="tip">
        <InfoCircleOutlined />
        <span>请在虚线框内签名</span>
      </div>
      <div v-else-if="state === 'error'" class="tip error">
        <ExclamationCircleOutlined />
        <span>签名上传失败，请尝试重新上传</span>
      </div>
      <div v-else-if="state === 'success'" class="tip success">
        <CheckOutlined />
        <span>已签名，若有问题可以点击“重签”重新签名</span>
      </div>
      <div>
        <a-button size="small" shape="round" @click="clear">重签</a-button>
        <a-button type="primary" shape="round" size="small" @click="confirm">确认</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type PropType } from 'vue';
import VueEsign from 'vue-esign';
import { InfoCircleOutlined, ExclamationCircleOutlined, CheckOutlined } from '@ant-design/icons-vue';
import { Form, message, Modal } from 'ant-design-vue';
import type { UploadCoInterface } from './UploadImageFormItem';

export interface SignProps {
  disabled: boolean;
  modelValue: string;
  uploadCo: UploadCoInterface;
}

const props = defineProps({
  disabled: { 
    type: Boolean, 
    default: false 
  },
  modelValue: {
    type: String,
    default: ''
  },
  /**
   * 上传工厂类
   */
  uploadCo: {
    type: Object as PropType<UploadCoInterface>,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);
const esign = ref();
const state = ref<'default'|'error'|'success'>('default');
const showSign = ref(true);

const formItemContext = Form.useInjectFormItemContext();

onMounted(() => {
  if (props.modelValue) {
    state.value = 'success';
    showSign.value = false;
  }
})

const clear = () => {
  if (props.modelValue) {
    Modal.confirm({
      title: '确认清除签名？',
      okText: '清除',
      onOk: () => {
        emit('update:modelValue', '');
        formItemContext.onFieldChange();
        esign.value.reset();
        state.value = 'default';
        showSign.value = true;
      }
    })
  } else {
    state.value = 'default';
    esign.value.reset();
    showSign.value = true;
  }
}
const confirm = () => {
  esign.value.generate().then((res: string) => {
    if (props.uploadCo) {
      //上传
      return new Promise((resolve, reject) => {
        const blob = base64ToBlob(res, 'image/png');
        const file = new File([blob], 'image.png', { type: 'image/png' });
        props.uploadCo.uploadRequest({
          file: file,
          filename: 'sign.png',
          action: '',
          headers: {}, 
          withCredentials: true, 
          method: 'post',
          data: {},
          onProgress: () => {},
          onSuccess: (res) => {
            resolve(res.url);
          },
          onError: (err) => {
            reject(err);
          },
        })
      }).then((res) => {
        message.success('签名上传成功');
        state.value = 'success';
        formItemContext.onFieldChange();
        showSign.value = false;
        emit('update:modelValue', res);
      }).catch((err) => {
        state.value = 'error';
        Modal.error({
          title: '上传失败',
          content: '签名上传失败，请尝试重新上传：' + err.message,
        })
      });
    } else {
      // 不上传，直接返回base64字符串
      formItemContext.onFieldChange();
      showSign.value = false;
      emit('update:modelValue', res);
    }
  });
}

function base64ToBlob(base64: string, mimeType = 'image/png') {
  const byteCharacters = atob(base64.split(',')[1]!); // 去掉 data:image/png;base64, 前缀
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

</script>

<style lang="scss" scoped>

.sign {
  width: 100%;
  height: 100%;
  border: 1px dashed #ddd;
  border-radius: 10px;
  overflow: hidden;

  .history {
    position: relative;
    margin-bottom: 10px;

    img {
      max-width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .tip {
    font-size: 12px;
    color: #999;

    &.error {
      color: #bd2028;
    }
    &.success {
      color: #198754;
    }
  }
  .footer {
    padding: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    > div {
      display: flex;
      gap: 5px;
    }
  }
}

</style>


