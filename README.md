# 習慣トラッカー

GitHubの草（コントリビューショングラフ）のようなデザインの習慣トラッカーアプリケーションです。瞑想、学習、運動の3つの習慣を毎日記録することができます。

## 機能

- GitHubの草に似たカレンダービュー
- 瞑想、学習、運動の3つの固定習慣
- 習慣の完了状況に応じて色が変わるカレンダーマス
- シンプルなチェックボックスでの習慣記録
- モバイル対応レスポンシブデザイン
- Firebase認証でユーザー管理
- Firestoreでデータ保存（オフラインでも使用可能）

## インストールと起動

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm start
```

## Firebase設定

1. Firebaseプロジェクトを作成する
2. Authentication (メール/パスワード認証とGoogleログイン) を有効にする
3. Firestoreデータベースを作成する
4. `.env.sample`ファイルを`.env`としてコピーし、Firebaseの設定情報を入力する
5. `src/firebase/config.js`内のFirebase設定を更新する

## プロジェクト構造

```
habit-tracker/
├── src/
│   ├── components/
│   │   ├── HabitContributionGraph.js  # 草グラフのカレンダー表示
│   │   ├── TodayCheckList.js          # 今日の習慣チェックリスト
│   │   └── Login.js                   # ログイン・登録画面
│   │
│   ├── firebase/
│   │   └── config.js                  # Firebase設定
│   │
│   ├── utils/
│   │   └── habitStorage.js            # データ保存ロジック
│   │
│   ├── App.js                         # メインアプリケーション
│   └── index.css                      # スタイリング
│
└── package.json                       # 依存関係
```

## 使い方

1. アプリを起動し、ログインまたは新規登録する
2. GitHubの草に似たカレンダーと今日の習慣チェックリストが表示される
3. 今日の習慣を完了したら、下部のチェックボックスにチェックを入れる
4. チェックを入れると即座にカレンダーの色が更新される
   - 0件完了：灰色
   - 瞑想のみ：薄紫色
   - 学習のみ：薄青色
   - 運動のみ：薄緑色
   - 瞑想+学習：濃い青色
   - 瞑想+運動：濃い赤色
   - 学習+運動：濃い緑色
   - 3つすべて完了：金色
5. 年の移動は上部の矢印ボタンで行える

## データの保存について

すべてのデータはFirebase Firestoreに保存されます。ログインしていない場合はブラウザのLocalStorageに保存され、ログイン時に自動的にFirestoreに同期されます。

## Netlifyへのデプロイ

1. GitHubリポジトリを作成し、コードをプッシュ
2. Netlifyにログイン
3. 「New site from Git」をクリック
4. GitHubリポジトリを選択
5. ビルド設定：
   - Build command: `npm run build`
   - Publish directory: `build`
6. 「Show advanced」をクリックして環境変数を追加（`.env`ファイルと同じ内容）
7. 「Deploy site」をクリック

## カスタマイズ方法

- **色の変更**: `index.css` 内の色コードを変更
- **習慣の変更**: `FIXED_HABITS` 配列を変更（`HabitContributionGraph.js` と `TodayCheckList.js` の両方）

## トラブルシューティング

- **ログインできない**: Firebase Authenticationの設定を確認してください
- **データが保存されない**: Firestoreのルールとアクセス権限を確認してください
- **デプロイ後に動作しない**: Netlifyの環境変数が正しく設定されているか確認してください

---

GitHubの草に似たシンプルなデザインの習慣トラッカーで、シンプルかつ効果的に習慣を継続するためのツールです。特に瞑想、学習、運動という知的・身体的習慣の継続をサポートします。
