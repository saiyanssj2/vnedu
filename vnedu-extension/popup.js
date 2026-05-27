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
chrome.storage.local.get('customSelector', data => {
  if (data.customSelector)
    document.getElementById('custom-selector').value = data.customSelector;
});

document.getElementById('btn-save-selector').addEventListener('click', () => {
  const sel = document.getElementById('custom-selector').value.trim();
  chrome.storage.local.set({ customSelector: sel }, () => showToast('✅ Đã lưu'));
});

// ── Helper: gửi message, tự inject content script nếu chưa có ──
async function sendToTab(tabId, msg) {
  try {
    return await chrome.tabs.sendMessage(tabId, msg);
  } catch {
    // Content script chưa inject → inject thủ công rồi thử lại
    await chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] });
    await new Promise(r => setTimeout(r, 300));
    return await chrome.tabs.sendMessage(tabId, msg);
  }
}

// ── Resume nếu batch đang chạy khi popup mở lại ──────────
chrome.storage.local.get('batchStatus', ({ batchStatus }) => {
  if (!batchStatus?.running) return;
  const btn = document.getElementById('btn-generate-all');
  const progress = document.getElementById('progress');
  btn.disabled = true;
  progress.style.display = 'block';
  progress.textContent = `⏳ Đang chạy nền: ${batchStatus.done}/${batchStatus.total}...`;

  const pollInterval = setInterval(async () => {
    const { batchStatus: bs } = await chrome.storage.local.get('batchStatus');
    if (!bs) return;
    if (bs.running) {
      progress.textContent = `⏳ Đang sinh ${bs.done + 1}/${bs.total}: ${bs.current || ''}...`;
    } else {
      clearInterval(pollInterval);
      Object.assign(generated, bs.generated);
      if (bs.fatalError) {
        progress.textContent = `❌ ${bs.fatalError}`;
      } else if (bs.usedFallback) {
        progress.textContent = `✅ Hoàn thành: ${bs.done} nhận xét (dùng mẫu có sẵn do API hết quota)`;
      } else {
        progress.textContent = `✅ Hoàn thành: ${bs.done} nhận xét`;
      }
      renderStudentList();
      if (bs.done > 0) document.getElementById('btn-fill-all').disabled = false;
      btn.disabled = false;
    }
  }, 1000);
});

// ── Đọc dữ liệu từ trang ─────────────────────────────
document.getElementById('btn-read').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url?.includes('vnedu.vn')) {
    return showToast('⚠️ Hãy mở trang vnedu.vn trước');
  }

  try {
    const res = await sendToTab(tab.id, { type: 'READ_STUDENTS' });
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

// ── Gemini API — gọi qua background service worker ────
async function callGemini(prompt) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: 'GEMINI_GENERATE', prompt }, res => {
      if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
      if (res?.success) resolve(res.text);
      else reject(new Error(res?.error || 'Unknown error'));
    });
  });
}

// ── Generate tất cả ────────────────────────────────────────
document.getElementById('btn-generate-all').addEventListener('click', async () => {
  if (students.length === 0) return showToast('⚠️ Chưa đọc dữ liệu từ trang');

  const onlyEmpty = document.getElementById('chk-only-empty').checked;
  const targets = onlyEmpty ? students.filter(s => !s.hasComment) : students;
  if (targets.length === 0) return showToast('ℹ️ Tất cả đã có nhận xét');

  const btn = document.getElementById('btn-generate-all');
  const progress = document.getElementById('progress');
  btn.disabled = true;
  progress.style.display = 'block';

  const monHoc = subjectInfo.monHoc || 'môn học';

  // Xoa batch cu
  await chrome.storage.local.remove('batchStatus');

  // Kick off background batch
  chrome.runtime.sendMessage({ type: 'GEMINI_GENERATE_BATCH', targets, monHoc, lop: subjectInfo.lop });

  // Poll storage moi 1 giay
  const pollInterval = setInterval(async () => {
    const { batchStatus } = await chrome.storage.local.get('batchStatus');
    if (!batchStatus) return;

    if (batchStatus.running) {
      progress.textContent = `⏳ Đang sinh ${batchStatus.done + 1}/${batchStatus.total}: ${batchStatus.current || ''}...`;
    } else {
      clearInterval(pollInterval);
      Object.assign(generated, batchStatus.generated);
      progress.textContent = `✅ Hoàn thành: ${batchStatus.done} nhận xét${batchStatus.errors > 0 ? `, ${batchStatus.errors} lỗi` : ''}`;
      renderStudentList();
      document.getElementById('btn-fill-all').disabled = false;
      btn.disabled = false;
    }
  }, 1000);
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
    const res = await sendToTab(tab.id, { type: 'FILL_ALL', comments });
    showToast(`✅ Đã điền ${res.filled}/${comments.length} nhận xét vào trang`);
  } catch (e) {
    showToast('❌ Lỗi: ' + e.message);
  }
});

// ── Tab Sổ Chủ Nhiệm ─────────────────────────────────
let cachedThongKe = null;

document.getElementById('btn-read-tongket').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url?.includes('vnedu.vn')) return showToast('⚠️ Hãy mở trang vnedu.vn');

  try {
    const res = await sendToTab(tab.id, { type: 'READ_DIEM_TONG_KET' });
    if (!res?.total) return showToast('⚠️ Không tìm thấy dữ liệu. Hãy mở trang "Điểm tổng kết"');

    cachedThongKe = res.thongKe;
    renderThongKe(res.thongKe, res.total);
    document.getElementById('btn-fill-chunhiem').disabled = false;
    document.getElementById('thongke-guide').style.display = 'block';
    showToast(`✅ Đọc được ${res.total} học sinh`);
  } catch (e) {
    showToast('❌ ' + e.message);
  }
});

function renderThongKe(tk, total) {
  const preview = document.getElementById('thongke-preview');
  const content = document.getElementById('thongke-content');
  document.getElementById('tongket-info').textContent = `Tổng số: ${total} học sinh`;
  preview.style.display = 'block';

  const nlLabels = {
    nl_tcth: 'Tự chủ & tự học', nl_gtht: 'Giao tiếp & hợp tác', nl_gqvdst: 'GQVĐ & sáng tạo',
    nl_nn: 'Ngôn ngữ', nl_tt: 'Tính toán', nl_kh: 'Khoa học', nl_tm: 'Thẩm mĩ', nl_tc: 'Thể chất',
    pc_yn: 'Yêu nước', pc_nhanai: 'Nhân ái', pc_chamchi: 'Chăm chỉ',
    pc_trungthuc: 'Trung thực', pc_trachnhiem: 'Trách nhiệm'
  };
  const monLabels = {
    '50': 'Tiếng Việt', '51': 'Toán', '56': 'Đạo đức', '57': 'TN-XH',
    '58': 'Âm nhạc', '59': 'Mĩ thuật', '97': 'GDTC', '98': 'HĐTN'
  };

  const tdStyle = 'padding:2px 4px;font-size:11px';
  const thStyle = 'padding:2px 4px;background:#e8f0fe;text-align:center';

  let html = '<b>Năng lực / Phẩm chất:</b>';
  html += `<table style="width:100%;border-collapse:collapse;margin-top:4px">
    <tr><td style="${thStyle};text-align:left"><b>Tiêu chí</b></td>
    <td style="${thStyle}"><b>Tốt</b></td><td style="${thStyle}"><b>Đạt</b></td><td style="${thStyle}"><b>Cần CG</b></td></tr>`;
  Object.entries(tk.nlpc).forEach(([key, s]) => {
    html += `<tr style="border-bottom:1px solid #f0f4f8">
      <td style="${tdStyle}">${nlLabels[key] || key}</td>
      <td style="${tdStyle};text-align:center;color:#2e7d32">${s.tot} (${s.totPct}%)</td>
      <td style="${tdStyle};text-align:center;color:#1565c0">${s.dat} (${s.datPct}%)</td>
      <td style="${tdStyle};text-align:center;color:#e65100">${s.can} (${s.canPct}%)</td></tr>`;
  });
  html += '</table>';

  html += '<br><b>Môn học:</b>';
  html += `<table style="width:100%;border-collapse:collapse;margin-top:4px">
    <tr><td style="${thStyle};text-align:left"><b>Môn</b></td>
    <td style="${thStyle}"><b>HTT</b></td><td style="${thStyle}"><b>HT</b></td><td style="${thStyle}"><b>CHT</b></td></tr>`;
  Object.entries(tk.monThongKe).forEach(([id, s]) => {
    html += `<tr style="border-bottom:1px solid #f0f4f8">
      <td style="${tdStyle}">${monLabels[id] || id}</td>
      <td style="${tdStyle};text-align:center;color:#2e7d32">${s.htt}</td>
      <td style="${tdStyle};text-align:center;color:#1565c0">${s.ht}</td>
      <td style="${tdStyle};text-align:center;color:#e65100">${s.cht}</td></tr>`;
  });
  html += '</table>';

  content.innerHTML = html;
}

document.getElementById('btn-fill-chunhiem').addEventListener('click', async () => {
  if (!cachedThongKe) return showToast('⚠️ Chưa đọc dữ liệu');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url?.includes('vnedu.vn')) return showToast('⚠️ Hãy mở trang vnedu.vn');

  try {
    const pageRes = await sendToTab(tab.id, { type: 'DETECT_PAGE' });
    if (pageRes?.page !== 'so_chu_nhiem') {
      return showToast('⚠️ Hãy mở trang "Quản lý sổ chủ nhiệm" trước');
    }
    const res = await sendToTab(tab.id, { type: 'FILL_SO_CHU_NHIEM', thongKe: cachedThongKe });
    showToast(`✅ Đã điền ${res.filled} ô vào Sổ CN`);
  } catch (e) {
    showToast('❌ ' + e.message);
  }
});
