---
title: 内置组件参考
---

# 内置组件参考

## Row

栅格布局行组件。

### Props

| 属性 | 描述 | 类型 | 默认值 |
| :----: | :----: | :----: | :----: |
| gutter | 列元素之间的间距（单位为 px） | `number` | 0 |
| justify | 主轴对齐方式，可选值为 'flex-start' , 'flex-end' , 'center' , 'space-between' , 'space-around' , 'space-evenly' | `string` | — |
| gutter | 交叉轴对齐方式，可选值为 "center" , "flex-start" , "flex-end" , "stretch" , "baseline" | `number` | — |
| wrap | 是否自动换行 | `boolean` | true |

## Col

栅格布局列组件。

### Props

| 属性 | 描述 | 类型 | 默认值 |
| :----: | :----: | :----: | :----: |
| offset | 列元素偏移距离 | `number` | 0 |
| span | 列元素宽度 | `number` | 0 |
