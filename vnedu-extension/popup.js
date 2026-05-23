// ── Tabs ──────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
  });
});

// ── Toast ─────────────────────────────────────────────
function showToast(msg, duration = 2000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ── Load saved settings ───────────────────────────────
chrome.storage.local.get(['geminiKey', 'customSelector'], data => {
  if (data.geminiKey) {
    document.getElementById('api-key').value = data.geminiKey;
    setApiStatus(true);
  }
  if (data.customSelector) {
    document.getElementById('custom-selector').value = data.customSelector;
  }
});

function setApiStatus(ok) {
  document.getElementById('api-dot').className = `dot ${ok ? 'ok' : 'err'}`;
  document.getElementById('api-status-text').textContent = ok ? 'API Key đã lưu ✓' : 'API Key không hợp lệ';
}

// ── Save API Key ──────────────────────────────────────
document.getElementById('btn-save-key').addEventListener('click', () => {
  const key = document.getElementById('api-key').value.trim();
  if (!key) return showToast('⚠️ Nhập API Key trước');
  chrome.storage.local.set({ geminiKey: key }, () => {
    setApiStatus(true);
    showToast('✅ Đã lưu API Key');
  });
});

// ── Save Selector ─────────────────────────────────────
document.getElementById('btn-save-selector').addEventListener('click', () => {
  const sel = document.getElementById('custom-selector').value.trim();
  chrome.storage.local.set({ customSelector: sel }, () => {
    showToast('✅ Đã lưu selector');
  });
});

// ── Build Prompt ──────────────────────────────────────
function buildPrompt(data) {
  return `Bạn là giáo viên chủ nhiệm cấp ${data.level}. Hãy viết nhận xét học bạ cho học sinh với thông tin sau:

Tên: ${data.name}
Giới tính: ${data.gender}
Môn học: ${data.subject}
Học lực: ${data.academic}
Hạnh kiểm: ${data.conduct}
Điểm mạnh: ${data.strengths || 'không có thông tin'}
Điểm yếu: ${data.weaknesses || 'không có thông tin'}

Yêu cầu:
- Giọng văn: ${data.tone}
- Độ dài: ${data.length}
- Viết liền mạch, không xuống dòng, không dùng gạch đầu dòng
- Phù hợp để ghi vào học bạ chính thức
- Xưng hô đúng giới tính (em/bạn)
- Chỉ trả về đoạn nhận xét, không giải thích thêm`;
}

// ── Call Gemini API ───────────────────────────────────
async function callGemini(apiKey, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 512 }
    })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

// ── Generate ──────────────────────────────────────────
document.getElementById('btn-generate').addEventListener('click', async () => {
  const { geminiKey } = await chrome.storage.local.get('geminiKey');
  if (!geminiKey) {
    showToast('⚠️ Chưa cài API Key — vào tab Cài đặt');
    return;
  }

  const name = document.getElementById('name').value.trim();
  if (!name) return showToast('⚠️ Nhập tên học sinh');

  const formData = {
    name,
    gender: document.getElementById('gender').value,
    subject: document.getElementById('subject').value,
    level: document.getElementById('level').value,
    academic: document.getElementById('academic').value,
    conduct: document.getElementById('conduct').value,
    strengths: document.getElementById('strengths').value.trim(),
    weaknesses: document.getElementById('weaknesses').value.trim(),
    tone: document.getElementById('tone').value,
    length: document.getElementById('length').value,
  };

  const btn = document.getElementById('btn-generate');
  const loading = document.getElementById('loading');
  const resultBox = document.getElementById('result');

  btn.disabled = true;
  loading.classList.add('show');
  resultBox.textContent = '';
  resultBox.classList.add('empty');
  document.getElementById('btn-copy').disabled = true;
  document.getElementById('btn-fill').disabled = true;

  try {
    const text = await callGemini(geminiKey, buildPrompt(formData));
    resultBox.textContent = text;
    resultBox.classList.remove('empty');
    document.getElementById('btn-copy').disabled = false;
    document.getElementById('btn-fill').disabled = false;
  } catch (e) {
    resultBox.textContent = `❌ Lỗi: ${e.message}`;
    resultBox.classList.remove('empty');
    showToast('❌ Lỗi khi gọi API');
  } finally {
    btn.disabled = false;
    loading.classList.remove('show');
  }
});

// ── Copy ──────────────────────────────────────────────
document.getElementById('btn-copy').addEventListener('click', () => {
  const text = document.getElementById('result').textContent;
  navigator.clipboard.writeText(text).then(() => showToast('✅ Đã copy!'));
});

// ── Fill vào trang ────────────────────────────────────
document.getElementById('btn-fill').addEventListener('click', async () => {
  const text = document.getElementById('result').textContent;
  const { customSelector } = await chrome.storage.local.get('customSelector');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.url?.includes('vnedu.vn')) {
    showToast('⚠️ Hãy mở trang vnedu.vn trước');
    return;
  }

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: fillTextarea,
      args: [text, customSelector || '']
    });

    const result = results?.[0]?.result;
    if (result?.success) {
      showToast('✅ Đã điền vào trang!');
    } else {
      showToast(`⚠️ ${result?.message || 'Không tìm thấy ô nhập liệu'}`);
    }
  } catch (e) {
    showToast('❌ Lỗi: ' + e.message);
  }
});

// ── Hàm inject vào trang (chạy trong context của page) ─
function fillTextarea(text, customSelector) {
  // Danh sách selector thử theo thứ tự ưu tiên
  const selectors = customSelector
    ? [customSelector]
    : [
        'textarea:focus',
        'textarea[class*="comment"]',
        'textarea[class*="nhan-xet"]',
        'textarea[class*="nhanxet"]',
        'textarea[placeholder*="nhận xét"]',
        'textarea[placeholder*="nhan xet"]',
        '.ant-input:focus',
        'textarea.ant-input',
        '[contenteditable="true"]:focus',
        'textarea:visible',
        'textarea'
      ];

  for (const sel of selectors) {
    let el;
    try { el = document.querySelector(sel); } catch { continue; }
    if (!el) continue;

    // Xử lý contenteditable
    if (el.contentEditable === 'true') {
      el.focus();
      el.textContent = text;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return { success: true };
    }

    // Xử lý textarea / input
    el.focus();
    // React/Vue cần native setter để trigger onChange
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype, 'value'
    )?.set || Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    )?.set;

    if (nativeSetter) {
      nativeSetter.call(el, text);
    } else {
      el.value = text;
    }

    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return { success: true };
  }

  return { success: false, message: 'Không tìm thấy ô nhập liệu. Click vào ô nhận xét trên trang rồi thử lại.' };
}
