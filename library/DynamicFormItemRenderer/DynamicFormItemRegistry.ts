
export interface DynamicFormItemRegistryItem {
  componentInstance: unknown;
  valueName: string;
  additionalProps: Record<string, unknown>;
}

export function makeWidget(componentInstance: unknown, additionalProps?: Record<string, unknown>, valueName?: string) : DynamicFormItemRegistryItem {
  return { componentInstance, additionalProps: additionalProps ?? {}, valueName: valueName || 'valueName' };
}

const DynamicFormItemRegistryData = new Map<string, DynamicFormItemRegistryItem>();

/**
 * 动态表单组件注册器。
 * 
 * 您可以在这里调用 register 注册自定义表单控件
 */
export const DynamicFormItemRegistry = {
  /**
   * 查找已注册的表单组件，如果未找到，则返回 null
   * @param type 唯一类型名称
   */
  findDynamicFormItemByType(type: string) : DynamicFormItemRegistryItem|null {
    return DynamicFormItemRegistryData.get(type) || null;
  },
  /**
   * 配置已注册的表单组件的附加属性
   * @param type 唯一类型名称
   * @param additionalProps 组件的附加属性，将会设置到渲染函数上
   */
  configItemAdditionalProps(type: string, additionalProps: Record<string, unknown>) {
    const item = DynamicFormItemRegistryData.get(type);
    if (!item) {
      console.warn('[DynamicFormItemRegistry] Can not config additional props for nonexistent type ' + type + ' .');
      return this;
    }
    item.additionalProps = { ...item.additionalProps, ...additionalProps };
    return this;
  },
  /**
   * 注册自定义表单控件
   * @param type 唯一类型名称
   * @param componentInstance 组件类
   * @param additionalProps 组件的附加属性，将会设置到渲染函数上
   * @param valueName 用于指定表单子组件的双向绑定值属性名称，默认是 value
   * @param override 是否覆盖已存在的类型，默认是 false
   */
  register(type: string, componentInstance: unknown, additionalProps: Record<string, unknown> = {}, valueName = 'value', override = false) {
    if (DynamicFormItemRegistryData.has(type) && !override) {
      console.warn('[DynamicFormItemRegistry] Type ' + type + ' already exists and cannot be registered twice.');
      return this;
    }
    DynamicFormItemRegistryData.set(type, { componentInstance, additionalProps, valueName });
    return this;
  },
  /**
   * 取消注册自定义表单控件
   * @param type 唯一类型名称
   */
  unregister(type: string) {
    if (!DynamicFormItemRegistryData.has(type)) {
      console.warn('[DynamicFormItemRegistry] Can not unregister nonexistent type ' + type + ' .');
      return this;
    }
    DynamicFormItemRegistryData.delete(type);
    return this;
  },
  /**
   * 清空所有已注册的自定义表单控件
   */
  clearAll() {
    DynamicFormItemRegistryData.clear();
    return this;
  }
};