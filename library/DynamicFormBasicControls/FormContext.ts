import { type InjectionKey, inject, provide, type Ref } from "vue";
import type { ColProps } from "./Layout/Col.vue";

export type ValidTrigger = "blur" | "change" | "submit";

export type FormItemContext = {
  getFieldName: () => string,
  onFieldBlur: () => void;
  onFieldChange: (newValue: unknown) => void;
  clearValidate: () => void;
};
export type FormItemInternalContext = {
  rules: Ref<unknown|unknown[]>;
  getFieldName: () => string,
  getValidateTrigger: () => ValidTrigger;
  getUniqueId: () => string,
  setErrorState: (errorMessage: string|null) => void;
};

export type FormContext = {
  onFieldBlur: (item: FormItemInternalContext) => void;
  onFieldChange: (item: FormItemInternalContext, newValue: unknown) => void;
  clearValidate: (item: FormItemInternalContext) => void;
  addFormItemField: (item: FormItemInternalContext) => number;
  removeFormItemField: (item: FormItemInternalContext) => void;
  //form props
  validateTrigger: Ref<ValidTrigger>;
  hideRequiredMark: Ref<boolean>;
  colon: Ref<boolean>;
  labelWidth: Ref<string|number>;
  labelAlign: Ref<string>;
  labelCol: Ref<ColProps>;
  wrapperCol: Ref<ColProps>;
  showLabel: Ref<boolean>;
  name: Ref<string>;
  getItemValue: (item: FormItemInternalContext) => unknown;
  getItemRequieed: (item: FormItemInternalContext) => boolean;
};

export const FormItemContextContextKey: InjectionKey<FormItemContext> = Symbol('ContextProps');

export function useInjectFormItemContext() : FormItemContext {
  const context = inject<FormItemContext>(FormItemContextContextKey);
  provide(FormItemContextContextKey, {} as FormItemContext);
  return context as FormItemContext;
}
