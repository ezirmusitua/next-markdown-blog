---
title: '[译]在 Unity 中不应该做的事情：常见的错误'
date: '很久以前'
excerpt: '作者在这篇文章中提出了 40 个在使用 Unity 开发项目过程中常见的错误, 并为这些错误提供了一些解决方案, 同时提供了更多的资料以便读者能够更加深入'
cover_image: 'https://images.unsplash.com/photo-1570303345338-e1f0eddf4946?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3342&q=50'
---

原文: [What NOT to do in Unity: the most common mistakes to avoid](https://unity3d.com/how-to/unity-common-mistakes-to-avoid?utm_campaign=saas_global_nurture_2019-Paid-subs-CLC&utm_content=2019-CLC-programmer-common-mistakes-to-avoid-new&utm_medium=email&utm_source=Eloqua)

作者在这篇文章中提出了 40 个在使用 Unity 开发项目过程中常见的错误, 并为这些错误提供了一些解决方案, 同时提供了更多的资料以便读者能够更加深入

## 在 Unity 中不应该做的事情：常见的错误

这篇文章希望为开发者提供一个在整个开发过程中可以参考的指南。 本文的作者 Valentin Simonov 是一名专精于 Unity 领域的工程师, 通过遵守他所提出的这些建议能够帮助卡法这建立一个更加智能且高效的开发流程，提供一个更好且更高性能的产品。

### 阶段: 制定计划

制定计划是任何软件开发项目中最重要的部分，因为在制定计划所做出的决策很难在开发后期做出更改。

### 错误 1: 没有深入研究就贸然开始一个项目

在开始一个项目之前应该对功能的可行性进行研究, 确认希望实现的功能适用于所有的目标平台

### 错误 2: 没有提前指定项目的最小支持设备

提前制定项目的最小支持设备, 并将这些设备提供给开发和 QA 团队, 从而制定真是的性能和帧预算

### 错误 3: 没有提前设置帧和资源(Assets)预算

在开始之前, 确认下面的内容:

- 模型 - 目标设备最多能够渲染多少个顶点?
- 资源 - 模型和纹理应该有多详细?
- 脚本和渲染 - 你希望各分配多少帧给逻辑/渲染/特效/其他子系统?

更进一步：

[优化图形性能](https://docs.unity3d.com/Manual/OptimizingGraphicsPerformance.html)

[用于性能优化的角色建模](https://docs.unity3d.com/Manual/ModelingOptimizedCharacters.html)

### 错误 4: 没有提前划分好场景和预制件/所有人都在同一个场景中工作

对于不同的层级可以拆分为不同的场景

将单独的对象移动到预制件中并在单独的场景中编辑它们

在团队中使用主场景锁定机制。

### 错误 5: 缺乏资源处理的流水线计划

对资源处理的流水线计划: 根据美术人员对项目的规范来获取资源。

如果可能，在项目之初就让熟练的美术人员来定义如何处理资源

定义有关资源的格式和规格的明确说明

加入资源导入时间的测试项目

更进一步：

[美术 Assets 最佳实践指南](https://docs.unity3d.com/Manual/HOWTO-ArtAssetBestPracticeGuide.html)

![https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-Asset-importing.jpg](https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-Asset-importing.jpg)

### 错误 6: 没有建立高效的构建和 QA 流程

使用独立的 构建 机器，或者使用 Unity Teams 服务进行构建工作

在你的项目中, 确认对于下面的问题能给出合适的回答:

- 如何将功能发布到发布版本?
- 如何测试新版本?
- 是否有自动化测试?
- 是否记录了统计数据?

![https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-setup-Cloud-Build.jpg](https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-setup-Cloud-Build.jpg)

Unity设置云构建

### 错误 7: 基于原型而非从头开始一个项目

在完成原型并且立项之后，最好不要直接使用原型开始项目, 而应该从头开始项目, 这么做的原因如下:

- 在原型制作过程中做出的决策是为了更快地完成而非更好地完成
- 基于各种奇淫巧计来开发游戏对任何项目来说都不是一个好的开始。

![https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-best-practices-planning.jpg](https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-best-practices-planning.jpg)

### 阶段: 开发过程

开发过程中的错误以及所导致的错误会降低团队的开发速度并削弱最终产品的质量。

### 错误 7: 没有正确地设置版本控制系统

使用文本序列化(Unity中的默认选项)

设置内置的 YAML 合并工具, [在这里](https://docs.unity3d.com/Manual/SmartMerge.html) 查看有关 [SmartMerge](https://docs.unity3d.com/Manual/SmartMerge.html) 的更多信息

设置 commit 钩子, [在这里](https://github.com/3pjgames/unity-git-hooks) 查看更多内容

### 错误 8: 未使用缓存服务器

切换项目的目标平台会降低开发速度

确保在团队中使用了 [最新的开源缓存服务器](https://blogs.unity3d.com/2018/03/20/cache-server-6-0-release-and-retrospective-optimizing-import/)

### 错误 9: 将静态数据存储在 JSON 或 XML 文件中

读取和解析 JSON/XML 文件会造成如下弊端:

- 减慢加载速度
- 在解析过程中会产生无用的内容

对于内置的静态数据，应该结合自定义 Editor 选项和 [ScriptableObjects](https://docs.unity3d.com/Manual/class-ScriptableObject.html) 进行处理

### 错误 10: 项目中包含了未使用的资源, 插件重复的库

项目中未被使用的资源很有可能会被编译到游戏中。

随时删除那些没有被项目使用的资源, 如果正确的使用了版本管理系统, 在后续开发过程中也能够随时恢复这些资源

在从 Asset Store 中添加内容时最好检查一下导入了哪些相关资源: 你很有可能发现项目中有 5 个不同的用于处理 JSON 文件的库

移除早期原型中的过期资源和脚本

即使将旧的资源移动到 **已删除** 文件夹中, 这些资源依然有可能被编译到项目中去

### 错误 11: 没有自动化重复操作

对于每个重复性任务，都应该有一个脚本自动化执行它

确保在任何场景中游戏都可以 “Play” /交互

将构建过程完全自动化，以便使用 [云端构建方案](https://docs.unity3d.com/Manual/UnityCloudBuild.html) 或在本地环境实现一键构建。

### 错误 12: 仅在编辑器中对项目进行性能分析

**一定**要在目标设备上进行性能分析, 如果只在编辑器中进行性能分析，有可能无法发现实际的性能瓶颈

![https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-Profiler.jpg](https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-Profiler.jpg)

### 错误 13: 没有同时使用 Unity 内置的 以及 特定于平台的性能分析和调试工具

在项目应该同时使用 Unity 内置的 [Unity Profiler](https://docs.unity3d.com/Manual/Profiler.html), [Memory Profiler](https://docs.unity3d.com/Manual/ProfilerMemory.html) 和 [Frame Debugger](https://docs.unity3d.com/Manual/FrameDebugger.html) 和特定于平台的性能分析和调试工具(如: Xcode Instruments，Mali Graphics Debugger，Renderdoc 等)

更进一步：

[一般性能优化](https://unity3d.com/learn/tutorials/topics/performance-optimization)

[着色器性能分析和优化提示](https://unity3d.com/how-to/shader-profiling-and-optimization-tips)

![https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-frame-debugger-2.jpg](https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-frame-debugger-2.jpg)

### 错误 14: 过晚开始性能分析和优化

越晚进行性能分析，游戏的性能成本就越大, 因此应该尽早开始性能分析以便确认项目帧数/内存/磁盘大小是否满足预期

### 错误 15: 没有基于测试数据进行优化

优化**确实存在**的性能瓶颈

使用前面提到的工具(Unity 以及特定平台)收集正确的数据

### 错误 16: 没有掌握足够的目标平台的知识

确保对目标平台有足够的了解

桌面/移动/控制台平台的瓶颈类型截然不同

![https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-best-practices-development.jpg](https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-best-practices-development.jpg)

### 资源管理

资源(模型，纹理，声音)占据了游戏的大部分内容

只要项目中存在一个错误的网格(Mesh)就可能导致开发人员之前完成的所有优化都无效。

### 错误 17: 没有正确地设置 Sprite 图集

使用第三方工具(如 [Texture Packer](https://www.codeandweb.com/texturepacker) )在 Unity 中创建 Sprite 图集或将 Sprite 分组, 这样做能减少游戏中绘制(draw)方法的调用次数。

### 错误 18: 没有正确地设置纹理

确保知道如何在目标平台上正确地设置纹理:

- 平台支持什么压缩算法?
- 纹理需要使用 mipmap 技术吗?

使用自动化的方式(如 [AssetPostprocessor API](https://docs.unity3d.com/ScriptReference/AssetPostprocessor.html))为新纹理应用设置, [如此项目](https://github.com/MarkUnity/AssetAuditor) 中所展示的那样

防止美术人员提交设置错误的纹理

![https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-Asset-import-settings.jpg](https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-Asset-import-settings.jpg)

错误 19: 资源包中包含重复的纹理

在设置资源包构建系统的时候是很容易出错的, [从这里](https://unity3d.com/learn/tutorials/topics/best-practices/guide-assetbundles-and-resources) 获取更多信息

切记, 在资源包中包含重复的纹理会导致不好的结果

使用 [Asset Bundle 浏览器](https://docs.unity3d.com/Manual/AssetBundles-Browser.html) 跟踪依赖项。

![https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-best-practices-asset-settings.jpg](https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-best-practices-asset-settings.jpg)

### 阶段: 编码

在代码架构和开发中的不良实践和错误会降低生产效率。

### 错误 20: 代码高度抽象, 难以理解

一般来说, Abstract Enterprise 代码是不合理的, 因为它使得代码难以被理解, 同时运行速度较慢，并且使得 IL2CPP 必须生成更多的代码

### 错误 21: 没有为架构中的惯例提供定义或文档

对于实现相同的任务, 保证使用相同的写法, 例如:

- 配置文件的格式(文件, 属性, 资源)
- 事件(Unity 事件, C# 事件, SendMessage)

哪些 Manager 要处理哪些对象?

### 错误 22: 没有透彻地了解 Unity [帧循环](https://docs.unity3d.com/Manual/ExecutionOrder.html)

Awake，OnEnable，Update 和其他方法的调用时机

协程的更新时机

如何执行 FixedUpdate

### 错误 23: 脚本初始化逻辑依赖于 Unity 执行顺序

**它只是以这种方式工作**或滥用脚本执行顺序

### 错误 24: 编写脚本逻辑或动画时没有考虑帧率

将 Time.deltaTime 用于 FPS 独立脚本

更进一步:

[基于 Scriptable Objects 进行架构的 3 种很酷的方法](https://unity3d.com/how-to/architect-with-scriptable-objects)

[拥有更好的脚本体验](https://unity3d.com/how-to/better-scripting-experience)

![https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-best-practices-programming.jpg](https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-best-practices-programming.jpg)

### CPU 性能

高 CPU 使用率会导致游戏卡顿, 并会更快地耗尽电量。

![https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-CPU-Profiler.jpg](https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-CPU-Profiler.jpg)

### 错误 25: 在很多脚本中都使用了 Update 方法

从 原生 到 托管 的调用存在开销(更多内容请参阅 [这篇文章](https://blogs.unity3d.com/2015/12/23/1k-update-calls/))

使用自定义 Manager

### 错误 26: 所有继承自抽象类的自定义 Behaviors 都定义了 Update / Awake / Start 方法

这么做的后果是所有脚本都拥有 Update 方法, 会对 CPU 性能造成影响

### 错误 27: 所有的游戏系统都逐帧更新

定义游戏/内容中不同系统的更新频率, 例如:

- 移动物体
- AI 和路径查找
- 记录并保存游戏状态
- 其他复杂的系统

### 错误 28: 没有缓存那些经常需要被使用的数据和对象引用

缓存经常需要的数据:

- 反射
- Find 方法
- Camera.main
- GetComponent 方法

### 错误 29: 没有将那些经常被实例化的对象放进对象池中

- 实例化对象是很慢的
- 在游戏开始时就创建对象池
- 重用对象池中的对象而非创建新对象

### 错误 30: 每帧都分配内存

- 即使每帧只是进行了很小的内存分配，迟早也会导致 GC 峰值
- 尝试移除所有的需要内存分配的逻辑

### 错误 31: 使用内存分配 API 而非无需进行内存分配的方案

如 LINQ, 字符串连接, Unity API 返回的数组: Physics.RaycastAll，Mesh.vertices，GetComponents 等

更进一步：

[使用 C# 数据结构和 Unity API 进行优化工作](https://unity3d.com/how-to/work-optimally-with-unity-apis)

![https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-best-practices-CPU-performance.jpg](https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-best-practices-CPU-performance.jpg)

### GPU 性能

高 GPU 使用率会导致低帧率，更快地耗尽电池并且游戏/内容运行卡顿。

![https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-GPU-Profiler.jpg](https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-GPU-Profiler.jpg)

### 错误 32: 在移动平台项目中存在太多的过度绘制

移动平台的 GPU 每秒只能绘制特定数目的像素, 过度绘制是移动平台上最大的性能瓶颈之一

不要绘制不必要的透明图像, 使用更复杂的网格来裁剪完全透明的区域。

### 错误 33: 在移动平台使用了过于复杂的着色器

不要在移动平台上使用标准着色器, 应该创建自定义专用着色器

在低端设备中使用简化版本或关闭一些特效

### 错误 34: 在前向渲染使用了过多的动态光源

每个光源都会为所有被照亮的物体添加渲染通道。

### 错误 35: 项目中的错误设置会中断动态批处理

对象必须是“相似”的才能被动态批处理, 帧调试器中会显示某些对象未进行被批处理的原因。

### 错误 36: 没有正确地使用或设置 LOD

LOD 技术使得渲染更远对象时消耗更少的资源

更进一步：

[为什么你的绘制调用不是批处理的](https://blogs.unity3d.com/2017/04/03/how-to-see-why-your-draw-calls-are-not-batched-in-5-6/)

[移动端优化最佳实践](https://docs.unity3d.com/Manual/BestPracticeUnderstandingPerformanceInUnity.html)

![https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-best-practices-GPU-performance.jpg](https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-best-practices-GPU-performance.jpg)

### UI 性能

Unity UI 是一个非常友好的工具，但它很容易设置错误，因此导致消耗大量的 CPU 和 GPU 资源。

![https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-UI.jpg](https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-UI.jpg)

### 错误 37: 没有考虑不同的分辨率和宽高比

在具有不同分辨率和宽高比的设备上测试 UI

有时为不同的设备创建不同的 UI 屏幕会更好

### 错误 38: 所有可变元素位于同一个 Canvas 中

当元素改变时, Canvas 必须创建一个新的组合网格, 对于复杂的 Canvas，元素的改变可能会导致大量的消耗, 因此最好将可变元素移动到单独的 Canvas 中

### 错误 39: 没有优化 **打开** 新窗口这个操作

应该尽量减少创建新窗口/大块 UI 时导致的游戏延迟, 里如使用下面的方法:

- 简化 UI 窗口
- 拆分部分 UI
- 缓存窗口

### 错误 40: 在列表包含大量内容

对于列表, 动态重用列表项而非一次创建所有列表项是更好的选择

在列表中创建嵌套的 Canvas, 防止列表项变化导致列表重新渲染

使用开源实现吗, [例如](https://github.com/boonyifei/ScrollList)

更进一步:

[Unity UI 优化技巧](https://unity3d.com/how-to/unity-ui-optimization-tips)

![https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-best-practices-UI-performance.jpg](https://unity3d.com/profiles/unity3d/themes/unity/images/eloqua/article/Unity-best-practices-UI-performance.jpg)