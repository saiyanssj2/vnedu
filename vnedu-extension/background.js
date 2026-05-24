const GEMINI_KEY = 'REPLACE_YOUR_KEY_HERE';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_KEY}`;

// ── Kho mẫu mặc định (seed data) ─────────────────────
const KHO_DEFAULT = {
  'default_xuat_sac': [
    'Nắm vững kiến thức, vận dụng linh hoạt và đạt kết quả xuất sắc trong học tập.',
    'Học tập tích cực, hiểu bài sâu sắc và hoàn thành xuất sắc các yêu cầu môn học.',
    'Tư duy tốt, tiếp thu bài nhanh và luôn hoàn thành bài tập đầy đủ, chính xác.',
    'Chăm chỉ, cẩn thận trong học tập, nắm chắc kiến thức và vận dụng tốt vào thực hành.',
  ],
  'default_tot': [
    'Hiểu bài và hoàn thành tốt các yêu cầu học tập, có nhiều tiến bộ trong học kỳ.',
    'Học tập nghiêm túc, làm bài đúng yêu cầu và có ý thức rèn luyện thường xuyên.',
    'Nắm được kiến thức cơ bản, hoàn thành bài tập đầy đủ và có tiến bộ rõ rệt.',
    'Chú ý nghe giảng, hiểu bài và hoàn thành tốt nhiệm vụ học tập được giao.',
  ],
  'default_hoan_thanh': [
    'Cơ bản nắm được kiến thức, hoàn thành các yêu cầu học tập, cần cố gắng thêm.',
    'Đã hoàn thành chương trình học, cần tích cực hơn trong việc ôn luyện và rèn luyện.',
    'Đạt yêu cầu cơ bản của môn học, cần chú ý hơn trong giờ học để tiến bộ hơn.',
    'Hoàn thành bài tập đúng hạn, cần rèn luyện thêm để nâng cao kết quả học tập.',
  ],
  'default_chua_hoan_thanh': [
    'Cần cố gắng hơn trong học tập, chú ý nghe giảng và hoàn thành đầy đủ bài tập.',
    'Chưa đạt yêu cầu môn học, cần được hỗ trợ thêm và tích cực ôn luyện kiến thức.',
    'Cần nỗ lực nhiều hơn, chú ý lắng nghe và hoàn thành bài tập theo yêu cầu.',
  ],
  'Tiếng Việt_xuat_sac': [
    'Đọc hiểu tốt, viết văn mạch lạc, dùng từ chính xác và diễn đạt rõ ràng, sáng tạo.',
    'Có vốn từ phong phú, viết câu đúng ngữ pháp và trình bày bài viết rõ ràng, sạch đẹp.',
    'Nắm vững kiến thức Tiếng Việt, đọc hiểu tốt và viết bài có bố cục rõ ràng, diễn đạt hay.',
  ],
  'Tiếng Việt_tot': [
    'Đọc hiểu được bài, viết câu đúng và trình bày sạch, dùng từ phù hợp với chủ đề.',
    'Có vốn từ khá phong phú, đặt câu đúng ngữ pháp và biết kể lại nội dung bài đọc rõ ràng.',
    'Nắm được kiến thức Tiếng Việt, làm bài đúng yêu cầu và có cố gắng trong rèn chữ viết.',
  ],
  'Tiếng Việt_hoan_thanh': [
    'Đọc và viết được nội dung cơ bản, cần luyện thêm cách dùng từ và đặt câu phù hợp.',
    'Hoàn thành yêu cầu môn Tiếng Việt, cần rèn thêm chính tả và cách diễn đạt trong bài viết.',
  ],
  'Tiếng Việt_chua_hoan_thanh': [
    'Cần rèn luyện thêm kỹ năng đọc hiểu và viết, chú ý chính tả và cách đặt câu.',
  ],
  'Toán_xuat_sac': [
    'Tư duy toán học tốt, tính toán chính xác và giải được các bài toán nâng cao.',
    'Nắm vững các phép tính, giải toán nhanh và chính xác, có khả năng tư duy logic tốt.',
    'Hiểu sâu kiến thức Toán, vận dụng linh hoạt vào giải bài tập và đạt kết quả cao.',
  ],
  'Toán_tot': [
    'Tính toán đúng, nắm được các dạng toán cơ bản và hoàn thành bài tập đầy đủ.',
    'Hiểu bài và làm đúng các phép tính, cần rèn thêm tốc độ tính toán.',
    'Nắm được kiến thức Toán cơ bản, giải bài tập đúng phương pháp và trình bày rõ ràng.',
  ],
  'Toán_hoan_thanh': [
    'Thực hiện được các phép tính cơ bản, cần luyện thêm để nâng cao tốc độ và độ chính xác.',
    'Hoàn thành yêu cầu môn Toán, cần chú ý hơn trong việc kiểm tra lại kết quả.',
  ],
  'Toán_chua_hoan_thanh': [
    'Cần ôn luyện thêm các phép tính cơ bản, chú ý rèn luyện để nắm vững kiến thức Toán.',
  ],
};

// ── Keep-alive ────────────────────────────────────────
chrome.alarms.create('keepalive', { periodInMinutes: 0.3 });
chrome.alarms.onAlarm.addListener(() => {});

chrome.runtime.onInstalled.addListener(() => {
  // Khởi tạo kho nếu chưa có
  chrome.storage.local.get('khoNhanXet', ({ khoNhanXet }) => {
    if (!khoNhanXet) chrome.storage.local.set({ khoNhanXet: KHO_DEFAULT });
  });
});

chrome.action.onClicked.addListener(tab => {
  chrome.sidePanel.open({ tabId: tab.id });
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'GEMINI_GENERATE_BATCH') {
    runBatch(msg.targets, msg.monHoc).catch(console.error);
    sendResponse({ started: true });
    return false;
  }
});

// ── Lấy từ kho (fallback) ─────────────────────────────
async function getFromKho(monHoc, mucDo) {
  const { khoNhanXet } = await chrome.storage.local.get('khoNhanXet');
  const kho = khoNhanXet || KHO_DEFAULT;

  // Ưu tiên kho theo môn, fallback về default
  const key = `${monHoc}_${mucDo}`;
  const keyDefault = `default_${mucDo}`;
  const list = kho[key]?.length ? kho[key] : (kho[keyDefault] || KHO_DEFAULT[keyDefault]);

  return list[Math.floor(Math.random() * list.length)];
}

// ── Lưu vào kho sau khi API trả về ───────────────────
async function saveToKho(monHoc, mucDo, text) {
  const { khoNhanXet } = await chrome.storage.local.get('khoNhanXet');
  const kho = khoNhanXet || { ...KHO_DEFAULT };
  const key = `${monHoc}_${mucDo}`;

  if (!kho[key]) kho[key] = [];

  // Tránh trùng lặp, giới hạn 20 mẫu mỗi key
  if (!kho[key].includes(text)) {
    kho[key].push(text);
    if (kho[key].length > 20) kho[key].shift();
    await chrome.storage.local.set({ khoNhanXet: kho });
  }
}

// ── Xác định mức độ ───────────────────────────────────
function getMucDo(student) {
  const score = student.ktScore;
  const xl = student.xlValue;
  if (score >= 9 && xl === 'T') return 'xuat_sac';
  if (score >= 7 && xl === 'T') return 'tot';
  if (score >= 5) return 'hoan_thanh';
  return 'chua_hoan_thanh';
}

// ── Batch runner ──────────────────────────────────────
async function runBatch(targets, monHoc) {
  await chrome.storage.local.set({
    batchStatus: { running: true, done: 0, total: targets.length, errors: 0, generated: {} }
  });

  const generated = {};
  let errors = 0;
  let apiOk = true;

  for (let i = 0; i < targets.length; i++) {
    const s = targets[i];
    const mucDo = getMucDo(s);

    await chrome.storage.local.set({
      batchStatus: { running: true, done: i, total: targets.length, errors, generated, current: s.hoTen }
    });

    let text = null;

    if (apiOk) {
      try {
        text = await callGemini(buildPrompt(s, monHoc));
        // Lưu vào kho để tích lũy
        await saveToKho(monHoc, mucDo, text);
      } catch (e) {
        console.warn(`API loi:`, e.message);
        if (e.message.includes('limit: 0') || e.message.includes('quota') ||
            e.message.includes('403') || e.message.includes('not found')) {
          apiOk = false;
        }
      }
    }

    // Fallback: lấy từ kho tích lũy
    if (!text) {
      text = await getFromKho(monHoc, mucDo);
    }

    generated[s.hocSinhId] = text;

    // Chỉ delay rate limit khi API còn dùng
    await sleep(apiOk ? 300 : 50);
    if (apiOk && (i + 1) % 14 === 0 && i + 1 < targets.length) {
      await sleep(65000);
    }
  }

  await chrome.storage.local.set({
    batchStatus: {
      running: false,
      done: Object.keys(generated).length,
      total: targets.length,
      errors,
      generated,
      usedFallback: !apiOk
    }
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
  const mucDoLabel = { xuat_sac: 'Hoàn thành xuất sắc', tot: 'Hoàn thành tốt', hoan_thanh: 'Hoàn thành', chua_hoan_thanh: 'Chưa hoàn thành' }[mucDo];
  return `Viết 1-2 câu nhận xét học bạ tiểu học cho học sinh môn ${monHoc}, xếp loại ${mucDoLabel}. Không nhắc tên, không gạch đầu dòng, không xuống dòng, chỉ trả về đoạn nhận xét.`;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
