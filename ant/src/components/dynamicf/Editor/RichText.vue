<template>
  <div class="editor-wrapper">
    <editor
      licenseKey="gpl"
      :id="id"
      :modelValue="modelValue"
      :init="initOptions"
      :disabled="disabled"
      @update:modelValue="handleUpdateModelValue"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, type PropType } from 'vue';
import { RandomUtils } from '@imengyu/imengyu-utils';
import Editor from '@tinymce/tinymce-vue'
import tinymce, { Editor as EditorType, type RawEditorOptions } from 'tinymce/tinymce';

const id = 'tinymce' + RandomUtils.genNonDuplicateID(10)

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: '请输入'
  },
  height: { 
    type: Number, 
    default: 550,
  },
  uploadImageCallback: {
    type: Function as PropType<(file: File) => Promise<string>>,
    default: () => {}
  }
})

const handleUpdateModelValue = (v: string) => {
  emit('update:modelValue', v);
};
const initOptions = computed<RawEditorOptions>(() => ({
  selector: '#' + id,
  base_url: '/tinymce', 
  language: 'zh_CN',
  language_url: '/tinymce/langs/zh_CN.js',
  skin_url: '/tinymce/skins/ui/oxide',
  content_css: '/tinymce/skins/content/default/content.css',
  height: props.height,
  toolbar_mode: 'wrap',
  promotion: false, 
  max_height: 8000,
  menubar: 'file edit insert view format tools help',
  plugins: [
    'quickbars preview insertdatetime emoticons autoresize searchreplace advlist autolink lists link image media codesample fullscreen',
    'table code help wordcount pagebreak anchor'
  ].join(' '),
  toolbar:
    'undo redo | blocks | fontfamily fontsize fontsizeinput | bold italic underline strikethrough | ' + 
    'subscript superscript | forecolor backcolor | removeformat | pastetext | bullist numlist | ' +
    'blockquote | indent2em | indent outdent | lineheight | alignjustify alignleft aligncenter alignright alignnone |' + 
    'link anchor image media table insertdatetime | hr pagebreak | fullscreen',
  setup(editor: EditorType) {
    editor.ui.registry.addButton('indent2em', {
      tooltip: '首行缩进2字符',
      text: '首行空2',
      onAction() {
        const dom = editor.dom;
        const blocks = editor.selection.getSelectedBlocks(); // 拿到所有选区块
        if (!blocks.length) return;
        /* 统一操作：只要有一个块没缩进就全部加上，否则全部去掉 */
        const needAdd = Array.from(blocks).some(
          b => dom.getStyle(b, 'text-indent') !== '2em'
        );
        blocks.forEach(b => {
          if (needAdd) dom.setStyle(b, 'text-indent', '2em');
          else dom.setStyle(b, 'text-indent', '');          // 取消
        });
      }
    });
  },
  font_family_formats: `
    宋体=SimSun,STSong;
    微软雅黑=Microsoft YaHei,SimHei;
    黑体=SimHei,Heiti TC;
    楷体=KaiTi,STKaiti;
    隶书=LiSu;
    幼圆=YouYuan;
    仿宋=FangSong;
    华文细黑=STXihei;
    华文楷体=STKaiti;
    华文宋体=STSong;
    Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats
  `,
  quickbars_image_toolbar: 'alignleft aligncenter alignright | rotateleft rotateright | imageoptions',
  font_size_formats: '初号=42px 小初=36px 一号=26px 小一=24px 二号=22px 小二=18px 三号=16px 小三=15px 四号=14px 小四=12px 五号=10.5px 小五=9px',
  /* 图片上传 → 自动转网络地址 */
  images_upload_handler: async (blobInfo: any, progress: any) => {
    const file = blobInfo.blob()
    return await props.uploadImageCallback(file)
  },
  /* 视频同理，关闭自带转码占位 */
  media_live_embeds: true,
  file_picker_types: 'image media',
  /* 粘贴 Word 图片自动走上传 */
  paste_data_images: true
}))

onMounted(() => {
  tinymce.init(initOptions.value);
})
</script>

<style lang="scss">

.editor-wrapper {
  position: relative;

 
}

</style>