# Habit Tracker

習慣追跡アプリケーション

## GitHub Actionsによる自動デプロイの設定

このプロジェクトはGitHub Actionsを使って、mainブランチへのプッシュ時に自動的にFirebaseにデプロイされるように設定されています。

### 設定手順

1. GitHubリポジトリに以下のSecretsを追加します:
   - `REACT_APP_FIREBASE_API_KEY`: Firebase APIキー
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`: Firebase認証ドメイン
   - `REACT_APP_FIREBASE_PROJECT_ID`: FirebaseプロジェクトID
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`: Firebaseストレージバケット
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`: Firebaseメッセージング送信者ID
   - `REACT_APP_FIREBASE_APP_ID`: FirebaseアプリID
   - `FIREBASE_SERVICE_ACCOUNT`: Firebaseサービスアカウントの秘密鍵（JSONフォーマット）

2. Firebaseサービスアカウントの秘密鍵を取得する方法:
   - Firebaseコンソール -> プロジェクト設定 -> サービスアカウント -> 新しい秘密鍵を生成
   - ダウンロードしたJSONファイルの内容全体をGitHubのSecretに追加

3. GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」から上記のシークレットを追加

4. コードをmainブランチにプッシュすると、自動的にビルドとデプロイが実行されます
