# 抖音小程序外壳(web-view 嵌入互动文游)

这是一个最小的抖音小程序工程,作用只有一个:用 `web-view` 组件把已发布的互动文游网页嵌入抖音。

## 使用步骤

1. 在 [抖音开放平台](https://developer.open-douyin.com/) 注册**企业主体**小程序(web-view 不支持个人主体)。
2. 下载并安装「抖音开发者工具」,用本目录(`douyin-miniapp/`)新建/导入项目,填入你的 AppID。
3. 购买/准备一个你自己的域名,并在 Lovable 项目里绑定(设置 → Domains)。
   - `*.lovable.app` 平台域名**不能**用于 web-view 业务域名,因为无法在域名根目录放校验文件。
4. 在抖音小程序后台 → 开发 → 开发设置 → 业务域名,添加你的域名并按要求放置校验文件完成验证。
5. 把 `pages/index/index.ttml` 里的 `src` 改成你的域名地址。
6. 在开发者工具中预览、上传,然后到平台提审。
   - 内容类目建议选「文娱 → 小说阅读/互动阅读」,不要选游戏类目(游戏需要版号)。

## 文件说明

- `app.json` / `app.js` —— 小程序入口配置
- `project.config.json` —— 开发者工具工程配置(appid 需替换)
- `pages/index/` —— 唯一页面,仅含一个铺满全屏的 web-view

## 可选:抖音登录(tt.login)

如需让网页识别抖音用户身份,可在小程序页通过 `web-view` 的 `bindmessage`/URL 参数,
结合 `tt.login` 获取 code 后传给网页。需要时再接入。
