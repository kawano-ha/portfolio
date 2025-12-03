```markdown
# 動きのあるポートフォリオ雛形

使い方
1. このファイル群をリポジトリのルートに配置（index.html, styles.css, script.js, projects.json）。
2. projects.json の meta と projects をあなたの内容に書き換える。
3. contact form の action を Formspree ID（または mailto）に変更する。
4. GitHub に push → Netlify / Vercel / GitHub Pages にデプロイ。

カスタマイズ案
- プロジェクト詳細を Markdown で管理したければ、script.js を修正して Markdown を fetch→marked.js などで変換してください（marked の導入が必要）。
- OGP 画像は head の meta og:image を差し替えてください。
- スタイルを変えたい場合は styles.css のカラーパレット部分（:root）を調整してください。

次のステップ（私ができること）
- あなたの名前・自己紹介・スキル・各プロジェクトの具体情報を教えていただければ、projects.json と index.html のテキストをこちらで編集して差し上げます。
- 「このデザインをそのまま Netlify にデプロイする手順」を画像付きで案内します。
```