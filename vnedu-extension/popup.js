// ── Toast ─────────────────────────────────────────────
function showToast(msg, duration = 2500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ── State ─────────────────────────────────────────────
let students = [];
let subjectInfo = {};
let generated = {};
let cachedThongKe = null;

// ── Helper ────────────────────────────────────────────
async function getActiveTab() {
  const { activeTabId } = await chrome.storage.local.get('activeTabId');
  if (activeTabId) {
    try {
      const tab = await chrome.tabs.get(activeTabId);
      if (tab?.url?.includes('vnedu.vn')) return tab;
    } catch {}
  }
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function sendToTab(tabId, msg) {
  try {
    return await chrome.tabs.sendMessage(tabId, msg);
  } catch {
    await chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] });
    await new Promise(r => setTimeout(r, 300));
    return await chrome.tabs.sendMessage(tabId, msg);
  }
}

function showPanel(name) {
  ['nhanxet', 'chunhiem', 'phamchat', 'unknown'].forEach(p =>
    document.getElementById(`panel-${p}`).style.display = p === name ? 'block' : 'none'
  );
}

// ── Auto-detect và đọc dữ liệu ───────────────────────
async function autoRead() {
  const tab = await getActiveTab();
  if (!tab?.url?.includes('vnedu.vn')) {
    document.getElementById('page-label').textContent = 'Hãy mở trang vnedu.vn';
    showPanel('unknown');
    return;
  }

  try {
    const { page } = await sendToTab(tab.id, { type: 'DETECT_PAGE' });

    if (page === 'so_nhan_xet') {
      await readNhanXet(tab.id);
    } else if (page === 'unknown') {
      document.getElementById('page-label').textContent = '';
      showPanel('unknown');
    } else if (page === 'diem_tong_ket') {
      await readDiemTongKet(tab.id);
    } else if (page === 'pham_chat_nang_luc') {
      document.getElementById('page-label').textContent = 'Phẩm chất - Năng lực';
      const licensed = await checkLicense();
      document.getElementById('nlpc-lock').style.display = licensed ? 'none' : 'block';
      document.getElementById('nlpc-content').style.display = licensed ? 'block' : 'none';
      if (licensed) await readNlpc(tab.id);
      showPanel('phamchat');
    } else if (page === 'so_chu_nhiem') {
      document.getElementById('page-label').textContent = 'Sổ chủ nhiệm';
      document.getElementById('tongket-info').textContent = cachedThongKe
        ? 'Đã có dữ liệu — sẵn sàng điền'
        : 'Mở trang "Điểm tổng kết" trước để đọc dữ liệu';
      document.getElementById('btn-fill-chunhiem').disabled = !cachedThongKe;
      if (cachedThongKe) document.getElementById('thongke-guide').style.display = 'block';
      showPanel('chunhiem');
    }
  } catch (e) {
    document.getElementById('page-label').textContent = 'Không đọc được trang';
    showPanel('unknown');
  }
}

async function readNhanXet(tabId) {
  const res = await sendToTab(tabId, { type: 'READ_STUDENTS' });
  students = res.students || [];
  subjectInfo = res.subjectInfo || {};
  generated = {};
  document.getElementById('btn-fill-all').disabled = true;
  document.getElementById('progress').style.display = 'none';
  document.getElementById('preview-sample').style.display = 'none';

  if (students.length === 0) {
    document.getElementById('page-label').textContent = 'Nhập sổ điểm';
    document.getElementById('subject-info').textContent = 'Không tìm thấy danh sách học sinh';
    document.getElementById('student-list').innerHTML = '<div class="empty-state">Không tìm thấy học sinh trên trang này</div>';
    document.getElementById('btn-generate-all').disabled = true;
    showPanel('nhanxet');
    return;
  }

  document.getElementById('page-label').textContent = 'Nhập sổ điểm';
  document.getElementById('btn-generate-all').disabled = false;
  renderStudentList();
  showPanel('nhanxet');

  // Tự sinh mẫu 1 nhận xét để preview
  autoGenerateSample();

  // Resume nếu batch đang chạy
  const { batchStatus } = await chrome.storage.local.get('batchStatus');
  if (batchStatus?.running) resumeBatch();
}

async function autoGenerateSample() {
  const target = students.find(s => !s.hasComment) || students[0];
  if (!target) return;
  const res = await chrome.runtime.sendMessage({
    type: 'GEMINI_GENERATE_BATCH',
    targets: [target],
    monHoc: subjectInfo.monHoc || 'môn học',
    lop: subjectInfo.lop
  });
  // Chờ batch xong rồi lấy kết quả
  const poll = setInterval(async () => {
    const { batchStatus: bs } = await chrome.storage.local.get('batchStatus');
    if (!bs || bs.running) return;
    clearInterval(poll);
    const sample = Object.values(bs.generated || {})[0];
    if (sample) {
      const box = document.getElementById('preview-sample');
        const textEl = document.getElementById('preview-sample-text');
        if (textEl) textEl.textContent = sample;
        box.style.display = 'block';
    }
    Object.assign(generated, bs.generated || {});
    document.getElementById('btn-fill-all').disabled = false;
  }, 500);
}

async function readDiemTongKet(tabId) {
  const res = await sendToTab(tabId, { type: 'READ_DIEM_TONG_KET' });
  if (!res?.total) {
    document.getElementById('page-label').textContent = 'Điểm tổng kết';
    document.getElementById('tongket-info').textContent = 'Không tìm thấy dữ liệu';
    showPanel('chunhiem');
    return;
  }

  cachedThongKe = res.thongKe;
  document.getElementById('page-label').textContent = 'Điểm tổng kết';
  document.getElementById('tongket-info').textContent = `Tổng số: ${res.total} học sinh — Mở Sổ CN để điền`;
  document.getElementById('btn-fill-chunhiem').disabled = false;
  document.getElementById('thongke-guide').style.display = 'block';
  renderThongKe(res.thongKe, res.total);
  showPanel('chunhiem');
}

// ── Render nhận xét ───────────────────────────────────
function renderStudentList() {
  const chuaNx = students.filter(s => !s.hasComment).length;
  const info = subjectInfo;
  document.getElementById('subject-info').innerHTML =
    `<div style="font-size:16px;font-weight:700;color:#1565c0;text-align:center;margin-bottom:5px">${info.monHoc || ''} &nbsp;•&nbsp; ${info.hocKy || ''}</div>` +
    `<div style="font-size:13px;color:#666;text-align:center;margin-bottom:4px">${info.khoi || ''} &nbsp;•&nbsp; Lớp ${info.lop || ''}${info.ky ? ' &nbsp;•&nbsp; ' + info.ky : ''}</div>` +
    `<div style="font-size:13px;color:#e65100;text-align:center;font-weight:600">Chưa nhận xét: ${chuaNx}/${students.length} học sinh</div>`;

  document.getElementById('student-list').innerHTML = students.map(s => {
    const xlLabel = s.xlValue === 'T' ? '✓ Tốt' : s.xlValue === 'H' ? '△ Hoàn thành' : s.xlValue || '?';
    const scoreColor = s.ktScore >= 9 ? '#2e7d32' : s.ktScore >= 7 ? '#1565c0' : s.ktScore >= 5 ? '#e65100' : '#c62828';
    const hasGen = generated[s.hocSinhId];
    return `
      <div class="student-row ${hasGen ? 'done' : ''}" data-id="${s.hocSinhId}">
        <div class="student-name">${s.hoTen}</div>
        <div class="student-meta">
          <span style="color:${scoreColor}; font-weight:600">${s.ktScore ?? '?'}</span>
          <span class="badge badge-xl">${xlLabel}</span>
          ${s.hasComment ? '<span class="badge badge-has">Đã có NX</span>' : ''}
          ${hasGen ? '<span class="badge badge-ok">✓ Đã sinh</span>' : ''}
        </div>
        ${hasGen ? `<div class="preview-text">${generated[s.hocSinhId]}</div>` : ''}
      </div>`;
  }).join('');
}

// ── Resume batch ──────────────────────────────────────
function resumeBatch() {
  const btn = document.getElementById('btn-generate-all');
  const progress = document.getElementById('progress');
  btn.disabled = true;
  progress.style.display = 'block';

  const pollInterval = setInterval(async () => {
    const { batchStatus: bs } = await chrome.storage.local.get('batchStatus');
    if (!bs) return;
    if (bs.running) {
      progress.textContent = `⏳ Đang sinh ${bs.done + 1}/${bs.total}: ${bs.current || ''}...`;
    } else {
      clearInterval(pollInterval);
      Object.assign(generated, bs.generated);
      progress.textContent = bs.fatalError
        ? `❌ ${bs.fatalError}`
        : `✅ Hoàn thành: ${bs.done} nhận xét`;
      renderStudentList();
      if (bs.done > 0) document.getElementById('btn-fill-all').disabled = false;
      btn.disabled = false;
    }
  }, 1000);
}

// ── Generate ──────────────────────────────────────────
document.getElementById('btn-generate-all').addEventListener('click', async () => {
  if (students.length === 0) return showToast('⚠️ Chưa đọc dữ liệu từ trang');

  const onlyEmpty = document.getElementById('chk-only-empty').checked;
  const targets = onlyEmpty ? students.filter(s => !s.hasComment) : students;
  if (targets.length === 0) return showToast('ℹ️ Tất cả đã có nhận xét');

  const btn = document.getElementById('btn-generate-all');
  const progress = document.getElementById('progress');
  btn.disabled = true;
  progress.style.display = 'block';
  progress.textContent = '⏳ Đang sinh nhận xét...';
  document.getElementById('preview-sample').style.display = 'none';

  await chrome.storage.local.remove('batchStatus');
  chrome.runtime.sendMessage({ type: 'GEMINI_GENERATE_BATCH', targets, monHoc: subjectInfo.monHoc || 'môn học', lop: subjectInfo.lop });

  const pollInterval = setInterval(async () => {
    const { batchStatus } = await chrome.storage.local.get('batchStatus');
    if (!batchStatus) return;
    if (batchStatus.running) {
      progress.textContent = `⏳ Đang sinh ${batchStatus.done + 1}/${batchStatus.total}...`;
    } else {
      clearInterval(pollInterval);
      Object.assign(generated, batchStatus.generated);
      const sample = Object.values(batchStatus.generated || {})[0];
      if (sample) {
        const box = document.getElementById('preview-sample');
        const textEl = document.getElementById('preview-sample-text');
        if (textEl) textEl.textContent = sample;
        box.style.display = 'block';
      }
      progress.style.display = 'none';
      document.getElementById('btn-fill-all').disabled = false;
      btn.disabled = false;
      showToast(`✅ Đã sinh ${batchStatus.done} nhận xét`);
    }
  }, 800);
});

// ── Điền nhận xét ─────────────────────────────────────
document.getElementById('btn-fill-all').addEventListener('click', async () => {
  if (Object.keys(generated).length === 0) return showToast('⚠️ Chưa sinh nhận xét');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const comments = Object.entries(generated).map(([hocSinhId, text]) => {
    const s = students.find(x => x.hocSinhId === hocSinhId);
    return { hocSinhId, suffix: s?.suffix || 'ck2', text };
  });
  try {
    const res = await sendToTab(tab.id, { type: 'FILL_ALL', comments });
    showToast(`✅ Đã điền ${res.filled}/${comments.length} nhận xét vào trang`);
  } catch (e) {
    showToast('❌ ' + e.message);
  }
});

// ── Điền Sổ CN ────────────────────────────────────────
document.getElementById('btn-fill-chunhiem').addEventListener('click', async () => {
  if (!cachedThongKe) return showToast('⚠️ Chưa đọc dữ liệu');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    const pageRes = await sendToTab(tab.id, { type: 'DETECT_PAGE' });
    if (pageRes?.page !== 'so_chu_nhiem') return showToast('⚠️ Hãy mở trang "Quản lý sổ chủ nhiệm" trước');
    const res = await sendToTab(tab.id, { type: 'FILL_SO_CHU_NHIEM', thongKe: cachedThongKe });
    showToast(`✅ Đã điền ${res.filled} ô vào Sổ CN`);
  } catch (e) {
    showToast('❌ ' + e.message);
  }
});

// ── Render thống kê ───────────────────────────────────
function renderThongKe(tk, total) {
  document.getElementById('thongke-preview').style.display = 'block';
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
  const td = 'padding:2px 4px;font-size:11px';
  const th = 'padding:2px 4px;background:#e8f0fe;text-align:center';

  let html = '<b>Năng lực / Phẩm chất:</b>';
  html += `<table style="width:100%;border-collapse:collapse;margin-top:4px">
    <tr><td style="${th};text-align:left"><b>Tiêu chí</b></td>
    <td style="${th}"><b>Tốt</b></td><td style="${th}"><b>Đạt</b></td><td style="${th}"><b>Cần CG</b></td></tr>`;
  Object.entries(tk.nlpc).forEach(([key, s]) => {
    html += `<tr style="border-bottom:1px solid #f0f4f8">
      <td style="${td}">${nlLabels[key] || key}</td>
      <td style="${td};text-align:center;color:#2e7d32">${s.tot} (${s.totPct}%)</td>
      <td style="${td};text-align:center;color:#1565c0">${s.dat} (${s.datPct}%)</td>
      <td style="${td};text-align:center;color:#e65100">${s.can} (${s.canPct}%)</td></tr>`;
  });
  html += '</table><br><b>Môn học:</b>';
  html += `<table style="width:100%;border-collapse:collapse;margin-top:4px">
    <tr><td style="${th};text-align:left"><b>Môn</b></td>
    <td style="${th}"><b>HTT</b></td><td style="${th}"><b>HT</b></td><td style="${th}"><b>CHT</b></td></tr>`;
  Object.entries(tk.monThongKe).forEach(([id, s]) => {
    html += `<tr style="border-bottom:1px solid #f0f4f8">
      <td style="${td}">${monLabels[id] || id}</td>
      <td style="${td};text-align:center;color:#2e7d32">${s.htt}</td>
      <td style="${td};text-align:center;color:#1565c0">${s.ht}</td>
      <td style="${td};text-align:center;color:#e65100">${s.cht}</td></tr>`;
  });
  html += '</table>';
  document.getElementById('thongke-content').innerHTML = html;
}

// ── Reload button ─────────────────────────────────────
document.getElementById('btn-reload').addEventListener('click', () => autoRead());

// ── NLPC ───────────────────────────────────────────
let nlpcStudents = [];
let nlpcGenerated = {}; // { hocSinhId: { nl_chung: '...', tu_chu: '...' } }

const FIELD_NAME_MAP = {
  nl_chung: '3_1', tu_chu: '1_4', giao_tiep: '1_5', gqvd: '1_6',
  ngon_ngu: '1_7', tinh_toan: '1_8', khoa_hoc: '1_9', tham_mi: '1_12',
  the_chat: '1_13', nl_dac_thu: '3_3', pc_chung: '3_2',
  yeu_nuoc: '2_6', nhan_ai: '2_7', cham_chi: '2_8',
  trung_thuc: '2_9', trach_nhiem: '2_10'
};

function getCheckedFields() {
  return [...document.querySelectorAll('.nlpc-chk:checked')].map(c => c.value);
}

async function readNlpc(tabId) {
  const res = await sendToTab(tabId, { type: 'READ_NLPC_STUDENTS' });
  nlpcStudents = res.students || [];
  nlpcGenerated = {};
  const info = document.getElementById('nlpc-info');
  info.textContent = nlpcStudents.length ? `${nlpcStudents.length} học sinh` : 'Chưa có dữ liệu';
  document.getElementById('btn-nlpc-single').disabled = true;
  document.getElementById('btn-nlpc-batch').disabled = nlpcStudents.length === 0;
  renderNlpcList();
}

function renderNlpcList() {
  const list = document.getElementById('nlpc-student-list');
  if (!nlpcStudents.length) {
    list.innerHTML = '<div class="empty-state">Chưa có danh sách học sinh</div>';
    return;
  }
  list.innerHTML = nlpcStudents.map(s => {
    const hasGen = nlpcGenerated[s.index];
    return `<div class="student-row ${hasGen ? 'done' : ''}" data-index="${s.index}" style="cursor:pointer">
      <div class="student-name">${s.hoTen}</div>
      ${hasGen ? '<div style="font-size:10px;color:#2e7d32">✓ Đã sinh</div>' : ''}
    </div>`;
  }).join('');

  list.querySelectorAll('.student-row').forEach(row => {
    row.addEventListener('click', () => {
      list.querySelectorAll('.student-row').forEach(r => r.style.background = '');
      row.style.background = '#e8f0fe';
      document.getElementById('btn-nlpc-single').disabled = false;
      document.getElementById('btn-nlpc-single').dataset.index = row.dataset.index;
    });
  });
}

async function nlpcGenerate(indices) {
  const fields = getCheckedFields();
  if (!fields.length) return showToast('⚠️ Chưa chọn ô nào');
  const tab = await getActiveTab();
  const progress = document.getElementById('nlpc-progress');
  progress.style.display = 'block';
  document.getElementById('btn-nlpc-single').disabled = true;
  document.getElementById('btn-nlpc-batch').disabled = true;

  for (let i = 0; i < indices.length; i++) {
    const index = indices[i];
    const s = nlpcStudents.find(x => x.index === index);
    progress.textContent = `⏳ Đang sinh ${i + 1}/${indices.length}: ${s?.hoTen || ''}...`;

    const { xepLoaiMap } = await sendToTab(tab.id, { type: 'NLPC_CLICK_STUDENT', index });

    const res = await chrome.runtime.sendMessage({ type: 'NLPC_GENERATE', fields, xepLoaiMap: xepLoaiMap || {} });
    nlpcGenerated[index] = res.result;

    await sendToTab(tab.id, { type: 'NLPC_FILL_ONE', hocSinhId: s.hocSinhId, data: res.result });
  }

  progress.textContent = `✅ Hoàn thành ${indices.length} học sinh`;
  document.getElementById('btn-nlpc-batch').disabled = false;
  renderNlpcList();
}

document.getElementById('btn-nlpc-single').addEventListener('click', async () => {
  const index = parseInt(document.getElementById('btn-nlpc-single').dataset.index);
  if (isNaN(index)) return;
  await nlpcGenerate([index]);
});

document.getElementById('btn-nlpc-batch').addEventListener('click', async () => {
  if (!nlpcStudents.length) return;
  await nlpcGenerate(nlpcStudents.map(s => s.index));
});

// ── Khởi động ─────────────────────────────────────────
autoRead();

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'PAGE_CHANGED') autoRead();
});

// ── License ───────────────────────────────────────────
document.getElementById('btn-activate').addEventListener('click', async () => {
  const key = document.getElementById('license-input').value.trim();
  const msg = document.getElementById('license-msg');
  if (!key) { msg.style.color = '#e65100'; msg.textContent = 'Vui lòng nhập key'; return; }
  msg.style.color = '#666'; msg.textContent = 'Đang kiểm tra...';
  const ok = await activateLicense(key);
  if (ok.valid) {
    const exp = ok.expDate.toLocaleDateString('vi-VN');
    msg.style.color = '#2e7d32'; msg.textContent = `✅ Kích hoạt thành công! Hết hạn: ${exp}`;
    setTimeout(() => autoRead(), 1000);
  } else {
    msg.style.color = '#c62828'; msg.textContent = `❌ ${ok.reason}`;
  }
});
