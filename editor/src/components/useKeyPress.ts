import { ref, onMounted, onUnmounted } from 'vue';

interface KeyState {
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
  [key: string]: boolean;
}

/**
 * 键盘按键监听组合式函数
 * 用于监测Ctrl、Alt、Shift、Meta等特殊按键的状态
 */
export function useKeyPress() {
  // 特殊按键状态
  const keyState = ref<KeyState>({
    ctrl: false,
    alt: false,
    shift: false,
    meta: false
  });

  // 按键按下处理函数
  const handleKeyDown = (event: KeyboardEvent) => {
    // 更新特殊按键状态
    keyState.value.ctrl = event.ctrlKey;
    keyState.value.alt = event.altKey;
    keyState.value.shift = event.shiftKey;
    keyState.value.meta = event.metaKey;
    
    // 记录其他按键状态
    keyState.value[event.key.toLowerCase()] = true;
  };

  // 按键释放处理函数
  const handleKeyUp = (event: KeyboardEvent) => {
    // 更新特殊按键状态
    keyState.value.ctrl = event.ctrlKey;
    keyState.value.alt = event.altKey;
    keyState.value.shift = event.shiftKey;
    keyState.value.meta = event.metaKey;
    
    // 清除已释放按键的状态
    keyState.value[event.key.toLowerCase()] = false;
  };

  // 检查按键组合是否被按下
  const isKeyCombinationActive = (...keys: string[]): boolean => {
    return keys.every(key => {
      const lowerKey = key.toLowerCase();
      // 处理特殊按键别名
      if (lowerKey === 'control') return keyState.value.ctrl;
      if (lowerKey === 'command') return keyState.value.meta;
      if (lowerKey === 'option') return keyState.value.alt;
      // 其他按键
      return keyState.value[lowerKey] || false;
    });
  };

  // 重置所有按键状态
  const resetKeyState = () => {
    keyState.value = {
      ctrl: false,
      alt: false,
      shift: false,
      meta: false
    };
  };

  // 组件挂载时添加事件监听
  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    // 当窗口失去焦点时重置按键状态
    window.addEventListener('blur', resetKeyState);
  });

  // 组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    window.removeEventListener('blur', resetKeyState);
  });

  return {
    keyState,
    isKeyCombinationActive,
    resetKeyState
  };
}