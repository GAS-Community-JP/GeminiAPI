# gemini-gas
Google Apps Script (GAS) から Gemini API を呼び出すサンプルコードです。
外部ライブラリは不要で、`UrlFetchApp` だけで動作します。

## 必要なもの
- Google アカウント
- Gemini API キー([Google AI Studio](https://aistudio.google.com/app/apikey) で取得)

## セットアップ
1. [Google Apps Script](https://script.google.com/) で新しいプロジェクトを作成します。
2. `Code.gs` の内容をこのリポジトリの `Code.gs` に置き換えます。
3. 左メニューの「プロジェクトの設定」→「スクリプト プロパティ」で、以下を追加します。

   | プロパティ | 値 |
   |---|---|
   | `GEMINI_API_KEY` | 取得した API キー |

4. `test` 関数を選択して実行します。初回は外部通信の権限承認が求められます。

API キーはコードに直接書かず、必ずスクリプト プロパティに保存してください。
コードを GitHub に公開してもキーが漏れないようにするためです。

## コード

```javascript
// 使用するモデル名。最新のモデル名は公式ドキュメントで確認してください。
// https://ai.google.dev/gemini-api/docs/models
const MODEL = 'gemini-2.5-flash';

/**
 * Gemini API にプロンプトを送信し、生成されたテキストを返す
 * @param {string} prompt 送信するテキスト
 * @return {string} 生成されたテキスト
 */
function callGemini(prompt) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('スクリプト プロパティに GEMINI_API_KEY が設定されていません');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

  const payload = {
    contents: [
      { parts: [{ text: prompt }] }
    ]
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-goog-api-key': apiKey },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const code = response.getResponseCode();
  const body = JSON.parse(response.getContentText());

  if (code !== 200) {
    throw new Error(`Gemini API エラー (${code}): ${JSON.stringify(body.error)}`);
  }

  return body.candidates[0].content.parts[0].text;
}

function test() {
  const result = callGemini('Google Apps Script とは何か、一文で説明してください。');
  Logger.log(result);
}
```

## 応用例:スプレッドシートの関数として使う
スプレッドシートに紐づいたスクリプトに以下を追加すると、セルから `=GEMINI("質問")` で呼び出せます。

```javascript
/**
 * Gemini に質問して回答を返す
 * @param {string} prompt 質問文
 * @return {string} 回答
 * @customfunction
 */
function GEMINI(prompt) {
  return callGemini(prompt);
}
```

大量のセルで同時に使うと API のレート制限にかかることがあるので注意してください。

## 注意事項
- 無料枠にはレート制限があります。最新の制限は[公式ドキュメント](https://ai.google.dev/gemini-api/docs/rate-limits)を確認してください。
- GAS の `UrlFetchApp` には1日あたりの呼び出し回数上限があります。
- 無料枠で送信したデータは、Google のサービス改善に利用される場合があります。機密情報は送信しないでください。

## ライセンス
MIT
