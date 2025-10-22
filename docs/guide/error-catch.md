# 错误提示与处理

<script setup>
import BasicUseageDocErrorBasicObject from '../examples/BasicUseageDocErrorBasicObject.vue'
import BasicUseageDocErrorMissing from '../examples/BasicUseageDocErrorMissing.vue'
import BasicUseageDocErrorItems from '../examples/BasicUseageDocErrorItems.vue'

</script>

## 内置错误提示

表单设计了错误提示与处理机制，当表单数据出现异常时，会显示详细错误提示，包含键名等信息方便排查错误。

也可选择屏蔽数据错误，使用设定默认值继续编辑。

### 顶层对象错误

出现于顶层 DynamicForm 组件，当传入的 model 不是对象时，会显示警告提示。

此错误允许屏蔽，通过设置 `options.suppressRootError` 为 `true` 可以屏蔽此错误，这时表单会使用一个空对象作为模型。

<BasicUseageDocErrorBasicObject />

### 条目数据错误

出现于条目中，当输入了错误的数据时，会显示警告提示。

<BasicUseageDocErrorItems />

### 缺失组件错误

出现于条目中，当指定的组件类型不存在时，会显示警告提示。

<BasicUseageDocErrorMissing />

## 数据默认值

表单允许为每个条目设置默认值，当数据为空时，会使用默认值填充。但此操作仅用于最后兜底处理，正常数据初始化应该在外部完成。



