export * from './lib';
import Default from './lib';
export default Default;
import type { MapPointPickerProps } from "./lib/components/dynamicf/Map/MapPointPicker.vue";
import type { RichTextProps } from "./lib/components/dynamicf/Editor/RichText.vue";
import type { SignProps } from "./lib/components/dynamicf/Sign.vue";

declare module '@imengyu/vue-dynamic-form' {
  export interface IDynamicFormWidgetPropsMap {
    'select-lonlat': MapPointPickerProps;
    'richtext': RichTextProps;
    'sign': SignProps;
  };
}