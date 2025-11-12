import { StringUtils } from "@imengyu/imengyu-utils";
import { message, type UploadProps } from "ant-design-vue";

export interface UploaderFormItemProps {
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 上传工厂类
   */
  uploadCo: UploadCoInterface;
  /**
   * 上传之前的自定义检查回调
   * 如果返回false，将停止上传
   */
  beforeUpload?: (file: FileItem) => boolean;
  /**
   * 是否限制单图上传
   */
  single?: boolean;
  /**
   * single 为false时，限制最多上传图片的数量
   */
  maxCount?: number
  /**
   * 类样式
   */
   uploadClass?: unknown;
  /**
   * single 模式下图片显示大小
   */
  singleImageSize?: { width: number, height: number },
  /**
   * 参数，可以是单张 string，多张 string[]
   */
  value?: unknown;
  /**
   * a-upload 其他自定义参数
   */
  customProps?: UploadProps;
}

/**
 * 上传工厂接口
 */
export interface UploadCoInterface {
  /**
    * 上传主函数。由 ant-upload 调用。
    */
  uploadRequest: (requestOption: AntUploadRequestOption) => void,
  /**
    * 获取上传返回后的URL函数。
    */
  getUrlByUploadResponse: (response: unknown) => string,
}

export interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url: string;
  type: string;
  size: number;
  originFileObj?: unknown;
}

export interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}

export interface AntUploadRequestOption {
  action: string|Promise<string>;
  filename: string;
  data : unknown;
  file: File;
  headers: { [index: string]: string; };
  withCredentials: boolean;
  method: string;
  onProgress: (e: { percent: number }) => void;
  onSuccess: (ret : { url: string, key: string }, xhr : XMLHttpRequest|null) => void;
  onError: (err : Error|null|undefined, ret : unknown) => void;
}

/**
 * 上传图片大小检查组合代码。
 * @param limitSizeMB 限制大小MB.
 * @returns 
 */
export function useBeforeUploadImageChecker(limitSizeMB = 32) : (file: FileItem) => boolean {
  return (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) 
      message.error('请选择图片文件!');
    const isLt2M = file.size / 1024 / 1024 < limitSizeMB;
    if (!isLt2M) 
      message.error(`图片大小不能大于${limitSizeMB}MB!`);
    return isJpgOrPng && isLt2M;
  };
}

/**
 * 上传视频大小检查组合代码。
 * @param limitSizeMB 限制大小MB.
 * @returns 
 */
export function useBeforeUploadAudioChecker(limitSizeMB = 256) : (file: FileItem) => boolean {
  return (file) => {
    const isVideo = file.type.startsWith('audio/');
    if (!isVideo) 
      message.error('请选择音频文件!');
    const isLt2M = file.size / 1024 / 1024 < limitSizeMB;
    if (!isLt2M) 
      message.error(`音频大小不能大于${limitSizeMB}MB!`);
    return isVideo && isLt2M;
  };
}


/**
 * 上传视频大小检查组合代码。
 * @param limitSizeMB 限制大小MB.
 * @returns 
 */
export function useBeforeUploadVideoChecker(limitSizeMB = 4096) : (file: FileItem) => boolean {
  return (file) => {
    const isVideo = file.type.startsWith('video/');
    if (!isVideo) 
      message.error('请选择视频文件!');
    const isLt2M = file.size / 1024 / 1024 < limitSizeMB;
    if (!isLt2M) 
      message.error(`视频大小不能大于${limitSizeMB}MB!`);
    return isVideo && isLt2M;
  };
}

/**
 * 把字符串URL数组转为a-upload已上传的条目
 * @param arr URL数组
 */
export function stringUrlsToUploadedItems(arr: string[]) : FileItem[] {
  return arr.map((i, k) => {
    if (!i)
      return undefined;
    return {
      uid: k.toString(),
      name: i ? decodeURIComponent(StringUtils.path.getFileName(i)) : '',
      status: 'done',
      url: i,
      size: 0,
      type: '',
    }
  }).filter((i) => i !== undefined);
}