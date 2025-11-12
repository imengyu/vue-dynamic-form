import { RandomUtils } from "@imengyu/imengyu-utils";
import type { IDynamicFormItem } from "DynamicForm";
import type { Ref } from "vue";

export interface IDynamicFormEditorContext {
  currentFocusItem: Ref<IDynamicFormItem[]>,
  dropItem: (
    sourceItem: IDynamicFormItem, sourceParent?: IDynamicFormItem, 
    dropItem?: IDynamicFormItem, dropItemParent?: IDynamicFormItem,
    direction?: 'top' | 'bottom' | 'center',
    isNew?: boolean,
  ) => void,
  setCurrentFocusItem: (item: IDynamicFormItem) => void,
  switchVisible: (item: IDynamicFormItem, parent?: IDynamicFormItem) => void,
  copyItem: (item: IDynamicFormItem, parent?: IDynamicFormItem) => void,
  deleteItem: (item: IDynamicFormItem, parent?: IDynamicFormItem) => void,
}

const dropDataStorage: Map<string, any> = new Map();

export function storageDropData(item: any) {
  const key = RandomUtils.genNonDuplicateID(20);
  dropDataStorage.set(key, item);
  return key;
}
export function getStoragedDropData(key: string) {
  const dropData = dropDataStorage.get(key);
  if (dropData) {
    dropDataStorage.delete(key);
    return dropData;
  }
  return null;
}

export function getDropData(e: DragEvent) {
  const dragData = e.dataTransfer!.getData('text/plain');
  if (dragData) 
    return JSON.parse(dragData) as {
      type: string,
      data: unknown,
    };
  return null;
}