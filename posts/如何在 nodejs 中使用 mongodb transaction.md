---
title: '如何在 nodejs 中使用 mongodb transaction'
date: '很久以前'
excerpt: '本文主要介绍了为如何在 nodejs 应用中使用 mongodb transaction.'
cover_image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80'
---

本文主要介绍了为如何在 nodejs 应用中使用 mongodb transaction.

主要内容包括: 

1. 事务的简单介绍
2. 本地环境搭建 mongodb replica set
3. mongoose 中 transaction 的用法,
4. 测试 mongodb transaction 是否生效

因为 mongodb 在 4.0 版本之前只支持单文档事务, 因此当遇到某些需要使用多文档事务的情况时, 通常只能通过调整业务代码来实现.

在 4.0 版本发布之后, mongodb 原生支持了了单分片内的多文档事务, 某种程度上说, 这将大大简化开发者工作.

在介绍如何使用 mongodb transaction 之前, 首先简单地说明一下什么是数据库事务以及为什么要使用数据库事务.

## 数据库事务是什么?

数据库事务是数据库管理系统执行过程中的一个逻辑单位, 由一个有限的数据库操作序列构成.

数据库事务具有 ACID 特性, 具体来说指的是:

- 原子性(Atomicity): 事务作为一个整体被执行, 包含在其中的对数据库的操作要么全部被执行, 要么都不执行
- 一致性(Consistency): 事务应确保数据库的状态从一个一致状态转变为另一个一致状态. 一致状态的含义是数据库中的数据应满足完整性约束
- 隔离性(Isolation): 多个事务并发执行时, 一个事务的执行不应影响其他事务的执行
- 持久性(Durability): 已被提交的事务对数据库的修改应该永久保存在数据库中

## 为什么需要使用数据库事务?

通过使用数据库事务, 可以:

1.  为数据库操作序列提供了一个从失败中恢复到正常状态的方法, 同时提供了数据库即使在异常状态下仍能保持一致性的方法.
2.  当多个应用程序在并发访问数据库时, 可以在这些应用程序之间提供一个隔离方法, 以防止彼此的操作互相干扰.

下面介绍一下如何在 nodejs 中使用 mongodb transaction.

## 如何在本地环境下使用搭建 mongodb replica set

目前 mongodb transaction 只能在 replica set(副本集) 上使用, 因此对于本地开发环境来说, 需要额外的步骤才能使用 mongodb transaction.

为了能够在测试本地使用 mongodb transaction, 我们需要在本地构建一个 Replica Set, 常用的方法有两种:

1. 使用 [run-rs](https://thecodebarbarian.com/introducing-run-rs-zero-config-mongodb-runner.html)
2. 使用 [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server#replica-set-start)

下面以 windows 环境为例, 简单地介绍一下如何进行配置.

### 如何使用 run-rs ?

因为在这篇文章中我们将使用 mongodb-memory-server 进行测试, 因此有关 run-rs 的内容不会详细介绍, 有需要的可自行查找资料

.

下面简单的介绍一下 run-rs 的使用方法, 代码如下:

```bash
# 前往项目路径
cd path\to\project
# 安装 run-rs 依赖
npm install --save-dev run-rs # or yarn add -D run-rs
# 运行 run-rs
npx run-rs --mongod --number 3 --portStart 37017 --keep
```

上面的代码运行成功之后, 本地将会运行一个有 3 个节点的 mongodb replica set.

三个节点的端口分别为 37017-37019, 如果不指定端口参数(–portStart), run-rs 将默认将运行于 27017-27019 端口, 此时如果本地已经有 mongodb 在 27017 端口运行, run-rs 会因为端口冲突而无法成功启动.

参考[这里的参数列表](https://github.com/vkarpov15/run-rs/blob/master/src/options.js)可以进行更多的自定义配置.

### 如何使用 mongodb-memory-server ?

[mongodb-memory-sever](https://github.com/nodkz/mongodb-memory-server#replica-set-start) 是一个常用于测试的内存服务器, 它会在内存中运行一个真实的 mongodb, 同时还支持 replica set, 因此可以用于搭建一个支持 mongodb transaction 的本地数据库环境.

mongodb-memory-server 的用法很简单, 但是直接使用文档中的例子无法成功运行 replica set, 下面的代码修复了文档中例子存在的问题, 可以用于启动一个本地 replica set:

```jsx
const { MongoMemoryReplSet } = require("mongodb-memory-server");
const mongoose = require("mongoose");

function sleep(ts) {
  return new Promise((resolve) => setTimeout(() => resolve(), ts));
}

class DB {
  static set;
  static connection;
  // 连接到 replica set
  static async connect() {
    // 创建一个有三个节点的 replica set 实例
    DB.set = new MongoMemoryReplSet({
      instanceOpts: [
        { storageEngine: "wiredTiger" },
        { storageEngine: "wiredTiger" },
        { storageEngine: "wiredTiger" }
      ]
    });
    // 运行 replica set
    await DB.set.waitUntilRunning();
    const uri = `${await DB.set.getConnectionString()}?replicaSet=testset`;
    const dbName = await DB.set.getDbName();
    // NOTE: 为了确保本地 Replica set 确实运行了, 再等待一小会儿
    await sleep(3000);
    // 连接数据库
    DB.connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      // NOTE: 设置等待连接成功时间, 对于本地 Replica set 尽量设置得长一点
      connectTimeoutMS: 3000,
      keepAlive: 120
    });
  }

  static async clean() {
    // 为了方便测试, 用于清空数据库中的内容
    for (const model of Object.values(DB.connection.models)) {
      await model.deleteMany({});
    }
  }

  static async disconnect() {
    // 断开和数据库的连接并停止 replica set
    await DB.connection.disconnect();
    await DB.set.stop();
  }
}
```

`await sleep(3000)` 以及 `connectTimeoutMS` 用于确保 replica set 能够启动并且正常运行.

接下来, 用一个简单的测试来验证 replica set 正常运行并且可以使用 mongo transaction:

```jsx
const { DB } = require("./db");
const mongoose = require('mongoose');

async function testReplicaSet() {
  await DB.connect();
  const Model = mongoose.model("Demo", new mongoose.Schema({ success: Boolean }));
  await Model.createCollection();
  const mongoSession = await Model.startSession();
  await mongoSession.startTransaction();
  try {
    await Model.create([{ success: true }], { session: mongoSession });
    const doc = await Model.findOne({ success: true })
      .session(mongoSession)
      .exec();
      if (!doc) throw new Error("Create Error");
    await mongoSession.commitTransaction();
    console.info("Replica set run successfully and mongo transaction is work");
  } catch (err) {
    console.error(err);
    await mongoSession.abortTransaction();
  } finally {
    mongoSession.endSession();
    await DB.clean();
    await DB.disconnect();
  }
}

testReplicaSet();
```

运行测试代码, 如果输出结果中没有报错并且得到 **Replica set run successfully and mongo transaction is work** 则表示本地 replica set 运行成功.

需要注意的是, 在第一次运行时 mongodb-memory-server 需要花费一定的时间下载一个 mongodb 的可执行文件, 因此耗时会比较久.

现在本地 replica set 已经搭建成功, 接下来介绍一下如何在 nodejs 使用 mongoose 中提供的 mongodb transaction APIs.

### 在 nodejs 中如何使用 mongoose 提供的 mongodb transaction

如果在 node 应用中使用 mongodb, 一般都会使用 mongoose 作为 ODM(Object Document Mapping).

mongoose 已经支持 mongodb transaction, 下面简单的列举了 mongoose 中 transaction 的用法:

### 创建, 开始, 提交, 撤销, 结束 Transaction

使用 mongodb transaction 的第一步就是创建 Session 并开始 Transaction.

基本的用法如下:

```jsx
const mongoose = require('mongoose');

try {
  // 创建一个 Session
  const mongoSession = await mongoose.startSession();
  // 开始一个 Transaction
  await mongoSession.startTransaction();
  // --- 业务代码 ---
  await mongoSession.commitTransaction();
} catch (err) {
  // --- 业务代码 ---
  // 撤销 Transaction, 回滚之前的操作
  if (err && err.errorLabels && err.errorLabels.find('TransientTransactionError')) {
    // -- 业务代码(重试) --
  } else {
    await mongoSession.abortTransaction();
  }
} finally {
  // 结束 Session
  mongoSession.endSession();
}
```

mongoose 还提供了一个辅助函数 `withTransaction`, 这个辅助函数包含了 startTransaction/commitTransaction/RETRY/abortTransaction/endSession 这些操作, 用法如下:

```jsx
const mongoose = require('mongoose');

const mongoSession = await mongoose.startSession();
mongoSession.withTransaction(async () => {
  // --- 业务代码 ---
});
```

### 在当前的 Transaction 上进行数据库操作

当开始了一个 mongodb transaction, 需要在已开始的 transaction 上进行 CRUD 操作.

在 mongoose 中, 有两种在当前 transaction 进行操作的方式:

一是将 session 作为 options 传入, 使用这种方式的数据库操作有:

- create
- insert/insertMany
- update/updateMany
- delete/deleteMany
- replaceOne

基本的形式为:

```jsx
// 使用 create 方法创建一个文档也需要传入数组
Model.create([{field: value}], {session: mongoSession});

Model.insert({field: value}, {session: mongoSession});
```

需要注意的是, 如果希望在当前 transaction 使用 create 方法进行创建, **即使创建单个文档也需要传入一个数组**.

另一种就是将 session 作为链式调用的一环传入, 使用这种方式的数据库操作有:

- find/findOne/findById
- findOneAndUpdate/findOneAndDelete/findOneAndRemove/findByIdAndUpdate/findByIdAndDelete/findByIdAndRemove
- aggregate

基本形式为:

```jsx
Model.find({}).session(mongoSession).exec();
```

### 如何测试 mongodb transaction 是否生效 ?

下面通过一个简单的例子演示并测试 mongodb transaction 的使用.

假设有如下场景:

> 一个交易系统中有 Commodity 和 Order 表. Commodity 用于记录商品信息, Order 用于记录订单信息. 在某一时刻, Commodity 中的一件商品 吮指原味鸡 还剩 1 件库存. 此时用户 A 和 B 几乎在同一时刻下单购买 吮指原味鸡, 但是系统在处理用户 A 的订单时卡在了查询库存这一步骤, 用户 B 的订单则顺利完成. 对于这种情况, 正确的结果是用户 B 的订单成功生成, 用户 A 的订单没有生成.
> 

接下来展示的两段代码分别演示了使用和不使用 mongodb transaction 的处理方法.

### Case.1 不使用 mongodb transaction

第一种情况是在遇到库存问题时直接抛出异常, 如果库存正确订单会被正常创建.

```jsx
const mongoose = require("mongoose");
const { DB } = require("./db");
const { getCollection } = require("./collections");
const { sleep } = require("./utils");

async function createOrder(user, commodityId, blockts = 0) {
  const Commodity = await getCollection("Commodity");
  const Order = await getCollection("Order");
  let commodity = await Commodity.findOne({_id: commodityId, stock: {$gte: 1}})
    .lean().exec();
  if (!commodity) return;
  if (blockts) {
    await sleep(blockts);
  }
  const updated = await Commodity.findOneAndUpdate(
    {_id: commodityId, stock: {$gte: 1}},
    {$inc: {stock: -1}},
    {useFindAndModify: false}
  ).exec()
  if (!updated) return; // 应该直接 throw, 这里使用 return 只是为了方便测试
  const created = await Order.create({ user, commodityId });
  console.info(`Order Created For ${created.user}`);
}

async function main() {
  await DB.connect();
  const Commodity = await getCollection("Commodity");
  const Order = await getCollection("Order");
  try {
    let commodity = await Commodity.create({
      name: "吮指原味鸡",
      stock: 1
    });
    createOrder('A', commodity._id.toString(), 1000);
    createOrder('B', commodity._id.toString(), 0);
  } catch (err) {
    console.error("Exception: ", err);
  } finally {
    await sleep(2000);
    const currentCommodity = await Commodity.findOne().lean().exec();
    const orderCount = await Order.estimatedDocumentCount({}).exec();
    console.info(`Finally Commidity ${currentCommodity.name} Stock ${currentCommodity.stock}`);
    console.info(`Finally Order Count: ${orderCount}`);
    await DB.clean();
    await DB.disconnect();
  }
}

main();
```

运行上面这段代码应该得到的输出是:

```
Order Created For BFinally Commidity 吮指原味鸡 Stock 0Finally Order Count: 1
```

这里的关键步骤是使用 `findOneAndUpdate` 更新满足库存需求的商品, 如果没有更新就直接退出(和使用异常相似, 这里直接 return 只是为了测试方便).

### Case.2 使用 mongodb transaction

这里的代码逻辑和不使用 mongodb transaction 的情况基本一样, 只是将增加了 mongodb transaction 相关的代码, 以及将创建订单和更新库存放在了一个 `Promise.all` 里面来做.

```jsx
async function createOrder(user, commodityId, blockts = 0) {
  const Commodity = await getCollection("Commodity");
  const Order = await getCollection("Order");
  const mongoSession = await mongoose.startSession();
  await mongoSession.startTransaction();
  try {
    let commodity = await Commodity.findOne({_id: commodityId, stock: {$gte: 1}})
      .session(mongoSession).lean().exec();
    if (!commodity) throw new Error("Out Of Stock");
    if (blockts) {
      await sleep(blockts);
    }
    const [[created], updated] = await Promise.all([
      Order.create([{ user, commodityId }], {session: mongoSession}),
      await Commodity.findOneAndUpdate(
        {_id: commodityId, stock: {$gte: 1}},
        {$inc: {stock: -1}},
        {useFindAndModify: false}
      ).session(mongoSession).exec()
    ]);
    if (!updated) throw new Error("Out Of Stock");
    console.info(`Order Created For ${created.user}`);
    await mongoSession.commitTransaction();
  } catch {
    console.info(`Order Created For ${user} Aborted`);
    await mongoSession.abortTransaction();
  } finally {
    mongoSession.endSession();
  }
}
```

运行上面这段代码应该得到的输出应该是:

```bash
Order Created For B
Order Created For A Aborted
(node:20972) UnhandledPromiseRejectionWarning: MongoError: Transaction 2 has been aborted.
## error message
(node:20972) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
Finally Commidity 吮指原味鸡 Stock 0
Finally Order Count: 1
```

### 使用和不使用 mongodb transaction 的对比

上面两段代码的结果是一致的, 就是在库存充足的情况下才创建订单.

从代码量上看, 不使用 mongodb transaction 的情况更少, 但是从效率上看, 使用 mongodb transaction 后, 可以将更新库存和创建订单放在一个 `Promise.all` 来做, 这对提升效率还是有一定帮助的.

另外, 现实情况远远比假设的复杂, 当逻辑中涉及到更多的数据库表操作时, 如果全凭代码逻辑来保证数据的 ACID 特性, 那将会是非常巨大且复杂的工作, 但是如果使用了 mongodb transaction, 就能够大大减少工作量并提升代码效率.

因此, 对于简单的业务逻辑, 例如只涉及到一个或两个数据库表的操作时, 不使用 mongodb transaction 是完全没有问题的, 又或者某些业务逻辑对数据的 ACID 特性要求并不高, 那也没有必要使用 mongodb transaction.

但是, 如果业务逻辑要求操作必须具有 ACID 特性, 并且涉及到多个数据库表, 那用上 mongodb transaction 还是非常有必要的.

## 参考资料

1. [数据库事务](https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E5%BA%93%E4%BA%8B%E5%8A%A1)
2. [数据库事务的目的](https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E5%BA%93%E4%BA%8B%E5%8A%A1)
3. [数据库事务的 ACID 特性](https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E5%BA%93%E4%BA%8B%E5%8A%A1)
4. [认识 mongodb 4.0 新特性 - 事务](http://database.51cto.com/art/201811/586979.htm?mobile)
5. [mongoose documentation: transaction](https://mongoosejs.com/docs/transactions.html)