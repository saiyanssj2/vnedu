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
  'Đạo đức_xuat_sac': [
    'Có ý thức kỷ luật tốt, thực hiện đúng các chuẩn mực đạo đức và ứng xử lịch sự với mọi người.',
    'Luôn thực hiện tốt nội quy lớp học, biết quan tâm giúp đỡ bạn bè và có thái độ lễ phép.',
  ],
  'Đạo đức_tot': [
    'Có ý thức thực hiện các quy tắc ứng xử, biết giúp đỡ bạn bè và tôn trọng thầy cô.',
    'Thực hiện tốt nội quy lớp học, có thái độ học tập nghiêm túc và ứng xử đúng mực.',
  ],
  'Đạo đức_hoan_thanh': [
    'Cơ bản thực hiện được các yêu cầu môn Đạo đức, cần rèn luyện thêm ý thức kỷ luật.',
  ],
  'Đạo đức_chua_hoan_thanh': [
    'Cần chú ý hơn trong việc thực hiện nội quy và rèn luyện các hành vi đạo đức.',
  ],
  'TN-XH_xuat_sac': [
    'Có hiểu biết phong phú về tự nhiên và xã hội, biết quan sát và giải thích các hiện tượng xung quanh.',
    'Nắm vững kiến thức TN-XH, biết liên hệ thực tế và trình bày rõ ràng những điều quan sát được.',
  ],
  'TN-XH_tot': [
    'Hiểu và nắm được các kiến thức cơ bản về tự nhiên xã hội, biết vận dụng vào thực tế.',
    'Tích cực tham gia các hoạt động khám phá, nắm được nội dung bài học và trình bày khá rõ ràng.',
  ],
  'TN-XH_hoan_thanh': [
    'Nắm được kiến thức cơ bản môn TN-XH, cần tích cực quan sát và liên hệ thực tế hơn.',
  ],
  'TN-XH_chua_hoan_thanh': [
    'Cần chú ý hơn trong giờ học TN-XH, tích cực quan sát và ghi nhớ kiến thức bài học.',
  ],
  'Âm nhạc_xuat_sac': [
    'Có năng khiếu âm nhạc, hát đúng giai điệu, thuộc lời và thể hiện cảm xúc tốt qua bài hát.',
    'Cảm thụ âm nhạc tốt, hát đúng nhịp điệu và tích cực tham gia các hoạt động âm nhạc.',
  ],
  'Âm nhạc_tot': [
    'Hát đúng giai điệu, thuộc lời bài hát và tham gia tích cực các hoạt động âm nhạc.',
    'Có cảm nhận âm nhạc khá tốt, hát đúng nhịp và hoàn thành tốt các yêu cầu môn học.',
  ],
  'Âm nhạc_hoan_thanh': [
    'Hoàn thành các yêu cầu cơ bản môn Âm nhạc, cần luyện tập thêm để hát đúng và đều hơn.',
  ],
  'Âm nhạc_chua_hoan_thanh': [
    'Cần luyện tập thêm để hát đúng giai điệu và nhịp điệu theo yêu cầu môn Âm nhạc.',
  ],
  'Mĩ thuật_xuat_sac': [
    'Có năng khiếu hội họa, vẽ đẹp, tô màu hài hòa và thể hiện sự sáng tạo trong từng bài vẽ.',
    'Sáng tạo trong các bài vẽ, biết phối màu hợp lý và trình bày bài sạch đẹp, ấn tượng.',
  ],
  'Mĩ thuật_tot': [
    'Vẽ đúng yêu cầu, tô màu gọn gàng và có ý thức sáng tạo trong các bài học Mĩ thuật.',
    'Hoàn thành tốt các bài vẽ, biết phối màu và trình bày bài sạch sẽ, cẩn thận.',
  ],
  'Mĩ thuật_hoan_thanh': [
    'Hoàn thành các bài vẽ theo yêu cầu, cần rèn thêm kỹ năng tô màu và sáng tạo.',
  ],
  'Mĩ thuật_chua_hoan_thanh': [
    'Cần cố gắng hơn trong các bài vẽ, chú ý tô màu đúng và hoàn thành bài đúng hạn.',
  ],
  'GDTC_xuat_sac': [
    'Thể lực tốt, thực hiện đúng và đẹp các động tác thể dục, tích cực tham gia các hoạt động thể chất.',
    'Nhanh nhẹn, khéo léo, thực hiện tốt các bài tập thể dục và đạt kết quả cao trong các bài kiểm tra.',
  ],
  'GDTC_tot': [
    'Thực hiện đúng các động tác thể dục, tích cực tham gia luyện tập và có tiến bộ rõ rệt.',
    'Hoàn thành tốt các bài tập thể dục, có ý thức rèn luyện thể chất thường xuyên.',
  ],
  'GDTC_hoan_thanh': [
    'Hoàn thành các yêu cầu môn Thể dục, cần tích cực luyện tập thêm để nâng cao thể lực.',
  ],
  'GDTC_chua_hoan_thanh': [
    'Cần tích cực hơn trong giờ Thể dục, chú ý thực hiện đúng các động tác theo hướng dẫn.',
  ],
  'HĐTN_xuat_sac': [
    'Tích cực tham gia các hoạt động trải nghiệm, sáng tạo và hợp tác tốt với bạn bè trong nhóm.',
    'Năng động, sáng tạo trong các hoạt động trải nghiệm, biết chia sẻ và hỗ trợ các bạn.',
  ],
  'HĐTN_tot': [
    'Tham gia tích cực các hoạt động trải nghiệm, biết hợp tác và hoàn thành tốt nhiệm vụ được giao.',
    'Có ý thức tham gia hoạt động tập thể, biết chia sẻ và thể hiện sự sáng tạo trong các hoạt động.',
  ],
  'HĐTN_hoan_thanh': [
    'Tham gia các hoạt động trải nghiệm đúng yêu cầu, cần chủ động và sáng tạo hơn.',
  ],
  'HĐTN_chua_hoan_thanh': [
    'Cần tích cực hơn trong các hoạt động trải nghiệm, chủ động tham gia và hợp tác với bạn bè.',
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
