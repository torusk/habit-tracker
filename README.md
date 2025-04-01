# 習慣トラッカー

GitHubの草（コントリビューショングラフ）のようなデザインの習慣トラッカーアプリケーションです。瞑想と読書の2つの習慣を毎日記録することができます。

## 機能

- GitHubの草に似たカレンダービュー
- 瞑想と読書の2つの固定習慣
- 習慣の完了状況に応じて色が変わるカレンダーマス
- シンプルなチェックボックスでの習慣記録
- モバイル対応レスポンシブデザイン
- 簡易的なアクセス制限機能

## インストールと起動

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm start
```

## プロジェクト構造

```
habit-tracker/
├── src/
│   ├── components/
│   │   ├── HabitContributionGraph.js  # 草グラフのカレンダー表示
│   │   └── TodayCheckList.js          # 今日の習慣チェックリスト
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

1. アプリを起動すると、GitHubの草に似たカレンダーと今日の習慣チェックリストが表示されます
2. 今日の習慣を完了したら、下部のチェックボックスにチェックを入れます
3. チェックを入れると即座にカレンダーの色が更新されます
   - 0件完了：灰色
   - 1件完了：薄緑
   - 2件完了：濃緑
4. 月の移動は上部の矢印ボタンで行えます

## アクセス制限について

プライベートな習慣記録を保護するため、簡易的なアクセス制限機能を実装しています。

- デフォルトURL：誰でもアクセス可能
- 制限付きURL：`?key=秘密キー` パラメータ付きのURLのみアクセス可能

秘密キーは `App.js` 内の以下の行で変更できます：
```javascript
const hasAccess = !secretKey || secretKey === 'kazuki'; // 'kazuki'を任意の秘密キーに変更
```

## Netlifyへのデプロイ

1. GitHubリポジトリを作成し、コードをプッシュ
2. Netlifyにログイン
3. 「New site from Git」をクリック
4. GitHubリポジトリを選択
5. ビルド設定：
   - Build command: `npm run build`
   - Publish directory: `build`
6. 「Deploy site」をクリック

デプロイ後、アクセス制限を有効にする場合は、以下のURLでアクセス：
```
https://あなたのサイト名.netlify.app/?key=あなたの秘密キー
```

## データの保存について

全てのデータはブラウザのLocalStorageに保存されます。ブラウザのデータを消去すると記録も失われるため、定期的なバックアップをお勧めします。

## カスタマイズ方法

- **色の変更**: `index.css` 内の色コードを変更
- **秘密キー**: `App.js` 内の `hasAccess` 変数を変更
- **習慣の変更**: `FIXED_HABITS` 配列を変更（`HabitContributionGraph.js` と `TodayCheckList.js` の両方）

## プロジェクトの状況と今後の展開

現在、GitHubの草に似たシンプルなUIで基本的な習慣トラッキング機能が実装されています。今後、以下のような改善ができると良いでしょう：

1. 習慣の追加・削除機能（必要に応じて）
2. データのエクスポート・インポート機能
3. 草の色やデザインのさらなるカスタマイズ
4. 年間表示モードの追加

## トラブルシューティング

- **日付が更新されない**: ページを再読み込みしてください
- **色が変わらない**: LocalStorageが有効かを確認してください
- **モバイルで表示が崩れる**: CSSの問題が考えられます。レスポンシブデザインの調整が必要かもしれません

---

GitHubの草に似たシンプルなデザインの習慣トラッカーで、シンプルかつ効果的に習慣を継続するためのツールです。特に瞑想と読書という知的習慣の継続をサポートします。