---
title: TypeScript 定义
---

在使用动态表单时，推荐通过 TypeScript 把表单结构、规则与组件参数都做强类型约束，这样可以在编码阶段就发现错误。

本文主要介绍两部分：

- 如何通过 `IDynamicFormOptions` 与 `defineDynamicFormOptions` 做表单配置的类型定义与检查；
- 如何通过扩展 `IDynamicFormWidgetPropsMap`，让 `formItems` 的 `additionalProps` 按 `type` 自动获得精确类型。

## 表单选项的类型定义与检查

`IDynamicFormOptions` 是动态表单的核心配置接口，其中主要泛型如下：

- `T`：`formItems` 的类型；
- `R`：`formRules` 的类型（默认来自 `IDynamicFormPropsMap['Rules']`）；
- `P`：`formAdditionaProps` 的类型（默认来自 `IDynamicFormPropsMap['Form']`）；
- `E`：`formAdditionalEvents` 的类型（默认为 `Record<string, Function>`）。

如果你希望 `formItems` 在定义时就得到更严格的字面量类型推导，建议使用 `defineDynamicFormOptions`：

```ts
import { defineDynamicFormOptions } from "@imengyu/vue-dynamic-form";

const formOptions = defineDynamicFormOptions({
  formItems: [
    {
      type: "base-text",
      name: "userName",
      label: "用户名",
      additionalProps: {
        placeholder: "请输入用户名",
      },
    },
  ],
  formRules: {
    userName: [{ required: true, message: "请输入用户名" }],
  },
});
```

这样写的好处是：

- `formItems` 中每一项会按 `type` 以及预定义好的组件参数类型参与联合类型推导；
- 拼写错误、字段类型不匹配能在编辑器里直接提示；
- 后续维护时，重构字段更安全。

例如：`base-select` 组件需要传入数组类型的 options ，传入字符串会触发 TypeScript 报错，可以快速排查出传参错误。

```ts
import { defineDynamicFormOptions } from "@imengyu/vue-dynamic-form";

const formOptions = defineDynamicFormOptions({
  formItems: [
    {
      type: "base-select",
      name: "city",
      label: "城市",
      additionalProps: {
        placeholder: "请选择城市",
        options: "北京,上海,广州", // [!code error]
      },
    },
  ],
});
```

## 自定义表单参数的类型约束

`IDynamicFormOptions` 允许你自定义这些参数类型：

- `formRules`（泛型 `R`）；
- `formAdditionaProps`（泛型 `P`）；
- `formAdditionalEvents`（泛型 `E`）。

例如你替换了内置 Form 组件，希望限制表单附加属性与事件：

```ts
import type { IDynamicFormOptions } from "@imengyu/vue-dynamic-form";

interface MyFormProps {
  layout?: "horizontal" | "vertical" | "inline";
  size?: "small" | "default" | "large";
}

interface MyFormEvents {
  onFinish?: () => void;
  onFinishFailed?: (error: unknown) => void;
}

type MyFormOptions = IDynamicFormOptions<
  undefined,
  Record<string, unknown>,
  MyFormProps,
  MyFormEvents
>;
```

在实际项目里，更常见的是继续使用默认 `Rules`，只覆盖 `P` 和 `E`。核心思路是：把你真实使用的 Form 组件（例如AntDeignVue, Element）属性/事件类型映射到 `IDynamicFormOptions` 泛型里。

## 扩展 `IDynamicFormWidgetPropsMap` 实现表单项类型检查

`IDynamicFormWidgetPropsMap` 定义了 “表单项 `type` -> `additionalProps` 类型” 的映射关系。  
内置类型（如 `base-text`、`base-select` 等）已经默认声明好，你可以通过 TypeScript 的接口合并机制扩展自己的组件类型。

示例：增加一个自定义组件 `my-rate` 并且增加类型约束。

```ts
// src/types/dynamic-form.d.ts
import "@imengyu/vue-dynamic-form";

interface MyRateProps {
  max?: number;
  allowHalf?: boolean;
}

declare module "@imengyu/vue-dynamic-form" {
  interface IDynamicFormWidgetPropsMap {
    "my-rate": MyRateProps;
  }
}
```

扩展后，`formItems` 中使用 `type: "my-rate"` 时，`additionalProps` 就会自动变成 `MyRateProps`：

```ts
import { defineDynamicFormOptions } from "@imengyu/vue-dynamic-form";

const formOptions = defineDynamicFormOptions({
  formItems: [
    {
      type: "my-rate",
      name: "score",
      label: "评分",
      //此处 additionalProps 自动推导为 MyRateProps
      additionalProps: {
        max: 10,
        allowHalf: true,
      },
    },
  ],
});
```

如果传入未定义字段或错误类型，编辑器会直接报错，从而达到“配置即校验”的效果。

## 建议

- 优先使用 `defineDynamicFormOptions` 定义配置；
- 为项目中的自定义控件统一扩展 `IDynamicFormWidgetPropsMap`；
- 将类型扩展文件（如 `dynamic-form.d.ts`）放到项目的 `types` 目录，并确保 `tsconfig.json` 能包含到该声明文件。
