importScripts('kho/lop1.js', 'kho/lop2.js', 'kho/lop3.js', 'kho/lop4.js', 'kho/lop5.js');

// ── Keep-alive ────────────────────────────────────────
chrome.alarms.create('keepalive', { periodInMinutes: 0.3 });
chrome.alarms.onAlarm.addListener(() => {});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('vnedu.vn')) {
    chrome.sidePanel.open({ tabId });
  }
});

chrome.action.onClicked.addListener(tab => {
  chrome.sidePanel.open({ tabId: tab.id });
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'GEMINI_GENERATE_BATCH') {
    runBatch(msg.targets, msg.monHoc, msg.lop).catch(console.error);
    sendResponse({ started: true });
    return false;
  }
});

// ── Lấy từ kho (tránh trùng) ─────────────────────────
async function getFromKho(monHoc, mucDo, lop) {
  const { recentUsed: storedRecent } = await chrome.storage.local.get('recentUsed');
  const recentMap = storedRecent || {};

  const key = `${monHoc}_${mucDo}`;

  // Chuẩn hóa tên môn để khớp key trong kho
  const monNorm = monHoc.trim()
    .replace(/\s*-\s*Học kỳ.*$/i, '')
    .trim()
    .replace(/^Giáo dục thể chất$/i, 'GDTC')
    .replace(/^Hoạt động trải nghiệm$/i, 'HĐTN')
    .replace(/^Tự nhiên và Xã hội$/i, 'TN-XH')
    .replace(/^Tự nhiên - Xã hội$/i, 'TN-XH')
    .replace(/^Mỹ thuật$/i, 'Mĩ thuật');
  const keyNorm = `${monNorm}_${mucDo}`;

  // Xác định số lớp (1-5)
  const soLop = parseInt(lop) || 1;
  // Chọn các kho từ lớp hiện tại trở xuống (lớp dưới có ưu tiên hơn)
  const allKhos = [KHO_LOP1, KHO_LOP2, KHO_LOP3, KHO_LOP4, KHO_LOP5];
  const khosSrc = allKhos.slice(0, soLop);

  // Merge: nối mảng các kho từ lớp 1 đến lớp hiện tại
  const KHO = {};
  for (const src of khosSrc) {
    for (const [k, v] of Object.entries(src)) {
      KHO[k] = KHO[k] ? [...new Set([...KHO[k], ...v])] : [...v];
    }
  }
  const list = KHO[key]?.length ? KHO[key] : (KHO[keyNorm]?.length ? KHO[keyNorm] : null);

  if (!list || list.length === 0) return '';

  const used = recentMap[key] || [];
  const available = list.filter(t => !used.includes(t));
  const pool = available.length > 0 ? available : list;

  const text = pool[Math.floor(Math.random() * pool.length)];

  recentMap[key] = [...used, text].slice(-(Math.min(list.length - 1, 10)));
  await chrome.storage.local.set({ recentUsed: recentMap });

  return text;
}

// ── Xác định mức độ ───────────────────────────────────
function getMucDo(student) {
  const score = student.ktScore;
  const xl = (student.xlValue || '').trim().toUpperCase();

  // Môn chỉ có XL (không có KT): dùng xl trực tiếp
  if (score === null || isNaN(score)) {
    if (xl === 'T') return 'tot';
    if (xl === 'D' || xl === 'Đ') return 'hoan_thanh';
    if (xl === 'C') return 'chua_hoan_thanh';
    return 'hoan_thanh';
  }

  // Môn có cả KT + XL
  if (score >= 9 && xl === 'T') return 'xuat_sac';
  if (score >= 7 && xl === 'T') return 'tot';
  if (score >= 5) return 'hoan_thanh';
  return 'chua_hoan_thanh';
}

// ── Batch runner ──────────────────────────────────────
async function runBatch(targets, monHoc, lop) {
  await chrome.storage.local.set({
    batchStatus: { running: true, done: 0, total: targets.length, errors: 0, generated: {} },
    recentUsed: {}
  });

  const generated = {};

  for (let i = 0; i < targets.length; i++) {
    const s = targets[i];
    const mucDo = getMucDo(s);

    await chrome.storage.local.set({
      batchStatus: { running: true, done: i, total: targets.length, errors: 0, generated, current: s.hoTen }
    });

    generated[s.hocSinhId] = await getFromKho(monHoc, mucDo, lop);
  }

  await chrome.storage.local.set({
    batchStatus: { running: false, done: Object.keys(generated).length, total: targets.length, errors: 0, generated }
  });
}

async function callGemini(prompt, retries = 2) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 200 }
      })
    });

    if (res.ok) {
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    }

    const err = await res.json();
    const msg = err.error?.message || `HTTP ${res.status}`;

    if (res.status === 429 && attempt < retries - 1) {
      if (msg.includes('limit: 0')) throw new Error('quota limit: 0');
      const waitMatch = msg.match(/(\d+\.?\d*)s/);
      await sleep((waitMatch ? Math.ceil(parseFloat(waitMatch[1])) + 2 : 30) * 1000);
      continue;
    }

    throw new Error(msg);
  }
}

function buildPrompt(student, monHoc) {
  const mucDo = getMucDo(student);
  const mucDoLabel = {
    xuat_sac: 'Hoàn thành xuất sắc',
    tot: 'Hoàn thành tốt',
    hoan_thanh: 'Hoàn thành',
    chua_hoan_thanh: 'Chưa hoàn thành'
  }[mucDo];

  // Mô tả đặc thù theo môn — giúp AI sinh nhận xét sát thực hơn
  const monDesc = {
    'Tiếng Việt': 'kỹ năng đọc hiểu, viết văn, chính tả, làm văn',
    'Toán':         'tính toán, giải toán, tư duy logic, các phép tính',
    'Đạo đức':    'hành vi đạo đức, thái độ ứng xử, ý thức kỷ luật',
    'TN-XH':       'kiến thức tự nhiên xã hội, quan sát, khám phá',
    'Âm nhạc':    'cảm thụ âm nhạc, hát, nhập điệu',
    'Mĩ thuật':   'vẽ, tô màu, sáng tạo thẩm mỹ',
    'GDTC':        'thể lực, vận động, kỹ năng thể dục',
    'HĐTN':        'tham gia hoạt động trải nghiệm, sáng tạo, hợp tác',
  }[monHoc] || 'kiến thức và kỹ năng môn học';

  return `Viết 1-2 câu nhận xét học bạ tiểu học:
- Môn: ${monHoc} (tập trung vào: ${monDesc})
- Xếp loại: ${mucDoLabel}
- Không nhắc tên học sinh, không gạch đầu dòng, không xuống dòng
- Chỉ trả về đoạn nhận xét, không giải thích thêm`;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
