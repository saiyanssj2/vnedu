// Content script chạy trên *.vnedu.vn

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

    // Xác định suffix: ck1 hay ck2 từ input đầu tiên tìm được
    const anyInput = row.querySelector('input.ktck');
    if (!anyInput) return;
    const suffix = anyInput.getAttribute('t'); // 'ck1' hoặc 'ck2'

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
  const text = document.body.innerText;
  const monMatch = text.match(/Môn học:\s*([^\n]+)/);
  const lopMatch = text.match(/Lớp:\s*([^\s]+)/);
  return {
    monHoc: monMatch ? monMatch[1].trim().replace(/- Học kỳ \d/, '').trim() : 'môn học',
    lop: lopMatch ? lopMatch[1].trim() : ''
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

// ── Lắng nghe message từ popup ───────────────────────
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'READ_STUDENTS') {
    sendResponse({
      students: readStudents(),
      subjectInfo: getSubjectInfo()
    });
  }

  if (msg.type === 'FILL_COMMENT') {
    const ok = fillComment(msg.hocSinhId, msg.suffix, msg.text);
    sendResponse({ success: ok });
  }

  if (msg.type === 'FILL_ALL') {
    // msg.comments = [{ hocSinhId, suffix, text }, ...]
    let count = 0;
    msg.comments.forEach(c => {
      if (fillComment(c.hocSinhId, c.suffix, c.text)) count++;
    });
    sendResponse({ success: true, filled: count });
  }

  return true;
});
