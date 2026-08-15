# 马鞍山阿拉丁财务咨询有限公司官网

独立静态官网项目，域名规划为 `aladincw.cn`。

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
- Build Command：留空
- Output Directory：`.` 或留空
- Install Command：Vercel 默认即可

项目已提供 `vercel.json`，会覆盖 Vercel 面板里错误的 `public` 输出目录设置：

```json
{
  "buildCommand": null,
  "outputDirectory": "."
}
```

说明：本项目是静态 HTML 站点，`index.html` 位于项目根目录，不需要生成 `public`、`dist` 或 `.vercel/output` 目录。`npm run build` 仅作为本地检查命令使用，不作为 Vercel 发布构建步骤。

部署流程：

1. 登录 Vercel，选择 Add New Project。
2. 连接 GitHub 仓库 `sunxiaoru680-hue/aladincw-website`。
3. 保持分支为 `main`。
4. 按上方设置填写构建配置并点击 Deploy；如 Vercel 面板显示 Output Directory 为 `public`，请清空或改为 `.`。
5. 部署成功后，在 Project Settings -> Domains 中添加 `aladincw.cn`。
6. 按 Vercel 提示到域名 DNS 服务商处配置 A 记录或 CNAME。
7. 等待 DNS 生效后，确认 `https://aladincw.cn` 可以访问。

## GitHub 自动部署到阿里云宝塔

项目已提供 GitHub Actions 工作流：`.github/workflows/deploy-alicloud.yml`。

以后只要 `main` 分支有新提交，GitHub 会自动完成：

1. 拉取最新代码。
2. 运行 `npm run build` 检查网站。
3. 打包静态文件。
4. 通过 SSH 上传到阿里云服务器。
5. 解压到宝塔网站目录。

### GitHub Secrets 配置

在 GitHub 仓库进入 Settings -> Secrets and variables -> Actions -> New repository secret，添加：

- `ALIYUN_HOST`：阿里云服务器 IP，例如 `8.147.57.239`
- `ALIYUN_USER`：服务器登录用户，通常为 `root`
- `ALIYUN_SSH_KEY`：服务器 SSH 私钥内容
- `ALIYUN_PORT`：SSH 端口，默认可填 `22`
- `ALIYUN_TARGET_DIR`：宝塔网站目录，当前建议填 `/www/wwwroot/aladincw.cn`

配置完成后，后续更新网站只需要推送到 GitHub：

```bash
git push origin main
```

如果需要手动触发部署，也可以在 GitHub 仓库的 Actions 页面选择 `Deploy static site to Alibaba Cloud`，点击 `Run workflow`。

## 搜索引擎优化计划

当前中文站重点覆盖这些本地搜索词：

- 马鞍山财务公司
- 马鞍山代理记账、马鞍山代账公司、马鞍山代帐公司
- 马鞍山注册营业执照、马鞍山注册公司、马鞍山公司注册
- 马鞍山外贸公司代账、马鞍山外贸公司代帐
- 马鞍山出口退税

已建立独立 SEO 页面：

- `maanshan-finance-company.html`
- `maanshan-daili-jizhang.html`
- `maanshan-company-registration.html`
- `maanshan-foreign-trade-bookkeeping.html`
- `maanshan-export-tax-refund.html`

后续操作建议：

1. 在百度搜索资源平台添加 `aladincw.cn`，验证站点并提交 `https://aladincw.cn/sitemap.xml`。
2. 在 360 站长平台、搜狗站长平台、Bing Webmaster Tools、Google Search Console 提交 sitemap。
3. 备案号已更新为 皖ICP备2026026393号，后续需保持企业信息、电话和地址一致。
4. 完善百度地图、高德地图、腾讯地图、爱企查、天眼查、企查查等企业信息，名称、电话、地址要与官网一致。
5. 每周更新 2-3 篇马鞍山本地财税文章，标题围绕用户真实搜索问题，例如“马鞍山新公司注册后多久需要记账报税”。
6. 页面不要堆砌关键词，保持公司名称、电话、地址、服务范围清晰一致。

## 后续上线前需要补充

1. 备案号已补充：皖ICP备2026026393号。
2. 如已完成百度站长平台验证，将验证码填入中文首页 `baidu-site-verification` meta 标签。
