---
title: 'Hyperledger Fabric 2.0 与 1.4 版本差异'
date: '很久以前'
excerpt: 'Hyperledger Fabric 2.0 与 1.4 版本之间的差异比较.'
cover_image: 'https://images.unsplash.com/photo-1601056639638-c53c50e13ead?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1335&q=80'
---

## 链码的安装和部署解耦

1.4 版本时, 链码的安装和初始化/升级过程是紧密相关的, 即初始化/升级链码时的名称和版本和打包/安装时指定的必须一致

在 2.0 版本中, 打包/安装时不再需要指定链码的名称和版本, 在执行初始化/升级操作时只需要指定 `package-id` 即可.

## 使用 tarball 格式打包链码

在 1.4 版本时, `peer chain package`或 `peer chaincode install` 会将链码打包成 `cds` 的格式, 因此打包之后的链码难以进行审查和调试.

在 2.0 版本中, `peer lifecycle chaincode package` 指令会使用 `tarball` 的格式对链码源码进行打包, 这使得审查和调试变得更加便利.

## 链码初始化/升级不再由特定组织实施

在 1.4 版本时, 链码的治理偏向于中心化, 链码**初始化和升级**由一个**特定**的组织配置并发起, **其他组织**对于智能合约初始化和升级时的参数配置需要在线下与该组织进行协商, 否则只能通过**不安装**链码的方式避免参与链码的执行与背书.

在 2.0 版本中, 链码的治理偏向于分布式, 链码**初始化和升级**需要通道内大多数组织的参与才能完成, 具体来说就是:

1. 某个组织执行 `peer lifecycle chaincode approveformyorg`, 此时合约并不会初始化/更新
2. 通道中的其他组织使用相同的参数执行 `peer lifecycle chaincode  approveformyorg`
3. 通道中的某个组织执行 `peer lifecycle chaincode checkcommitreadiness` 确认是否可以提交初始化/升级
4. 通道中的某个组织执行 `peer lifecycle chaincode commit` 提交初始化/更新操作

需要注意的是, 链码初始化/升级时的参数确定和传递依然需要以线下的方式进行, 但与 1.4 版本中不同的是, 因为链码在满足通道背书策略之前并没有被初始化/更新, 因此通道内的各个组织的链码总是保持一致的.

## 链码背书策略/私有数据集定义的更新不再需要重新安装

在 1.4 版本时, 因为更新链码背书策略/私有数据集定义意味着需要更新链码版本, 因此即使链码源码没有更新, 也需要重新执行安装操作.

在 2.0 版本中, 得益于**链码的安装和部署解耦**, 对于更新链码的背书策略/私有数据集定义我们可以使用已安装的链码而不用重新安装, 只需要在升级中指定新的背书策略/私有数据定义即可. 

## 通道相同定义的链码不再要求使用相同的源文件

在 1.4 版本中, 安装/更新链码要求在各个组织的 peer 节点的链码必须时相同的(打包之后的 cds 文件 hash 值相同), 之所以这么做的原因是为了各个 peer 节点执行链码调用后总是能产生相同的读写集, 

在 2.0 中取消了这一限制, 通道中的各个组织针对约定好的链码参数, 各自能够使用不同的实现方法, 只要各组织 peer 节点调用链码能够产生相同的读写集即可. 通过移除了通道内各组织 peer 节点必须使用相同链码的限制后, 赋予了通道内组织更大的灵活性, 每个组织的链码可以针对各自个性化的需求增加不同的功能, 只要能够保证链码最终执行产生的读写集是一致的即可.

## 通道中的每个组织默认拥有一个私有数据集

在 1.4 版本时, 如果希望使用私有数据集, 则必须在初始化/更新链码时指定私有数据集的定义文件. 

在 2.0 版本中, 通道中的每个成员默认拥有一个以 `_implicit_org_<MSPID>` 为名称的私有数据集.

## 更加灵活的私有数据集定义

在 2.0 版本中, 私有数据集定义中增加了两个配置选项: `memberOnlyWrite` 和 `endorsementPolicy` .

通过指定 `memberOnlyWrite` 为 `true` 或 `false`, 能够实现是否只允许 `policy` 中定义的组织对私有数据集进行写入. 

如果指定了 `endorsementPolicy` , 会覆盖通道/私有数据集定义中的 `policy` .

增加了 `memberOnlyWrite` 和 `endorsmentPolicy`选项后, 私有数据集的使用变得更加灵活, 例如针对组织 A 自有的私有数据集, 将其 `memberOnlyWirte` 设置为 `false`, `memberOnlyRead` 设置为 `true` , 则通道中的组织 B 可以将它的某些私有数据**分享**到组织 A 的私有数据集而无法取得组织 A 私有数据集中的其他数据. 同样的, 组织 A 在自己的私有数据集中得到特定的数据后可以使用 `GetPrivateDataHash` 方法进行验证, 但同样无法看到组织 B 私有数据集中的其他内容.

## 支持使用自定义的方式编译和部署链码

在 1.4 版本中, 链码的编译和部署是通过 peer 节点中硬编码的逻辑进行的, peer 节点会根据链码的语言使用内置的编译逻辑对链码进行编译, 然后基于 `Docker In Docker` 的方式为链码创建一个供后续调用的 Docker 容器.

在 2.0 版本中, 链码的编译和部署过程引入了 heroku 中 `buildpacks` 的概念, 通过使用新的编译和部署方式使得链码的编译和部署过程更加灵活, 为使用者带来了更多的可能性, 例如, 使用者可以直接使用编译好的二进制文件作为链码被调用, 又或者可以将链码作为一个常驻服务进行调用. 最后, 在 1.4 版本中基于容器的编译和部署方式在 2.0 中依旧可以使用.

具体来说, 2.0 中将链码的编译和部署抽象为了 4 个阶段, 这 4 个阶段的分工如下:

1. bin/detect - 决定使用什么方式编译链码
2. bin/build - 编译链码的逻辑
3. bin/release - 可选过程, 为 peer 节点提供关于链码的信息
4. bin/run - 运行链码

## 为 Couchdb 增加了缓存

为 Couchdb 增加了缓存, 加快了背书和验证过程的速度.

## 基于 Alpine 的 Docker 镜像

使用 Alpine 作为 Docker 组件的基础系统, 减少了组件镜像的大小, 加快了启动速度.

## 参考

[What's new in Hyperledger Fabric v2.0 - hyperledger-fabricdocs master documentation](https://hyperledger-fabric.readthedocs.io/en/release-2.0/whatsnew.html)

[peer chaincode - hyperledger-fabricdocs master documentation](https://hyperledger-fabric.readthedocs.io/en/release-1.4/commands/peerchaincode.html#peer-chaincode-package)

[peer lifecycle chaincode - hyperledger-fabricdocs master documentation](https://hyperledger-fabric.readthedocs.io/en/release-2.0/commands/peerlifecycle.html)

[Deploying a smart contract to a channel - hyperledger-fabricdocs master documentation](https://hyperledger-fabric.readthedocs.io/en/latest/deploy_chaincode.html)

[Private data - hyperledger-fabricdocs master documentation](https://hyperledger-fabric.readthedocs.io/en/release-2.0/private-data/private-data.html)

[Private Data - hyperledger-fabricdocs master documentation](https://hyperledger-fabric.readthedocs.io/en/release-2.0/private-data-arch.html)

[Class: ChaincodeStub](https://hyperledger.github.io/fabric-chaincode-node/release-1.4/api/fabric-shim.ChaincodeStub.html)

[Class: ChaincodeStub](https://hyperledger.github.io/fabric-chaincode-node/release-2.0/api/fabric-shim.ChaincodeStub.html#getPrivateData__anchor)

[External Builders and Launchers - hyperledger-fabricdocs master documentation](https://hyperledger-fabric.readthedocs.io/en/release-2.0/cc_launcher.html)

[Chaincode as an external service - hyperledger-fabricdocs master documentation](https://hyperledger-fabric.readthedocs.io/en/release-2.0/cc_service.html#writing-chaincode-to-run-as-an-external-service)