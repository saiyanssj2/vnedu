const GEMINI_KEY = 'REPLACE_YOUR_KEY_HERE';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_KEY}`;

// Keep-alive: ping moi 20 giay de tranh service worker bi kill
chrome.alarms.create('keepalive', { periodInMinutes: 0.3 });
chrome.alarms.onAlarm.addListener(() => {});

chrome.runtime.onInstalled.addListener(() => {
  console.log('VnEdu Nhan Xet AI installed');
});

// Mo side panel khi click icon
chrome.action.onClicked.addListener(tab => {
  chrome.sidePanel.open({ tabId: tab.id });
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'GEMINI_GENERATE_BATCH') {
    // Khong dung sendResponse vi se bi timeout
    // Thay vao do luu ket qua vao storage, popup tu poll
    runBatch(msg.targets, msg.monHoc).catch(console.error);
    sendResponse({ started: true });
    return false;
  }
});

async function runBatch(targets, monHoc) {
  await chrome.storage.local.set({
    batchStatus: { running: true, done: 0, total: targets.length, errors: 0, generated: {} }
  });

  const generated = {};
  let errors = 0;

  for (let i = 0; i < targets.length; i++) {
    const s = targets[i];

    // Cap nhat trang thai
    await chrome.storage.local.set({
      batchStatus: { running: true, done: i, total: targets.length, errors, generated, current: s.hoTen }
    });

    try {
      const text = await callGemini(buildPrompt(s, monHoc));
      generated[s.hocSinhId] = text;
    } catch (e) {
      errors++;
      console.error(`Loi ${s.hoTen}:`, e.message);
    }

    // Rate limit: 14 req/phut
    if ((i + 1) % 14 === 0 && i + 1 < targets.length) {
      await sleep(65000);
    } else {
      await sleep(300);
    }
  }

  await chrome.storage.local.set({
    batchStatus: { running: false, done: Object.keys(generated).length, total: targets.length, errors, generated }
  });
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
      await sleep(waitSec * 1000);
      continue;
    }

    throw new Error(msg);
  }
}

function buildPrompt(student, monHoc) {
  const score = student.ktScore;
  const xl = student.xlValue;
  let mucDo, goiY;
  if (score >= 9 && xl === 'T') {
    mucDo = 'Hoàn thành xuất sắc'; goiY = 'nắm vững kiến thức, vận dụng tốt, thành tích nổi bật';
  } else if (score >= 7 && xl === 'T') {
    mucDo = 'Hoàn thành tốt'; goiY = 'hiểu bài, làm bài đúng yêu cầu, có tiến bộ';
  } else if (score >= 5) {
    mucDo = 'Hoàn thành'; goiY = 'cơ bản đạt yêu cầu, cần cố gắng thêm';
  } else {
    mucDo = 'Chưa hoàn thành'; goiY = 'cần được hỗ trợ thêm, chưa đạt yêu cầu cơ bản';
  }
  return `Bạn là giáo viên tiểu học. Viết nhận xét học bạ cho học sinh:
Tên: ${student.hoTen}
Môn: ${monHoc}
Xếp loại: ${mucDo}
Gợi ý: ${goiY}
Yêu cầu: 1-2 câu ngắn gọn, phù hợp học bạ tiểu học, không dùng gạch đầu dòng, không xuống dòng, chỉ trả về đoạn nhận xét`;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
