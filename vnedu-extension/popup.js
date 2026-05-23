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
function showToast(msg, duration = 2500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ── State ─────────────────────────────────────────────
let students = [];       // danh sách đọc từ trang
let subjectInfo = {};    // môn học, lớp
let generated = {};      // { hocSinhId: text }

// ── Load settings ─────────────────────────────────────
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
  document.getElementById('api-status-text').textContent = ok ? 'API Key đã lưu ✓' : 'Chưa có API Key';
}

document.getElementById('btn-save-key').addEventListener('click', () => {
  const key = document.getElementById('api-key').value.trim();
  if (!key) return showToast('⚠️ Nhập API Key trước');
  chrome.storage.local.set({ geminiKey: key }, () => {
    setApiStatus(true);
    showToast('✅ Đã lưu API Key');
  });
});

document.getElementById('btn-save-selector').addEventListener('click', () => {
  const sel = document.getElementById('custom-selector').value.trim();
  chrome.storage.local.set({ customSelector: sel }, () => showToast('✅ Đã lưu'));
});

// ── Đọc dữ liệu từ trang ─────────────────────────────
document.getElementById('btn-read').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url?.includes('vnedu.vn')) {
    return showToast('⚠️ Hãy mở trang vnedu.vn trước');
  }

  try {
    const res = await chrome.tabs.sendMessage(tab.id, { type: 'READ_STUDENTS' });
    students = res.students || [];
    subjectInfo = res.subjectInfo || {};

    if (students.length === 0) {
      return showToast('⚠️ Không tìm thấy danh sách học sinh');
    }

    renderStudentList();
    showToast(`✅ Đọc được ${students.length} học sinh`);
    document.getElementById('btn-generate-all').disabled = false;
  } catch (e) {
    showToast('❌ Lỗi: ' + e.message);
  }
});

// ── Render danh sách học sinh ─────────────────────────
function renderStudentList() {
  const list = document.getElementById('student-list');
  const info = document.getElementById('subject-info');

  info.textContent = `${subjectInfo.monHoc || ''} — Lớp ${subjectInfo.lop || ''}`;

  list.innerHTML = students.map(s => {
    const xlLabel = s.xlValue === 'T' ? '✓ Tốt' : s.xlValue === 'H' ? '△ Hoàn thành' : s.xlValue || '?';
    const scoreColor = s.ktScore >= 9 ? '#2e7d32' : s.ktScore >= 7 ? '#1565c0' : s.ktScore >= 5 ? '#e65100' : '#c62828';
    const hasGen = generated[s.hocSinhId];
    return `
      <div class="student-row ${hasGen ? 'done' : ''}" data-id="${s.hocSinhId}">
        <div class="student-name">${s.hoTen}</div>
        <div class="student-meta">
          <span style="color:${scoreColor}; font-weight:600">${s.ktScore ?? '?'}</span>
          <span class="xl-badge">${xlLabel}</span>
          ${s.hasComment ? '<span class="badge-existing">Đã có NX</span>' : ''}
          ${hasGen ? '<span class="badge-done">✓ Đã sinh</span>' : ''}
        </div>
        ${hasGen ? `<div class="preview-text">${generated[s.hocSinhId]}</div>` : ''}
      </div>`;
  }).join('');
}

// ── Gemini API ────────────────────────────────────────
async function callGemini(apiKey, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
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

// ── Build prompt cho 1 học sinh ──────────────────────
function buildPrompt(student, monHoc) {
  const score = student.ktScore;
  const xl = student.xlValue;

  // Xác định mức độ từ điểm + xếp loại
  let mucDo, goiY;
  if (score >= 9 && xl === 'T') {
    mucDo = 'Hoàn thành xuất sắc';
    goiY = 'nắm vững kiến thức, vận dụng tốt, thành thích nổi bật';
  } else if (score >= 7 && xl === 'T') {
    mucDo = 'Hoàn thành tốt';
    goiY = 'hiểu bài, làm bài đúng yêu cầu, có tiến bộ';
  } else if (score >= 5) {
    mucDo = 'Hoàn thành';
    goiY = 'cơ bản đạt yêu cầu, cần cố gắng thêm';
  } else {
    mucDo = 'Chưa hoàn thành';
    goiY = 'cần được hỗ trợ thêm, chưa đạt yêu cầu cơ bản';
  }

  return `Bạn là giáo viên tiểu học. Viết nhận xét học bạ cho học sinh:

Tên: ${student.hoTen}
Môn: ${monHoc}
Điểm cuối kỳ: ${score}
Xếp loại: ${mucDo}
Gợi ý nội dung: ${goiY}

Yêu cầu:
- 1-2 câu ngắn gọn, phù hợp học bạ tiểu học
- Không dùng gạch đầu dòng, không xuống dòng
- Không nhắc đến điểm số cụ thể
- Chỉ trả về đoạn nhận xét, không giải thích`;
}

// ── Generate tất cả (batch với rate limit) ────────────
document.getElementById('btn-generate-all').addEventListener('click', async () => {
  const { geminiKey } = await chrome.storage.local.get('geminiKey');
  if (!geminiKey) return showToast('⚠️ Chưa có API Key — vào tab Cài đặt');
  if (students.length === 0) return showToast('⚠️ Chưa đọc dữ liệu từ trang');

  const onlyEmpty = document.getElementById('chk-only-empty').checked;
  const targets = onlyEmpty ? students.filter(s => !s.hasComment) : students;

  if (targets.length === 0) return showToast('ℹ️ Tất cả đã có nhận xét');

  const btn = document.getElementById('btn-generate-all');
  btn.disabled = true;

  const progress = document.getElementById('progress');
  progress.style.display = 'block';

  const monHoc = subjectInfo.monHoc || 'môn học';
  const RATE_LIMIT = 14; // max 14/phút để an toàn
  let done = 0;
  let errors = 0;

  for (let i = 0; i < targets.length; i++) {
    const s = targets[i];
    progress.textContent = `⏳ Đang sinh ${i + 1}/${targets.length}: ${s.hoTen}...`;

    try {
      const text = await callGemini(geminiKey, buildPrompt(s, monHoc));
      generated[s.hocSinhId] = text;
      done++;
    } catch (e) {
      errors++;
      console.error(`Lỗi ${s.hoTen}:`, e.message);
    }

    // Rate limit: sau mỗi RATE_LIMIT request, chờ 65 giây
    if ((i + 1) % RATE_LIMIT === 0 && i + 1 < targets.length) {
      progress.textContent = `⏸️ Chờ 65 giây để tránh rate limit... (${i + 1}/${targets.length})`;
      await sleep(65000);
    } else if (i + 1 < targets.length) {
      await sleep(200); // delay nhỏ giữa các request
    }
  }

  progress.textContent = `✅ Hoàn thành: ${done} nhận xét${errors > 0 ? `, ${errors} lỗi` : ''}`;
  renderStudentList();
  document.getElementById('btn-fill-all').disabled = false;
  btn.disabled = false;
});

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Điền tất cả vào trang ─────────────────────────────
document.getElementById('btn-fill-all').addEventListener('click', async () => {
  if (Object.keys(generated).length === 0) return showToast('⚠️ Chưa sinh nhận xét');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url?.includes('vnedu.vn')) return showToast('⚠️ Hãy mở trang vnedu.vn');

  const comments = Object.entries(generated).map(([hocSinhId, text]) => {
    const s = students.find(x => x.hocSinhId === hocSinhId);
    return { hocSinhId, suffix: s?.suffix || 'ck2', text };
  });

  try {
    const res = await chrome.tabs.sendMessage(tab.id, { type: 'FILL_ALL', comments });
    showToast(`✅ Đã điền ${res.filled}/${comments.length} nhận xét vào trang`);
  } catch (e) {
    showToast('❌ Lỗi: ' + e.message);
  }
});
