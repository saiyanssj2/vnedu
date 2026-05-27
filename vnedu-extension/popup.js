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
  ['nhanxet', 'chunhiem', 'unknown'].forEach(p =>
    document.getElementById(`panel-${p}`).style.display = p === name ? 'block' : 'none'
  );
  document.body.style.width = name === 'unknown' ? '200px' : '420px';
}

// ── Auto-detect và đọc dữ liệu ───────────────────────
async function autoRead() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url?.includes('vnedu.vn')) {
    document.getElementById('page-label').textContent = 'Hãy mở trang vnedu.vn';
    showPanel('unknown');
    return;
  }

  try {
    const { page } = await sendToTab(tab.id, { type: 'DETECT_PAGE' });

    if (page === 'so_nhan_xet' || page === 'unknown') {
      await readNhanXet(tab.id);
    } else if (page === 'diem_tong_ket') {
      await readDiemTongKet(tab.id);
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

  if (students.length === 0) {
    document.getElementById('page-label').textContent = 'Sổ nhận xét';
    document.getElementById('subject-info').textContent = 'Không tìm thấy danh sách học sinh';
    document.getElementById('student-list').innerHTML = '<div class="empty-state">Không tìm thấy học sinh trên trang này</div>';
    document.getElementById('btn-generate-all').disabled = true;
    showPanel('nhanxet');
    return;
  }

  document.getElementById('page-label').textContent = 'Sổ nhận xét';
  document.getElementById('btn-generate-all').disabled = false;
  renderStudentList();
  showPanel('nhanxet');

  // Resume nếu batch đang chạy
  const { batchStatus } = await chrome.storage.local.get('batchStatus');
  if (batchStatus?.running) resumeBatch();
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
  document.getElementById('subject-info').textContent =
    `${subjectInfo.monHoc || ''} — Lớp ${subjectInfo.lop || ''} | Chưa NX: ${chuaNx}/${students.length}`;

  document.getElementById('student-list').innerHTML = students.map(s => {
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

  await chrome.storage.local.remove('batchStatus');
  chrome.runtime.sendMessage({ type: 'GEMINI_GENERATE_BATCH', targets, monHoc: subjectInfo.monHoc || 'môn học', lop: subjectInfo.lop });

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

// ── Khởi động ─────────────────────────────────────────
autoRead();
