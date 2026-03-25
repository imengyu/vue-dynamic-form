import { markRaw } from "vue";
import { 
  DynamicFormItemRegistry, 
  type IDynamicFormOptions, 
  configDefaultDynamicFormOptions 
} from "@imengyu/vue-dynamic-form";
import MapPointPicker from "./Map/MapPointPicker.vue";
import RichText from "./Editor/RichText.vue";
import Sign from "./Sign.vue";

export {
  Sign,
  MapPointPicker,
  RichText,
}


export function registerAllFormComponents() {
  DynamicFormItemRegistry
    //Map
    .register('select-lonlat', markRaw(MapPointPicker), {}, 'modelValue')
    //Editor
    .register('richtext', markRaw(RichText), {}, 'modelValue')
    .register('sign', markRaw(Sign), {}, 'modelValue')
}