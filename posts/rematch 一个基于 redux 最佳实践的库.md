---
title: 'rematch - 一个基于 redux 最佳实践的库'
date: '很久以前'
excerpt: '本文主要介绍了如何使用 rematch - 一个基于 redux 最佳实践的库. 并提供了一个基于 react 的可供参考的完整示例项目.'
cover_image: 'https://images.unsplash.com/photo-1601388152430-4ad0f14c0788?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80'
---

本文主要介绍了如何使用 rematch - 一个基于 redux 最佳实践的库. 并提供了一个基于 react 的可供参考的完整示例项目.

## rematch 是什么?

[rematch](https://github.com/rematch/rematch) 是一个旨在于减少实现 redux 代码痛苦的框架.

rematch 的官方定位是:

> Rematch is Redux best practices without the boilerplate. No more action types, action creators, switch statements or thunks.
> 

rematch 是通过遵循最佳实践对 redux 进行的二次封装, 通过使用 rematch, 开发者可以不用使用繁琐的方式编写 redux 代码, 这种编写方式不需要编写 `Action Types`, `Action Creators` 等步骤.

同时, rematch 还提供了 `Plugin` 系统以及变通的方式来实现框架无法直接提供的功能.

本文结合实例介绍了如何使用 rematch, 第一部分快速地展示了如何使用 Rematch; 然后对如何使用 rematch 进行了具体的介绍.

本文假设读者已经使用过一段时间的 redux, 因此不会涉及如何使用 redux 的内容.

关于本文使用的例子可以在[这里](https://github.com/ezirmusitua/try-and-practice/tree/master/node.rematch)找到, 这个例子是一个基于 react 实现的简单 todo 应用, 用户可以添加/完成 todo, 并且会对用户进行评分.

### 快速入门

下面的代码展示了 reamtch 基本的使用方法:

```jsx
import React from 'react'
import ReactDom from 'react-dom'
import {connect, Provider} from 'react-redux'
import {init} from '@rematch/core'

// Step1 - Define Model
const model = {
  state: 0, // initial state
  reducers: {
    // handle state changes with pure functions
    doSomething(state, payload) {
      return 'something'
    }
  },
  effects: {
    // handle state changes with impure functions.
    // use async/await for async actions
    async doSomethingAsync(payload, rootState) {
      return 'something'
    }
  }
};

// Step2 - init store
const options = {models}
const store = init(options)

// Step3 - use store in component
const mapState = (state) => ({prop1: state.state1})
const mapDispatch = (dispatch) => ({
  doSomething: dispatch.state1.doSomething(),
  doSomethingAsync: dispatch.state1.doSomethingAsync(),
})
const Component1 = connect(mapState, mapDispatch)(props => <div>{props.prop1}</div>)

const App = props => <Provider store={store}><Component1 /></Provider>

ReactDOM.render(<App/>, document.getElementById('root'));
```

rematch 的使用主要分为 3 个步骤:

1. 定义 Model - 即 Reducer
2. 初始化 Store - 即 createStore
3. 在组件中使用 Store - 即 connect

rematch 与传统的编写 redux 代码的不同之处主要体现在前两步上.

rematch 中的 Model 类似于编写传统的 redux reducer, 在 model 中可以定义 state, reducers(更改 model state 的方法), effects(model 与外部交互的方法, 一般用来处理异步方法).

rematch 的 `init` 方法可以看作是 `createStore`. 在 `init` 方法中可以为 store 配置插件或者自定义 Store 方法.

### 步骤1: 定义 Model

直接看代码:

```jsx
const model = {
  name: 'nameOfThisModel',
  // 相当于 reducer 的 initialState
  state: 'state',   
  // 用于更新 model state 的纯函数 
  reducers: {
    doSomething: (state, payload) => {
      // do something
      return state
    }
    // ...
  },
  // model 中与外部交互的代码(远程调用, 和其他 store 互动等), 一般是异步函数
  effects: {
    doSomethingWithEffect: (payload, rootState) => {
      // do something has side effect
    },
    async doSomethingWithEffectAsync: (payload, rootState) => {
      // do something has side effect async
    },
    // ...
  }
}
```

### 步骤 2: 初始化 store

先上例子:

```jsx
import {init} from '@rematch/core'
import models from './models'

export default init({
  name: 'nameOfStore',
  models,
  // rematch 插件
  plugin: [],
  // 自定义 store
  redux: {}
})
```

使用 rematch 时, 一般情况下我们只需要编写好 Model 并选择一些 Plugin 即可, 但是如果 rematch 提供的脚手架无法满足我们的需求的时候怎么办? 比如:

1. 为 store 添加自定义的 middleware
2. 为 store 添加自定义的 enhancer

这种时候我们就需要深入了解一下 rematch `init` 方法中的 `redux` 选项了.

```jsx
{
  redux: {
    // 直接在 store 中定义 initialState
    initialState?: any,
    // reducers 方法
    reducers: ModelReducers,
    // enhancers
    enhancers: Redux.StoreEnhancer<any>[],
    // middlwares
    middlewares: Middleware[],
    // 在 root reducer 设置钩子方法
    rootReducers?: RootReducers,
    // 自定义 combinedReducers 方法  
    combineReducers?: (reducers: Redux.ReducersMapObject) => Redux.Reducer<any, Action>,
    // 自定义 createStore 方法
    createStore?: Redux.StoreCreator,
    // devtools 设置  
    devtoolOptions?: DevtoolOptions,
  }
}
```

基本上, `init` 方法的 redux 选项提供了所有自定义 store 的方法.

`init` 的 redux 的所有选项的格式都与传统的创建 redux 的方法一致, 因此移植原有代码很方便.

除了 `redux` 选项外, 还需要注意的是 `plugins` 选项, 插件是 rematch 提供的一种便于复用代码的机制. 

rematch 官方也提供了一些常用的插件:

1. [Rematch Select](https://github.com/rematch/rematch/tree/master/plugins/select) - react-select 插件
2. [Rematch Loading](https://github.com/rematch/rematch/tree/master/plugins/loading) - 添加一个 loading model, 可以保存 effect 进行中的状态的插件
3. [Rematch Persist](https://github.com/rematch/rematch/tree/master/plugins/persist) - [Redux-Persist](https://github.com/rt2zz/redux-persist) 的插件
4. [Rematch Updated](https://github.com/rematch/rematch/tree/master/plugins/updated) - optimizing effects(debounce and throttle)
5. [React Navigation](https://github.com/rematch/rematch/tree/master/plugins/react-navigation) - [React Navigation](https://reactnavigation.org/) 的插件
6. [Rematch Immer](https://github.com/rematch/rematch/tree/master/plugins/immer) - [Immer](https://github.com/mweststrate/immer) 的插件
7. [Rematch typed-state](https://github.com/rematch/rematch/tree/master/plugins/typed-state) - 运行时类型检查的 state

除了使用官方提供的插件, 我们也可以自己创建插件, 自定义插件的过程并不算复杂, 编写自定义插件的框架代码如下:

```jsx
export createCustomizedPlugin(flexibleConfig) {
  const plugin = {
    config: {..., ...flexibleConfig},
    exposed: {
      // key-value pair that assigned the communicable plugin
    },
  }
  plugin.onModel = (model) => {
    // 当 model 被创建的时候被调用, model 参数中包含了被创建的 model 信息
    // 这个方法一般可以用于记录/包装 model 的 state 或者方法
  }

  plugin.middleware = (store) => {
    // (store: Model) => (next: Dispatch) => (action: Action): NextState, use to customize middleware
  }

  plugin.onStoreCreated = (store) => {
    // store 创建的时候调用
  }

  return plugin;
}
```

### 步骤 3: 在组件中使用

在组件中的使用基本上和一般的 redux 使用方法一致, 唯一不同的地方在于, `mapDispatchToProps` 的时候可以使用解构直接取得 reducer 的方法.

```jsx
import React from 'react'
import {connect} from 'react-redux'
import store from './store'  

const mapStateToProps = (state) => ({count: state.count})
// NOTE: can use dispatch with destructing
const mapDispatchWithDestructure = ({count: {increment}}) => ({increment})
const Counter = connect(mapState, mapDispatch)(props => <div>{props.count}</div>)

export default props=> <Provider store={store}>Counter</Provider>
```

### 总结

Rematch 这个库发展至今已经一年有余, 在某种程度上算是一个比较成熟的库了, github 的 star 也已经有了 4500 多个, 维护的也很频繁, 因此比较推荐使用.

除了写了一些玩具代码, 公司的项目也在使用, 总体用下来的感觉确实减少了书写 Redux 代码的痛苦.

要说遇到的坑也不是没有, `rematch` 搭配 `connected-react-router` 使用的时候就会遇到一些问题, 即使尝试使用 `init` 方法 的 redux 选项也没有解决.

关于提供的[示例项目](https://github.com/ezirmusitua/try-and-practice/tree/master/node.rematch), 基本涉及了文中所有提到的内容, 因此具体的代码可以直接看项目.

### 参考

- [Rematch Handbook](https://rematch.gitbook.io/handbook/)
- [react-redux tutorial](https://github.com/reduxjs/react-redux/blob/master/docs/introduction/basic-tutorial.md)