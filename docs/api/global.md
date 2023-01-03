---
title: API 参考 - 全局函数
---

# API 参考 - 全局函数

## configDefaultDynamicFormOptions(options)

配置默认的动态表单属性，配置后将会对所有动态表单生效。

|参数|必填|类型|说明|
|--|--|--|--|
|options|是|[IDynamicFormOptions](./DynamicFormOptions.md)|参数|

## DynamicFormItemRegistry

用于管理注册动态表单的条目组件。

### DynamicFormItemRegistry.registerDynamicFormItemControl(type, componentInstance, additionalProps, valueName)

注册自定义表单控件

|参数|必填|类型|说明|
|--|--|--|--|
|type|是|string|唯一类型名称|
|componentInstance|是|unknown|组件类|
|additionalProps|是|`Record<string, unknown>`|组件的附加属性，将会设置到渲染函数上|
|valueName|是|string|用于指定表单子组件的双向绑定值属性名称，默认是 value, 当你的组件主 modelValue 名称不一致时，可以重新指定。|

### DynamicFormItemRegistry.unregisterDynamicFormItemControl(type)

取消注册自定义表单控件

|参数|必填|类型|说明|
|--|--|--|--|
|type|是|string|唯一类型名称|

### DynamicFormItemRegistry.findDynamicFormItemByType(type)

查找已注册的表单组件，如果未找到，则返回 null

|参数|必填|类型|说明|
|--|--|--|--|
|type|是|string|唯一类型名称|

返回值：表单组件信息

类型：DynamicFormItemRegistryItem

## DynamicFormItemRegistryItem

|参数|类型|说明|
|--|--|--|
|componentInstance|unknown|组件的类实例|
|valueName|string|组件的双向绑定属性名称|
|additionalProps|object|组件的默认值|
