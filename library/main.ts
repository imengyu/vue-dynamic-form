export * from './DynamicForm'
export * from './DynamicFormBasicControls'
export * from './DynamicFormItemControls'
export * from './DynamicFormItemRenderer/DynamicFormItemRegistry'
export * from './DynamicFormItemEditor/DynamicFormItemEditor'
import type { App, Plugin } from 'vue'
import DynamicForm from './DynamicForm.vue'

export { DynamicForm };

const plugin : Plugin = {
  install: (app: App, ...options: any[]) => {
    app.component('DynamicForm', DynamicForm)
    return app
  }
}

export default plugin