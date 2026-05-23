const GEMINI_KEY = 'AIzaSyDd-oj5kpenLfvGHQ6nm4nqUfWpesNh6zc';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

chrome.runtime.onInstalled.addListener(() => {
  console.log('VnEdu Nhận Xét AI installed');
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'GEMINI_GENERATE') {
    callGemini(msg.prompt)
      .then(text => sendResponse({ success: true, text }))
      .catch(e => sendResponse({ success: false, error: e.message }));
    return true; // async
  }
});

async function callGemini(prompt) {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 256 }
    })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}
