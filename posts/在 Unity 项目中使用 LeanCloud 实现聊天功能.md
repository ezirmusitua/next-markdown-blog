---
title: '在 Unity 项目中使用 LeanCloud 实现聊天功能'
date: '很久以前'
excerpt: '本文主要介绍了如何在 Unity 项目中配置并使用 LeanCloud Realtime 实现简单的聊天功能, 基本内容包括 LeanCloud SDK 的配置, LeanCloud Realtime API 的使用并附带简单 Demo.'
cover_image: 'https://images.unsplash.com/photo-1570303345338-e1f0eddf4946?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3342&q=50'
---

本文主要介绍了如何在 Unity 项目中配置并使用 LeanCloud Realtime 实现简单的聊天功能, 基本内容包括 LeanCloud SDK 的配置, LeanCloud Realtime API 的使用并附带简单 Demo.

# 在 Unity 项目中使用 LeanCloud 实现聊天功能

在 Unity 中实现聊天功能有很多中方法, 比如自己编写基于 Socket 通讯的代码, 又或者使用第三方提供的服务

如果自己实现的话, 需要分别编写 Server 和 Client 端代码, 还需要考虑 Server 的部署和配置问题, 在如今第三方服务非常成熟的情况下, 没有必要花费大量的时间和精力自己去做这件事

在 Unity 中有许多框架都提供了聊天服务的接入, 比如 [Photon Chat](https://doc.photonengine.com/en-us/chat/current/getting-started/chat-intro), 又或者使用 LeanCloud 提供的 Realtime 服务

二者的使用都非常简单, 但是相较于 Photon Chat, LeanCloud 包含有国内和海外节点, 对于国内用户来说更加友好, 因此国内用户更加推荐使用 LeanCloud

在 [Demo](https://github.com/ezirmusitua/try-and-practice/tree/master/unity.leancloud_realtime) 项目中实现了一个简单的聊天功能实现, 包含有单聊和群聊

## 创建 LeanCloud 账户并及开发版 APP

首先进入 [LeanCloud(国内)](https://leancloud.cn/dashboard/login.html#/signin) 或 [LeanCloud(海外)](https://console.leancloud.app/login.html#/signin) 创建一个账号并登录

账号创建完成之后, 在控制台中创建一个**开发版**的应用, 要注意的是, 如果选择**国内**的话, 还需要进行**实名认证**才能创建 APP

![https://i.loli.net/2019/07/14/5d2aa3b6e130447695.png](https://i.loli.net/2019/07/14/5d2aa3b6e130447695.png)

## 在 Unity 项目中引入 LeanCloud SDK

首先进入 [SDK 下载页面](https://releases.leanapp.cn/#/leancloud/realtime-SDK-dotNET/releases) 选择最新版本的 SDK 进行下载

下载完成之后, 解压下载下来的 zip 压缩包, 然后进入 `Demo<项目目录>/Assets` 下创建一个新的目录 `LeanCloud`, 将解压得到的文件复制到这个目录中去

![https://i.loli.net/2019/07/14/5d2aa5a48710941839.png](https://i.loli.net/2019/07/14/5d2aa5a48710941839.png)

![https://i.loli.net/2019/07/14/5d2aa5a47388a44371.png](https://i.loli.net/2019/07/14/5d2aa5a47388a44371.png)

## 在 Unity 项目中初始化 LeanCloud SDK

SDK 引入完成之后, 下一步要做的就是在 Unity 项目中初始化 LeanCloud Realtime

首先, 在 Unity Editor 中打开项目, 在 Scene 中创建一个 Empty 的 GameObject, 命名为 `LeanCloudService`

选中 LeanCloudService GameObject, 为其添加(并新建)一个名为 `LeanCloudService` 的 Script Component, 双击添加的 Script Component, 开始进行编辑

```csharp
// LeanCloudService.cs
using LeanCloud;
using LeanCloud.Realtime;
// 引入 LeanCloud SDK
using UnityEngine;

public class LeanCloudService : MonoBehaviour {
  [SerializeField] private string appId;    // LeanCloud AppId, 在控制台中获取
  [SerializeField] private string appKey;   // LeanCloud AppKey, 在控制台中获取
  [SerializeField] private string clientId; // Realtime 通讯中一个用户的标识, 一般为用户的 id

  private static LeanCloudService instance;
  private AVRealtime realtime;
  private AVIMClient client;
  private readonly Dictionary<string, List<AVIMTextMessage>> _convMessages = new Dictionary<string, List<AVIMTextMessage>>();

  public static LeanCloudService Instance => instance;

  void Start() {
    // Singleton
    instance = this;
    DontDestroyOnLoad(this);
    // IMPORTANT: LeanCloud 的存储 SDK 是必须要初始化的
    AVClient.Initialize(appId, appKey);
    // IMPORTANT: 初始化 LeanCloud Realtime
    realtime = new AVRealtime(appId, appKey);
    // OPTIONAL: 开启调试日志
    if (Debug.isDebugBuild) {
      AVClient.HttpLog(Debug.Log);
      AVRealtime.WebSocketLog(Debug.Log);
    }
  }
}
```

接下来, 打开 LeanCloud 控制台, 选择 App 并将 相关 AppId/AppKey 填写到 `LeanCloudService` 对象中去:

![https://i.loli.net/2019/07/14/5d2ae37f8163b18510.png](https://i.loli.net/2019/07/14/5d2ae37f8163b18510.png)

![https://i.loli.net/2019/07/15/5d2bc45bac88685136.png](https://i.loli.net/2019/07/15/5d2bc45bac88685136.png)

此时运行项目, 应该会看到 LeanCloud 的 Debug 代码

## 使用 LeanCloud Realtime 实现在线聊天

使用 LeanCloud Realtime 进行聊天的基本步骤如下:

1. 创建 AVIMClient 并登录
2. 创建 Conversation
3. 发送消息
4. 接收消息

### 创建 AVIMClient 并登录

在 `LeanCloudService` 中添加一个 Login 方法:

```csharp
public async Task Login() {
  // IMPORTANT: 为用户创建一个 Client, 发送消息, 接收消息都是基于这个 Client 的
  client = await realtime.CreateClientAsync(clientId);
  Debug.Log("Login Successful: " + client.ClientId);
}
```

一般情况下, AVIMClient 是一个全局唯一的实例, 消息的发送和接收都应该基于这个实例

创建 AVIMClient 实例需要使用一个`应用中唯一`的 ClientId 来表示 AVIMClient, 例如使用数据库中的 userId 来表示 ClientId

在 C#/Unity 中, 创建 AVIMClient 的同时默认就执行了登录操作, 因此登录的步骤可以免去

### 创建 Conversation

在 Client 创建完成之后, 我们可以创建一个 Conversation, Conversation 可以看作是聊天室的存在, 在同一个 Conversation 中的不同的 Client 可以彼此接收到消息

在 `LeanCloudService` 中添加一个 CreateConversation 的方法:

```csharp
public async Task<AVIMConversation> CreateConversation(List<string> members, string cname, bool isUnique) {
  return await client.CreateConversationAsync(
    members: members,
    name: cname,
    isUnique: isUnique
  );
}
```

这个方法只是简单的调用了 AVIMClient 的 CreateConversationAsync 方法, 通过这个方法能返回一个 AVIMConversation 对象, 针对这个 Conversation 的发送消息等操作都是基于这个 Conversation 进行的

`CreateConversationAsync` 接受三个参数:

1. `members` 可以看作是 Conversation 中成员的 ClientId 的 List(用户创建者默认为成员, 因此不需要添加, 使用空的 List 则代表创建一个只有自己的房间, 其他玩家可以受邀或主动加入)
2. `cname` 代表这个 Conversation 的名字
3. `isUnique` 表示这个是否唯一(**判断唯一的标准是 `members` 中的 ClientId 是否一致**)

### 发送消息

创建完成 Conversation 之后, 就可以简单的通过调用 `Conversation.SendMessageAsync` 发送消息, 在 LeanCloudService 中添加 `SendMessage` 方法

```csharp
public async Task SendMessage(AVIMConversation conv, string content) {
  // 新建消息
  var message = new AVIMTextMessage(content);
  // 发送消息
  await conv.SendMessageAsync(message);
  // 将发送的消息保存到 Conversation 对应的消息 List 中, 用以后续展示
  if (!_convMessages.ContainsKey(conv.ConversationId)) {
    _convMessages[conv.ConversationId] = new List<AVIMTextMessage>();
  }

  _convMessages[conv.ConversationId].Add(message);
}
```

这个方法接受一个 conv(client 要在哪个 Conversation 上发送消息) 和 content(要发送什么消息) 作为参数

这里只针对 Text 类型的消息进行演示, 如果需要发送更加复杂的消息类型, 可以看[这里](https://us-api.leancloud.cn/docs/realtime-guide-beginner.html#hash264600410)

### 接收消息

使用 LeanCloud Realtime SDK, 接收消息的本质实际上是监听 LeanCloud 服务器发送给 Client 的通知, 实现的方法就是为 Client 注册一个处理接收到新消息的回调事件

在 `LeanCloudService` 有 `Dictionary<string, List<AVITextMessage>> convMessages` 属性, 这个属性的目的就是保存不同 Conversation 的消息

接下来编写处理新消息的 `OnMessageReceived` 方法:

```csharp
private void OnMessageReceived(object sender, AVIMMessageEventArgs e) {
  // Client 接收到新消息的回调函数
  if (e.Message is AVIMTextMessage) {
    // 目前只考虑 Text 类型的消息
    var textMessage = (AVIMTextMessage) e.Message;
    // 将各个 Conversation 的消息分别存储
    if (!convMessages.ContainsKey(textMessage.ConversationId)) {
      convMessages[textMessage.ConversationId] = new List<AVIMTextMessage>();
    }

    convMessages[textMessage.ConversationId].Add(textMessage);
  }
}
```

最后, 在 创建 AVIMClient 之后为 Client 注册回调函数(在 Login 函数中添加):

```csharp
public async Task Login() {
  // IMPORTANT: 为用户创建一个 Client, 发送消息, 接收消息都是基于这个 Client 的
  client = await realtime.CreateClientAsync(clientId);
  // IMPORTANT: 注册消息接收到的回调事件
  client.OnMessageReceived += OnMessageReceived;
}
```

至此 `LeanCloudService` 已经具备了进行简单单聊和群聊的基本方法, 接下来通过一个 Demo 来进行演示

## 一个简单的聊天 Demo

首先, 在 UI 中创建一个如下图所示的 UI 界面

![https://i.loli.net/2019/07/14/5d2ac4aab9fe917759.png](https://i.loli.net/2019/07/14/5d2ac4aab9fe917759.png)

之后, 创建一个简单的 Message Item Prefab, 如下图所示

![https://i.loli.net/2019/07/14/5d2ae2ce6627d51132.png](https://i.loli.net/2019/07/14/5d2ae2ce6627d51132.png)

选中 Conversation 对象, 为其添加(并创建)一个 名为 `Conversation` 的 Script Component

在 `Conversation.cs` 中添加如下代码:

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using LeanCloud.Realtime;
using UnityEngine;
using UnityEngine.UI;

public class Conversation : MonoBehaviour {
  // Start is called before the first frame update
  public Button loginBtn;
  public Button sendButton;
  public GameObject conversationGo;
  public GameObject messageItem;
  public InputField contentInput;
  public Transform messagesAnchor;
  private AVIMConversation _conv;
  private bool _sending;
  private int _loadedCount;

  void Start() {
    // 绑定按钮
    loginBtn.onClick.AddListener(Login);
    sendButton.onClick.AddListener(SendMessage);
  }

  async void Login() {
    try {
      // 登录
      await LeanCloudService.Instance.Login();
      // 初始化 Conversation, 配合后端代码也可以做到加入已经存在的 Conversation
      _conv = await LeanCloudService.Instance.CreateConversation(
        new List<string> {"FooBar"},
        "Default Conversation",
        true
      );
      // 登录成功后显示对话框
      conversationGo.SetActive(true);
      loginBtn.gameObject.SetActive(false);
    }
    catch (Exception ex) {
      Debug.Log(ex.Message);
    }
  }

  async void SendMessage() {
    // 发送消息
    if (_conv == null) return;
    if (_sending) return;
    _sending = true;
    try {
      string content = contentInput.text;
      await LeanCloudService.Instance.SendMessage(_conv, content);
      // 清空输入框
      contentInput.Select();
      contentInput.text = "";
    }
    catch (Exception ex) {
      Debug.Log(ex.Message);
    }
    finally {
      _sending = false;
    }
  }

  void Update() {
    if (_conv == null) return;
    var messages = LeanCloudService.Instance.GetMessages(_conv);
    if (_loadedCount >= messages.Count) return;
    var skipCount = _loadedCount;
    _loadedCount = messages.Count;
    // 加载最新的消息
    messages.Skip(skipCount).ToList().ForEach(message => {
      var go = Instantiate(messageItem, messagesAnchor);
      go.GetComponentInChildren<Text>().text = $"{message.FromClientId}: {message.TextContent}";
      _loadedCount += 1;
    });
  }
}
```

`Conversation` 组件主要实现了 登录 AVIMClient, 发送消息, 绑定消息的功能

为了方便使用, 在 LeanCloudService 中添加了一个获取 Conversation Messages 的辅助函数

```csharp
public List<AVIMTextMessage> GetMessages(AVIMConversation conv) {
  Debug.Log("Contains Key: " + _convMessages.ContainsKey(conv.ConversationId) + " " + conv.ConversationId);
  if (!_convMessages.ContainsKey(conv.ConversationId)) return new List<AVIMTextMessage>();
  return _convMessages[conv.ConversationId];
}
```

接下来绑定 Conversation Component:

![https://i.loli.net/2019/07/14/5d2ae3296f00471640.png](https://i.loli.net/2019/07/14/5d2ae3296f00471640.png)

完成之后运行项目, 试着发个消息看看效果

![https://i.loli.net/2019/07/14/5d2ae4ecdbc0549758.png](https://i.loli.net/2019/07/14/5d2ae4ecdbc0549758.png)

如果要测试接收消息的话, 有两种方法:

1. 更改 ClientId 后 Build 一个 App 进行测试
2. 使用 [LeanCloud 控制台](https://leancloud.cn/dashboard/messaging.html) 发送消息进行测试

这里我们使用第二种方法:

![https://i.loli.net/2019/07/15/5d2bc6dec8b9461234.png](https://i.loli.net/2019/07/15/5d2bc6dec8b9461234.png)

发送者 ID 为 FooBar 是因为我们在 `Conversation` 中硬编码了这个 Conversation 的另一个成员为 FooBar

对话 ID 的获取, LeanCloud 控制台的**存储管理**中获取到:

![https://i.loli.net/2019/07/14/5d2ae5fe3929f85073.png](https://i.loli.net/2019/07/14/5d2ae5fe3929f85073.png)

发送之后的效果是:

![https://i.loli.net/2019/07/14/5d2ae72314ffc57651.png](https://i.loli.net/2019/07/14/5d2ae72314ffc57651.png)

## 参考资料

1. [LeanCloud SDK 接入指南](https://api.leancloud.cn/docs/start.html)
2. [一，从简单的单聊、群聊、收发图文消息开始](https://api.leancloud.cn/docs/realtime-guide-beginner.html)
3. [错误码详解](https://leancloud.cn/docs/error_code.html)