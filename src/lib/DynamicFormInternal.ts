export type IDynamicFormMessageCenterCallback = (messageName: string, data: unknown) => void;

export interface IDynamicFormMessageCenter {
  addInstance: (name: string, fn: IDynamicFormMessageCenterCallback) => void,
  removeInstance: (name: string) => void,
}