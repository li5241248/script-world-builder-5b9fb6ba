# 前端页面索引

每个路由文件顶部都加了 `// 页面:xxx  路由:/xxx` 注释,便于在 GitHub 上 ⌘F 检索。

| 路由 | 文件 | 场景 / 页面 |
| --- | --- | --- |
| `__root` | `__root.tsx` | 根布局(全局 Provider / HTML Shell) |
| `/` | `index.tsx` | 应用入口,重定向到 `/hub` |
| `/hub` | `hub.tsx` | 互动文游首页(底部 4 Tab:互动文游 / 我的创作 / 好友 / 我的) |
| `/workshop` | `workshop.tsx` | 互动文游创作工作台 — 上传/粘贴小说,启动 AI 改编 |
| `/adapt` | `adapt.tsx` | AI 改编进行中(人物 / 场景 / 章节拆解 Loading) |
| `/adapt-preview` | `adapt-preview.tsx` | AI 改编结果预览(章节 / 场景 / 角色卡确认) |
| `/huatangchun` | `huatangchun.tsx` | 《重生之贵女难求》文游主页(简介 / 角色 / 章节入口) |
| `/character/$id` | `character.$id.tsx` | 角色详情(角色卡 / 关系 / 选择此角色入梦) |
| `/confirm` | `confirm.tsx` | 开局确认(角色 / 模式 / 时长信息核对) |
| `/invite` | `invite.tsx` | 邀请好友入梦(微信 / 链接 / 二维码) |
| `/lobby` | `lobby.tsx` | 组队大厅 · 准备入梦(房主 · 角色分配 · AI 替补) |
| `/matching` | `matching.tsx` | 匹配中转场(寻找玩家 Loading) |
| `/scene` | `scene.tsx` | 剧情场景对话(AI 实时叙事 / 选择 / 输入行动) |
| `/play` | `play.tsx` | 游玩入口(Scene 的 PhoneMockup 容器) |
| `/play-ending` | `play-ending.tsx` | 真实结局页(从后端 GameResult 渲染) |
| `/ending` | `ending.tsx` | 结局页(本地预设结局展示) |
| `/report` | `report.tsx` | 战报 / 故事总结(高光语录 / 数据) |
| `/minigame` | `minigame.tsx` | 小游戏 1(剧情解谜 / 互动小关) |
| `/minigame2` | `minigame2.tsx` | 小游戏 2(嵌入 `public/minigame2.html`) |
| `/story-card-preview` | `story-card-preview.tsx` | 剧情卡片样式预览(弹窗 / 独立页) |

## 典型流程

1. `/hub` → 点「本周主打」→ `/huatangchun`
2. `/huatangchun` → 选角色 → `/character/$id` → `/confirm` → `/invite` → `/lobby` → `/matching` → `/play`(`/scene`)→ `/play-ending` / `/report`
3. 创作流:`/hub`(我的创作 Tab)→ `/workshop` → `/adapt` → `/adapt-preview` → `/huatangchun`
