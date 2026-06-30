# 马鞍山阿拉丁财务咨询有限公司官网

独立静态官网项目，域名规划为 `aladincw.com`。

## 文件结构

- `index.html`：首页
- `about.html`：关于我们
- `services.html`：服务项目
- `cases.html`：成功案例
- `news.html`：新闻资讯
- `contact.html`：联系我们
- `en/`：英文版页面
- `assets/css/styles.css`：全站样式
- `assets/js/main.js`：移动导航、悬浮客服、表单交互
- `assets/img/hero-finance-office.png`：原创 Banner 图片
- `assets/img/wechat-qr.png`：微信客服二维码
- `robots.txt`、`sitemap.xml`：百度 SEO 基础文件
- `scripts/build-check.mjs`：静态站构建检查脚本

## 构建检查

```bash
npm run build
```

当前项目为静态官网，build 会检查 HTML 结构、资源引用、SEO 基础标签、H1 和 sitemap URL。

## Vercel 部署说明

该项目是纯静态企业官网，可以直接部署到 Vercel。

推荐设置：

- Framework Preset：Other
- Root Directory：项目根目录
- Build Command：`npm run build`
- Output Directory：留空或使用项目根目录
- Install Command：Vercel 默认即可

部署流程：

1. 登录 Vercel，选择 Add New Project。
2. 连接 GitHub 仓库 `sunxiaoru680-hue/aladincw-website`。
3. 保持分支为 `main`。
4. 按上方设置填写构建配置并点击 Deploy。
5. 部署成功后，在 Project Settings -> Domains 中添加 `aladincw.com`。
6. 按 Vercel 提示到域名 DNS 服务商处配置 A 记录或 CNAME。
7. 等待 DNS 生效后，确认 `https://aladincw.com` 可以访问。

## 后续上线前需要补充

1. 在页脚补充真实备案号。
2. 如已完成百度站长平台验证，将验证码填入中文首页 `baidu-site-verification` meta 标签。
