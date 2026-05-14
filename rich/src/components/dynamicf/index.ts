import { markRaw } from "vue";
import { 
  DynamicFormItemRegistry,
} from "@imengyu/vue-dynamic-form";
import MapPointPicker from "./Map/MapPointPicker.vue";
import RichText from "./Editor/RichText.vue";
import Sign from "./Sign.vue";
import AddressSercher from "./Map/AddressSercher.vue";

export {
  Sign,
  MapPointPicker,
  RichText,
  AddressSercher,
}


export function registerAllFormComponents() {
  DynamicFormItemRegistry
    //Map
    .register('select-lonlat', markRaw(MapPointPicker), {}, 'modelValue')
    .register('address-searcher', markRaw(AddressSercher), {}, 'modelValue')
    //Editor
    .register('richtext', markRaw(RichText), {}, 'modelValue')
    .register('sign', markRaw(Sign), {}, 'modelValue')
}