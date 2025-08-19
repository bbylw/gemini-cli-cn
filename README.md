# Gemini-CLI 终极使用教程网站

这是一个基于 `gemini.md` 文档创建的纯静态网站，展示了 Gemini-CLI 的完整使用教程。网站采用 VSCode 暗黑主题设计，内容丰富完整，方便部署到各种静态网站托管平台。

## 项目结构

```
.
├── index.html          # 网站主页
├── tutorial.html       # 教程内容页面
├── css/
│   └── style.css       # VSCode 暗黑主题样式文件
├── js/
│   └── script.js       # 交互脚本
├── gemini.md           # 原始教程文档
└── README.md           # 本文件
```

## 本地预览

要本地预览网站，您可以使用任何静态文件服务器。以下是几种常见的方法：

### 使用 Python (需要安装 Python)

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

然后在浏览器中访问 `http://localhost:8000`。

### 使用 Node.js (需要安装 Node.js)

如果您已安装 Node.js，可以使用 `npx` 和 `serve` 包：

```bash
npx serve
```

它会自动在可用端口启动服务器并提供链接。

## 部署到 GitHub Pages

1. 将此项目仓库推送到您的 GitHub 账户。
2. 在 GitHub 仓库页面，点击 "Settings" 选项卡。
3. 向下滚动到 "Pages" 部分。
4. 在 "Source" 下拉菜单中，选择 "GitHub Actions" 或 "Deploy from a branch"。
    - **如果选择 "Deploy from a branch"**:
        - 选择源分支（通常是 `main` 或 `master`）。
        - 选择根目录 `/ (root)` 作为文件夹。
        - 点击 "Save"。
5. 等待几分钟，GitHub Actions 会自动构建和部署您的网站。
6. 部署完成后，您将在 "Pages" 部分看到您的网站 URL，类似于 `https://<your-username>.github.io/<repository-name>/`。

## 部署到 Cloudflare Pages

1. 登录您的 Cloudflare 账户。
2. 导航到 "Workers & Pages"。
3. 点击 "Create application"。
4. 选择 "Pages"。
5. 连接到您的 Git 提供商（如 GitHub）并选择此仓库。
6. 配置构建设置：
    - **Build command**: (留空，因为这是纯静态网站)
    - **Build output directory**: (留空或设置为 `/`)
7. 点击 "Save and Deploy"。
8. Cloudflare 将自动构建和部署您的网站。
9. 部署完成后，您将获得一个 `.pages.dev` 子域名 URL。

## 部署到其他平台

由于这是一个纯静态网站，它可以轻松部署到任何支持静态文件托管的服务，例如：

- Netlify
- Vercel
- AWS S3 + CloudFront
- Google Cloud Storage + Cloud CDN

请参考相应平台的文档进行部署。

## 许可证

本项目基于 `gemini.md` 文档创建，该文档的许可证适用于本项目内容。网站的代码（HTML, CSS, JavaScript）采用 MIT 许可证。