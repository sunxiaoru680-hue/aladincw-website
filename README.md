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

## 后续上线前需要补充

1. 在页脚补充真实备案号。
2. 如已完成百度站长平台验证，将验证码填入中文首页 `baidu-site-verification` meta 标签。
