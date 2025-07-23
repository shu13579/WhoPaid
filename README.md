# WhoPaid - フーペイド

**誰からお金をもらったか忘れない！割り勘・立て替えの支払い管理アプリ**

[![GitHub](https://img.shields.io/github/stars/shu13579/WhoPaid?style=social)](https://github.com/shu13579/WhoPaid)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.4-black)](https://nextjs.org)

## 🎯 WhoPaidとは？

飲み会やパーティーで立て替えた後、**「誰からお金をもらったっけ？」**と困った経験はありませんか？

WhoPaidは、そんな支払い管理の悩みを解決するWebアプリです。

### 💡 解決する課題
- ✅ 飲み会で立て替えた後、誰からお金をもらったか忘れてしまう
- ✅ 参加者が多いと、誰が支払い済みで誰がまだかがわからない
- ✅ 後日お金を集める際に、誰に請求すべきかが曖昧
- ✅ 通常の割り勘アプリでは「誰から預かったか」がわからない

## 🚀 主な機能

### ✨ ワンクリック支払い記録
- 参加者リストから「支払い完了」ボタンを押すだけ
- 割り勘金額を自動計算して記録
- 面倒な金額入力や人選択は不要

### 📊 リアルタイム支払い状況
- 一目で誰が支払い済みかがわかる視覚的表示
- 支払い進捗率を瞬時に把握
- 未払い者を即座に特定

### 🎉 シンプルなイベント管理
- イベント作成から支払い完了まで3ステップ
- ダッシュボード形式で最新イベントを表示
- 完全CRUD操作（作成・編集・削除）

## 🎯 こんな方におすすめ

- 🍻 **飲み会の幹事や会計担当**の方
- 👥 **グループ旅行の立て替え管理**をする方
- 🎪 **イベント主催者**で参加費を集める方
- 💰 **お金の管理をきちんとしたい**方

## 🛠 技術スタック

### フロントエンド
- **Next.js 15.4** - Reactフレームワーク（App Router使用）
- **React 19.1** - UIライブラリ
- **TypeScript 5** - 型安全な開発
- **Tailwind CSS 4** - モダンなユーティリティファーストCSS
- **Lucide React** - 美しいアイコンライブラリ
- **React Hook Form** - フォーム管理
- **clsx & tailwind-merge** - 条件付きクラス名管理

### データ管理・状態
- **localStorage** - ブラウザローカルストレージ（データ永続化）
- **Custom Storage API** - タイプセーフなローカルストレージ操作
- **Client-side State Management** - Reactの状態管理

### 開発・品質管理
- **ESLint 9** - コード品質とスタイルガイド
- **Next.js ESLint Config** - Next.js特化設定
- **TypeScript Strict Mode** - 厳格な型チェック
- **PostCSS** - CSS処理

### デプロイ・インフラ
- **Vercel** - 本番環境デプロイとホスティング
- **Next.js Turbopack** - 高速開発サーバー
- **Static Site Generation (SSS)** - 静的サイト生成

## 🚀 セットアップ方法

### 必要な環境
- Node.js 18.0以上
- npm または yarn

### インストール手順

```bash
# リポジトリをクローン
git clone https://github.com/shu13579/WhoPaid.git
cd WhoPaid

# 依存関係をインストール
npm install

# 開発サーバーを起動（Turbopack使用で高速起動）
npm run dev

# または通常モードで起動
npm run dev -- --no-turbo
```

アプリケーションは `http://localhost:3000` でアクセスできます。

### 追加のコマンド

```bash
# 本番ビルド
npm run build

# 本番サーバー起動
npm run start

# コード品質チェック
npm run lint
```

### データの保存について

このアプリケーションはブラウザの **localStorage** を使用してデータを保存します。
- サーバーサイドのデータベースは使用しません
- データはブラウザローカルに保存されるため、プライバシーが保護されます
- 同じブラウザからアクセスすれば、データは永続化されます

## 📱 使い方

### 1. イベント作成
1. 「新しいイベント」をクリック
2. イベント名・総額・参加者名を入力
3. 「イベントを作成」で完了

### 2. 支払い記録
1. 参加者の「支払い完了」ボタンをクリック
2. 割り勘金額が自動で記録される
3. 支払い状況がリアルタイム更新

### 3. 支払い確認
- ✅ 緑色：支払い完了
- ❌ グレー：未払い
- 📊 進捗率で全体状況を把握

## 🔍 SEO・検索キーワード

**このアプリを探すときの検索例：**
- `割り勘 誰が払った アプリ`
- `飲み会 お金 回収 管理`
- `立て替え 支払い記録`
- `パーティー 会計 アプリ`
- `グループ 支払い管理`
- `WhoPaid フーペイド`

## 📈 開発ロードマップ

### ✅ 完了済み
- [x] 基本的なイベント作成・管理
- [x] ワンクリック支払い記録
- [x] 完全CRUD操作
- [x] レスポンシブUI

### 🚧 開発予定
- [ ] PWA対応（オフライン利用可能）
- [ ] データエクスポート機能（CSV、JSON）
- [ ] データインポート・バックアップ機能
- [ ] テーマ切り替え（ダーク/ライトモード）
- [ ] 多言語対応（英語、中国語）
- [ ] QRコード決済連携
- [ ] 支払い催促機能
- [ ] 統計・分析機能

## 🤝 コントリビューション

プルリクエストや Issues はいつでも歓迎です！

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 ライセンス

このプロジェクトは MIT License の下で公開されています。詳細は [LICENSE](LICENSE) ファイルをご覧ください。

## 🙋‍♂️ お問い合わせ

プロジェクトについてご質問がある場合：

- GitHub Issues: [https://github.com/shu13579/WhoPaid/issues](https://github.com/shu13579/WhoPaid/issues)
- 開発者: [@shu13579](https://github.com/shu13579)

---

**⭐ このプロジェクトが役に立った場合は、GitHubスターをいただけると嬉しいです！**