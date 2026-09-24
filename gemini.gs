function listAvailableModels() {
  const API_KEY = '************************************';
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  
  const response = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
  Logger.log(response.getContentText());
}

/**
 * Gemini API 呼び出し：2026年最新モデル対応版
 */
function callGeminiAPI(promptText) {
  const API_KEY = 'AIzaSyDVEHeNlr9S8bWLSrMZyB0UgziS_ZBvm4I'; 
  
  // リストにあった最新のエイリアスを使用します
  const model = "gemini-flash-latest"; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

  //const textToSend = promptText || "iPhoneで同じアプリを2つのアカウントで使う方法を教えて";
  const textToSend = promptText || "Google Apps ScriptでGeminiを使うメリットを3つ教えて。？";
  

  const payload = {
    "contents": [{
      "parts": [{
        "text": textToSend
      }]
    }]
  };

  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const resText = response.getContentText();
    const json = JSON.parse(resText);

    if (response.getResponseCode() !== 200) {
      Logger.log("エラー詳細: " + resText);
      return "エラーが発生しました。";
    }

    return json.candidates[0].content.parts[0].text;

  } catch (e) {
    return "実行エラー: " + e.toString();
  }
}

/**
 * 実行テスト
 */
function testGemini() {
  const result = callGeminiAPI();
  Logger.log("--- AIの回答 ---");
  Logger.log(result);
}
