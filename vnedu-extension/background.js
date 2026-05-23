const GEMINI_KEY = 'REPLACE_YOUR_KEY_HERE';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

chrome.runtime.onInstalled.addListener(() => {
  console.log('VnEdu Nhận Xét AI installed');
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'GEMINI_GENERATE') {
    callGemini(msg.prompt)
      .then(text => sendResponse({ success: true, text }))
      .catch(e => sendResponse({ success: false, error: e.message }));
    return true;
  }
});

async function callGemini(prompt, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 256 }
      })
    });

    if (res.ok) {
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    }

    const err = await res.json();
    const msg = err.error?.message || `HTTP ${res.status}`;

    if (res.status === 429 && attempt < retries - 1) {
      const waitMatch = msg.match(/(\d+\.?\d*)s/);
      const waitSec = waitMatch ? Math.ceil(parseFloat(waitMatch[1])) + 2 : 65;
      await new Promise(r => setTimeout(r, waitSec * 1000));
      continue;
    }

    throw new Error(msg);
  }
}
