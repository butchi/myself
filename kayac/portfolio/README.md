# kayac/portfolio ビルドシステム

TypeScript ベースの Gulp v4 で、Pug, SCSS, TS をビルドします。BrowserSync によるローカルサーバとライブリロード対応。

## 使い方

- 依存インストール

```sh
npm install
```

- ビルド(単発)

```sh
npm run build
```

- 開発サーバ + 監視

```sh
npm run dev
```

- 生成物の削除（クリーン）

```sh
npm run clean
```

## 入出力

- 入力

  - Pug: `src/pug/index.pug` → `index.html`
  - SCSS: `src/scss/style.scss` → `css/style.css` (+ sourcemap)
  - TS: `src/js/main.ts` → `js/main.js` (+ sourcemap, esbuild bundle)

- 出力
  - ルート直下 `index.html`
  - `css/`, `js/` ディレクトリ

### 実行時の注意

コマンドは `kayac/portfolio` ディレクトリで実行してください。上位ディレクトリで `npx gulp` を実行すると、ローカル Gulp が見つからない旨のエラーになることがあります。
