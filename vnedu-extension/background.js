const GEMINI_KEY = 'REPLACE_YOUR_KEY_HERE';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_KEY}`;

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

  if (msg.type === 'GEMINI_GENERATE_BATCH') {
    // Chay batch o background, khong phu thuoc popup con song
    runBatch(msg.targets, msg.monHoc, msg.rateLimit)
      .then(result => sendResponse({ success: true, ...result }))
      .catch(e => sendResponse({ success: false, error: e.message }));
    return true;
  }
});

async function runBatch(targets, monHoc, rateLimit = 14) {
  const generated = {};
  let errors = 0;

  for (let i = 0; i < targets.length; i++) {
    const s = targets[i];
    try {
      const text = await callGemini(buildPrompt(s, monHoc));
      generated[s.hocSinhId] = text;
    } catch (e) {
      errors++;
      console.error(`Loi ${s.hoTen}:`, e.message);
    }

    if ((i + 1) % rateLimit === 0 && i + 1 < targets.length) {
      await new Promise(r => setTimeout(r, 65000));
    } else if (i + 1 < targets.length) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  return { generated, errors, done: Object.keys(generated).length };
}

function buildPrompt(student, monHoc) {
  const score = student.ktScore;
  const xl = student.xlValue;
  let mucDo, goiY;
  if (score >= 9 && xl === 'T') {
    mucDo = 'Hoan thanh xuat sac'; goiY = 'nam vung kien thuc, van dung tot, thanh tich noi bat';
  } else if (score >= 7 && xl === 'T') {
    mucDo = 'Hoan thanh tot'; goiY = 'hieu bai, lam bai dung yeu cau, co tien bo';
  } else if (score >= 5) {
    mucDo = 'Hoan thanh'; goiY = 'co ban dat yeu cau, can co gang them';
  } else {
    mucDo = 'Chua hoan thanh'; goiY = 'can duoc ho tro them, chua dat yeu cau co ban';
  }
  return `Ban la giao vien tieu hoc. Viet nhan xet hoc ba cho hoc sinh:
Ten: ${student.hoTen}\nMon: ${monHoc}\nXep loai: ${mucDo}\nGoi y: ${goiY}\nYeu cau: 1-2 cau ngan gon, phu hop hoc ba tieu hoc, khong dung gach dau dong, khong xuong dong, chi tra ve doan nhan xet`;
}

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
