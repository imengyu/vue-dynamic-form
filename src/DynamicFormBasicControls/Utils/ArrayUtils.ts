
/**
 * 交换数组两个元素
 * @param {Array} arr 数组
 * @param {Number} index1 索引1
 * @param {Number} index2 索引2
 */
function swapItems(arr: Array<any>, index1: number, index2: number) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  /*
  let x = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = x;
  */
  return arr
}
/**
 * 指定数组索引位置元素向上移
 * @param {Array} arr 数组
 * @param {Number} index 索引
 */
function upData(arr: Array<any>, index: number) {
  if (arr.length > 1 && index !== 0)
    return swapItems(arr, index, index - 1)
}
/**
 * 指定数组索引位置元素向下移
 * @param {Array} arr 数组
 * @param {Number} index 索引
 */
function downData(arr: Array<any>, index: number) {
  if (arr.length > 1 && index !== (arr.length - 1))
    return swapItems(arr, index, index + 1)
}

export default {
  swapItems,
  upData,
  downData,
};
