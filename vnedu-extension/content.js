// Content script chạy trên *.vnedu.vn

// ── Detect trang hiện tại ────────────────────────────
function detectPage() {
  const url = window.location.href;
  if (url.includes('tong_ket')) return 'diem_tong_ket';

  // Chỉ xét window đang active (không bị hidden)
  const activeWin = [...document.querySelectorAll('.x-layer.x-window')]
    .find(w => w.classList.contains('ux-desktop-active-win') && w.style.visibility !== 'hidden');

  if (!activeWin) return 'unknown';

  if (activeWin.querySelector('#nlchung, #tu_chu, #yeu_nuoc, #pcchung')) return 'pham_chat_nang_luc';
  if (activeWin.querySelector('.tong_ket_nam, input[name="nl_tcth"]')) return 'so_chu_nhiem';
  if (activeWin.querySelector('img.btGVSendSMS, textarea[t]')) return 'so_nhan_xet';

  const title = [...activeWin.querySelectorAll('.x-window-header-text')]
    .map(el => el.textContent.trim()).find(t => t.length > 0) || '';

  if (title.includes('Điểm tổng kết')) return 'diem_tong_ket';
  if (title.includes('chủ nhiệm') || title.includes('Chủ nhiệm')) return 'so_chu_nhiem';
  if (title.includes('Phẩm chất') || title.includes('ghi học bạ')) return 'pham_chat_nang_luc';
  return 'unknown';
}

// ── Đọc danh sách học sinh từ bảng ──────────────────
function readStudents() {
  const students = [];
  const rows = document.querySelectorAll('table tr[id]');

  rows.forEach(row => {
    const img = row.querySelector('img.btGVSendSMS');
    if (!img) return;

    const hocSinhId = img.getAttribute('hoc_sinh_id');
    const hoTen = img.getAttribute('ho_ten');
    if (!hocSinhId || !hoTen) return;

    // Lấy suffix từ textarea hoặc input có attribute t
    const anyEl = row.querySelector('textarea[t], input[t]');
    if (!anyEl) return;
    const suffix = anyEl.getAttribute('t');

    const ktInput = row.querySelector(`input[id="txt_${hocSinhId}_3_${suffix}"]`);
    const xlInput = row.querySelector(`input[id="txt_${hocSinhId}_4_${suffix}"]`);
    const nxTextarea = row.querySelector(`textarea[id="txt_${hocSinhId}_0_${suffix}"]`);

    if (!nxTextarea) return;

    const ktScore = ktInput ? parseFloat(ktInput.value) : null;
    const xlValue = xlInput ? xlInput.value.trim() : '';
    const currentNx = nxTextarea.value.trim();

    students.push({
      hocSinhId,
      hoTen,
      suffix,
      ktScore,
      xlValue,
      currentNx,
      hasComment: currentNx.length > 0
    });
  });

  return students;
}

// ── Lấy thông tin môn học từ header bảng ─────────────
function getSubjectInfo() {
  const activeWin = [...document.querySelectorAll('.x-layer.x-window')]
    .find(w => w.classList.contains('ux-desktop-active-win') && w.style.visibility !== 'hidden')
    || document.body;

  const getLabelInput = (labelText) => {
    const label = [...activeWin.querySelectorAll('label.x-form-item-label')]
      .find(l => l.textContent.trim().startsWith(labelText));
    return label?.nextElementSibling?.querySelector('input')?.value?.trim() || '';
  };

  const khoi = getLabelInput('Khối');
  const mon = getLabelInput('Môn').replace(/\s*-\s*Học kỳ.*$/i, '').trim();
  const hocKy = getLabelInput('Học kỳ');
  const lop = getLabelInput('Lớp');

  // Đọc kỳ (giữa kỳ/cuối kỳ) từ input có id chứa cboThang
  const ky = activeWin.querySelector('[id*="cboThang"] input')?.value?.trim() || '';

  return {
    monHoc: mon || 'môn học',
    lop,
    khoi,
    hocKy,
    ky,
    label: `Khối: ${khoi} - Môn: ${mon} - Học kỳ: ${hocKy}`
  };
}

// ── Điền nhận xét vào textarea ───────────────────────
function fillComment(hocSinhId, suffix, text) {
  const textarea = document.querySelector(`textarea[id="txt_${hocSinhId}_0_${suffix}"]`);
  if (!textarea) return false;

  textarea.focus();
  const nativeSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype, 'value'
  )?.set;
  if (nativeSetter) nativeSetter.call(textarea, text);
  else textarea.value = text;

  textarea.dispatchEvent(new Event('input', { bubbles: true }));
  textarea.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

// ── Đọc điểm tổng kết (diem_tong_ket) ───────────────
function readDiemTongKet() {
  const students = [];
  // Môn học map: vị trí cột td (0-based sau STT, tên, ngày sinh, nữ)
  // Cột 5=TV mức, 6=TV điểm, 7=Toán mức, 8=Toán điểm, 9=ĐĐ, 10=TNXH, 11=ÂN, 12=MT, 13=GDTC, 14=HĐTN
  const monCols = [
    { name: 'Tiếng Việt', mucIdx: 5, diemIdx: 6 },
    { name: 'Toán',       mucIdx: 7, diemIdx: 8 },
    { name: 'Đạo đức',   mucIdx: 9 },
    { name: 'TN-XH',     mucIdx: 10 },
    { name: 'Âm nhạc',   mucIdx: 11 },
    { name: 'Mĩ thuật',  mucIdx: 12 },
    { name: 'GDTC',      mucIdx: 13 },
    { name: 'HĐTN',      mucIdx: 14 },
  ];

  document.querySelectorAll('table tr[id]').forEach(row => {
    const maHs = row.id;
    if (!/^\d{10}$/.test(maHs)) return;

    const tds = row.querySelectorAll('td');
    if (tds.length < 10) return;

    // Tên: td[1] + td[2]
    const ho = tds[1]?.textContent?.trim() || '';
    const ten = tds[2]?.textContent?.trim() || '';
    const hoTen = (ho + ' ' + ten).trim();
    const isNu = tds[4]?.textContent?.trim() !== '';

    // Đọc điểm các môn (read-only td)
    const monDiem = {};
    monCols.forEach(mon => {
      const mucTd = tds[mon.mucIdx];
      const diemTd = mon.diemIdx ? tds[mon.diemIdx] : null;
      monDiem[mon.name] = {
        muc: mucTd?.textContent?.trim() || '',
        diem: diemTd?.textContent?.trim() || ''
      };
    });

    // Đọc hoc_sinh_id từ input có attribute a
    const anyInput = row.querySelector('input[a]');
    const hocSinhId = anyInput?.getAttribute('a') || '';

    // Đọc NL/PC hiện tại
    const nlInputs = {};
    row.querySelectorAll('input.txtInput[id]').forEach(inp => {
      nlInputs[inp.id] = inp.value;
    });

    // Lên lớp
    const lenLopInput = row.querySelector('input.txtInputSTL');
    const lenLop = lenLopInput?.value || '';

    // Ghi chú + Nhận xét
    const textareas = row.querySelectorAll('textarea.txtInputKT');
    const ghiChu = textareas[0]?.value || '';
    const nhanXet = textareas[1]?.value || '';

    students.push({ maHs, hocSinhId, hoTen, isNu, monDiem, nlInputs, lenLop, ghiChu, nhanXet });
  });

  return students;
}

// ── Tính thống kê cho sổ chủ nhiệm ───────────────────
function calcThongKe(students) {
  const total = students.length;
  const nuCount = students.filter(s => s.isNu).length;

  // NL/PC: đếm T(Tốt=3), Đ(Đạt=1/2), C(Cần cố gắng=2)
  // Các key NL: nl_tt27_1..8, PC: pc_tt27_1..5
  const nlKeys = ['nl_tt27_1','nl_tt27_2','nl_tt27_3','nl_tt27_4','nl_tt27_5','nl_tt27_6','nl_tt27_7','nl_tt27_8'];
  const pcKeys = ['pc_tt27_1','pc_tt27_2','pc_tt27_3','pc_tt27_4','pc_tt27_5'];

  // Map name input sang name trong so_chu_nhiem
  const nlNameMap = {
    'nl_tt27_1': 'nl_tcth', 'nl_tt27_2': 'nl_gtht', 'nl_tt27_3': 'nl_gqvdst',
    'nl_tt27_4': 'nl_nn',   'nl_tt27_5': 'nl_tt',   'nl_tt27_6': 'nl_kh',
    'nl_tt27_7': 'nl_tm',   'nl_tt27_8': 'nl_tc'
  };
  const pcNameMap = {
    'pc_tt27_1': 'pc_yn', 'pc_tt27_2': 'pc_nhanai', 'pc_tt27_3': 'pc_chamchi',
    'pc_tt27_4': 'pc_trungthuc', 'pc_tt27_5': 'pc_trachnhiem'
  };

  const count = (key, level) => {
    // level: 'T'=Tốt, 'D'=Đạt, 'C'=Cần cố gắng
    return students.filter(s => {
      // Tìm input có key trong nlInputs
      const inputKey = Object.keys(s.nlInputs).find(k => k.includes(key));
      if (!inputKey) return false;
      const val = (s.nlInputs[inputKey] || '').toUpperCase();
      if (level === 'T') return val === 'T';
      if (level === 'D') return val === 'D' || val === 'Đ';
      if (level === 'C') return val === 'C';
      return false;
    }).length;
  };

  const pct = (n) => total > 0 ? Math.round(n / total * 100) : 0;

  // NL/PC thống kê
  const nlpc = {};
  [...nlKeys, ...pcKeys].forEach(key => {
    const mapKey = nlNameMap[key] || pcNameMap[key];
    if (!mapKey) return;
    nlpc[mapKey] = {
      tot: count(key, 'T'), dat: count(key, 'D'), can: count(key, 'C'),
      totPct: pct(count(key, 'T')), datPct: pct(count(key, 'D')), canPct: pct(count(key, 'C'))
    };
  });

  // Môn học thống kê (HTT=T, HT=Đ, CHT=C)
  const monIds = { 'Tiếng Việt': '50', 'Toán': '51', 'Đạo đức': '56', 'TN-XH': '57', 'Âm nhạc': '58', 'Mĩ thuật': '59', 'GDTC': '97', 'HĐTN': '98' };
  const monThongKe = {};
  Object.entries(monIds).forEach(([monName, monId]) => {
    const htt = students.filter(s => s.monDiem[monName]?.muc === 'T').length;
    const ht  = students.filter(s => s.monDiem[monName]?.muc === 'Đ' || s.monDiem[monName]?.muc === 'D').length;
    const cht = students.filter(s => s.monDiem[monName]?.muc === 'C').length;
    monThongKe[monId] = { total, htt, ht, cht, httPct: pct(htt), htPct: pct(ht), chtPct: pct(cht) };
  });

  // Lên lớp
  const lenLop = students.filter(s => s.lenLop && s.lenLop !== '').length;

  return { total, nuCount, nlpc, monThongKe, lenLop };
}

// ── Fill sổ chủ nhiệm ─────────────────────────────────
function fillSoChuNhiem(thongKe) {
  let filled = 0;

  function setInput(selector, value) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.focus();
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
      || Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    if (nativeSetter) nativeSetter.call(el, String(value));
    else el.value = String(value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    filled++;
  }

  // NL/PC: rows data-type=0(Tốt), 30(Tỷ lệ Tốt), 1(Đạt), 31(Tỷ lệ Đạt), 2(Cần), 32(Tỷ lệ Cần)
  Object.entries(thongKe.nlpc).forEach(([name, stat]) => {
    setInput(`tr[data-type="0"] input[name="${name}"]`, stat.tot);
    setInput(`tr[data-type="30"] input[name="${name}"]`, stat.totPct);
    setInput(`tr[data-type="1"] input[name="${name}"]`, stat.dat);
    setInput(`tr[data-type="31"] input[name="${name}"]`, stat.datPct);
    setInput(`tr[data-type="2"] input[name="${name}"]`, stat.can);
    setInput(`tr[data-type="32"] input[name="${name}"]`, stat.canPct);
  });

  // Môn học
  Object.entries(thongKe.monThongKe).forEach(([monId, stat]) => {
    setInput(`.chitieu_giaoduc tr[data-type="3"] input[name="${monId}"]`, stat.total);
    setInput(`.chitieu_giaoduc tr[data-type="0"] input[name="${monId}"]`, stat.htt);
    setInput(`.chitieu_giaoduc tr[data-type="30"] input[name="${monId}"]`, stat.httPct);
    setInput(`.chitieu_giaoduc tr[data-type="1"] input[name="${monId}"]`, stat.ht);
    setInput(`.chitieu_giaoduc tr[data-type="31"] input[name="${monId}"]`, stat.htPct);
    setInput(`.chitieu_giaoduc tr[data-type="2"] input[name="${monId}"]`, stat.cht);
    setInput(`.chitieu_giaoduc tr[data-type="32"] input[name="${monId}"]`, stat.chtPct);
  });

  return filled;
}

// ── Lắng nghe message từ popup ───────────────────────
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'DETECT_PAGE') {
    sendResponse({ page: detectPage() });
  }

  if (msg.type === 'READ_STUDENTS') {
    sendResponse({
      students: readStudents(),
      subjectInfo: getSubjectInfo()
    });
  }

  if (msg.type === 'READ_DIEM_TONG_KET') {
    const students = readDiemTongKet();
    const thongKe = calcThongKe(students);
    sendResponse({ students, thongKe, total: students.length });
  }

  if (msg.type === 'FILL_SO_CHU_NHIEM') {
    const filled = fillSoChuNhiem(msg.thongKe);
    sendResponse({ success: true, filled });
  }

  if (msg.type === 'FILL_COMMENT') {
    const ok = fillComment(msg.hocSinhId, msg.suffix, msg.text);
    sendResponse({ success: ok });
  }

  if (msg.type === 'READ_NLPC_STUDENTS') {
    const students = [];
    document.querySelectorAll('.x-grid-row').forEach((row, i) => {
      const hoTen = row.querySelector('td:nth-child(2) .x-grid-cell-inner')?.textContent?.trim();
      const hocSinhId = row.querySelector('td:nth-child(3) .x-grid-cell-inner')?.textContent?.trim();
      if (!hoTen || !hocSinhId) return;
      students.push({ index: i, hoTen, hocSinhId });
    });
    sendResponse({ students });
  }

  if (msg.type === 'NLPC_CLICK_STUDENT') {
    const rows = document.querySelectorAll('.x-grid-row');
    const row = rows[msg.index];
    if (!row) { sendResponse({ ok: false }); return; }
    row.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    row.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    row.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    setTimeout(() => {
      const xepLoaiMap = {};
      const domMap = {
        nlchung: 'nl_chung', tu_chu: 'tu_chu', giao_tiep_hop_tac: 'giao_tiep',
        gqvd: 'gqvd', dac_thu: 'nl_dac_thu', ngon_ngu: 'ngon_ngu',
        tinh_toan: 'tinh_toan', khoa_hoc: 'khoa_hoc', tham_mi: 'tham_mi',
        the_chat: 'the_chat', pcchung: 'pc_chung', yeu_nuoc: 'yeu_nuoc',
        nhan_ai: 'nhan_ai', cham_chi: 'cham_chi', trung_thuc: 'trung_thuc',
        trach_nhiem: 'trach_nhiem'
      };
      Object.entries(domMap).forEach(([domId, field]) => {
        const xl = document.querySelector(`#${domId} label b`)?.textContent?.trim() || '';
        xepLoaiMap[field] = xl;
      });
      sendResponse({ ok: true, xepLoaiMap });
    }, 500);
    return true;
  }

  if (msg.type === 'NLPC_FILL_ONE') {
    (async () => {
    const nameMap = {
      nl_chung: '3_1', tu_chu: '1_4', giao_tiep: '1_5', gqvd: '1_6',
      ngon_ngu: '1_7', tinh_toan: '1_8', khoa_hoc: '1_9', tham_mi: '1_12',
      the_chat: '1_13', nl_dac_thu: '3_3', pc_chung: '3_2',
      yeu_nuoc: '2_6', nhan_ai: '2_7', cham_chi: '2_8',
      trung_thuc: '2_9', trach_nhiem: '2_10'
    };
    let filled = 0;
    Object.entries(msg.data).forEach(([field, text]) => {
      if (!text) return;
      const name = nameMap[field];
      const ta = document.querySelector(`textarea[name="${name}"]`);
      if (!ta) return;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      if (setter) setter.call(ta, text); else ta.value = text;
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.dispatchEvent(new Event('change', { bubbles: true }));
      filled++;
    });
    await new Promise(resolve => {
      const mb = document.getElementById('messagebox-1001');
      if (!mb) { 
        document.querySelector('[id*="btLuu"] button')?.click();
        setTimeout(resolve, 1000);
        return;
      }

      const currentLeft = parseInt(mb.style.left);
      
      const watchForShow = () => {
        const obs = new MutationObserver(() => {
          const left = parseInt(mb.style.left);
          if (!isNaN(left) && left > 0) {
            obs.disconnect();
            setTimeout(() => {
              document.getElementById('button-1009')?.querySelector('button')?.click();
              resolve();
            }, 150);
          }
        });
        obs.observe(mb, { attributes: true, attributeFilter: ['style'] });
        setTimeout(() => { obs.disconnect(); resolve(); }, 6000);
      };

      if (currentLeft > 0) {
        // Đang hiện, đợi nó ẩn đi rồi mới watch lại
        const obsHide = new MutationObserver(() => {
          const left = parseInt(mb.style.left);
          if (isNaN(left) || left < 0) {
            obsHide.disconnect();
            document.querySelector('[id*="btLuu"] button')?.click();
            watchForShow();
          }
        });
        obsHide.observe(mb, { attributes: true, attributeFilter: ['style'] });
        setTimeout(() => { obsHide.disconnect(); document.querySelector('[id*="btLuu"] button')?.click(); watchForShow(); }, 2000);
      } else {
        document.querySelector('[id*="btLuu"] button')?.click();
        watchForShow();
      }
    });
    sendResponse({ success: true, filled });
    })();
    return true;
  }

  if (msg.type === 'FILL_ALL') {
    let count = 0;
    msg.comments.forEach(c => {
      if (fillComment(c.hocSinhId, c.suffix, c.text)) count++;
    });
    sendResponse({ success: true, filled: count });
  }

  return true;
});

// ── Detect click → notify popup nếu page thay đổi ────────
(function watchPageChange() {
  let lastPage = null;
  let lastKhoi = null;
  let debounceTimer = null;

  function notifyIfChanged() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const page = detectPage();
      const khoi = document.querySelector('label.x-form-item-label')?.nextElementSibling?.querySelector('input')?.value || '';
      if (page !== lastPage || khoi !== lastKhoi) {
        lastPage = page;
        lastKhoi = khoi;
        try {
          chrome.runtime.sendMessage({ type: 'PAGE_CHANGED' });
        } catch {
          observer.disconnect();
        }
      }
    }, 400);
  }

  // Chỉ observe các desktop window — detect khi active win thay đổi
  const observer = new MutationObserver(() => notifyIfChanged());

  function observeWindows() {
    document.querySelectorAll('.x-layer.x-window').forEach(win => {
      if (!win._aiObserved) {
        win._aiObserved = true;
        observer.observe(win, { attributes: true, attributeFilter: ['class', 'style'] });
      }
    });
  }

  // Observe body childList để bắt window mới thêm vào
  const bodyObserver = new MutationObserver(() => {
    observeWindows();
    notifyIfChanged();
  });
  bodyObserver.observe(document.body, { childList: true });

  observeWindows();
  document.addEventListener('click', () => notifyIfChanged(), true);
})();

// ── Floating button mở side panel ────────────────────
(function injectFloatingBtn() {
  if (document.getElementById('vnedu-ai-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'vnedu-ai-btn';
  btn.textContent = '🤖 AI';
  Object.assign(btn.style, {
    position: 'fixed', bottom: '24px', right: '24px', zIndex: '999999',
    background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '24px',
    padding: '10px 18px', fontSize: '14px', fontWeight: 'bold',
    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
  });

  let panelOpen = false;

  btn.addEventListener('click', () => {
    if (panelOpen) {
      chrome.runtime.sendMessage({ type: 'CLOSE_SIDE_PANEL' });
      btn.textContent = '🤖 AI';
      Object.assign(btn.style, { background: '#1a73e8' });
      panelOpen = false;
    } else {
      chrome.runtime.sendMessage({ type: 'OPEN_SIDE_PANEL' });
      btn.textContent = '✖ Đóng AI';
      Object.assign(btn.style, { background: '#c62828' });
      panelOpen = true;
    }
  });

  document.body.appendChild(btn);
})();
