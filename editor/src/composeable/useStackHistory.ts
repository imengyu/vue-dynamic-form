import { ObjectUtils } from "@imengyu/imengyu-utils";
import { computed, nextTick, ref } from "vue";

export function useStackHistory(onSetCurrentState: (state: object) => void, maxStep = 50) {
  const history = ref<object[]>([]);
  const currentIndex = ref(-1);
  let noStorage = false;

  function add(state: object) {
    if (noStorage) 
      return;
    noStorage = true;
    if (history.value.length >= maxStep) {
      history.value.shift();
      currentIndex.value--;
    }
    history.value.splice(currentIndex.value + 1);
    history.value.push(ObjectUtils.clone(state, { deepArray: true }));
    currentIndex.value++;
    nextTick(() => noStorage = false);
  }

  function setHistory(state: object) {
    noStorage = true;
    onSetCurrentState(ObjectUtils.clone(state, { deepArray: true }));
    nextTick(() => noStorage = false);
  }
  function back() {
    if (currentIndex.value <= 0) 
      return undefined;
    currentIndex.value--;
    setHistory(history.value[currentIndex.value]!);
  }
  function forward() {
    if (currentIndex.value >= history.value.length - 1) 
      return undefined;
    currentIndex.value++;
    setHistory(history.value[currentIndex.value]!);
  }

  const canBack = computed(() => currentIndex.value > 0);
  const canForward = computed(() => currentIndex.value < history.value.length - 1);

  return {
    history,
    currentIndex,
    add,
    back,
    forward,
    clear: () => {
      history.value = [];
      currentIndex.value = -1;
    },
    canBack,
    canForward,
  };
}