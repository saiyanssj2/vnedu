// ── License system ────────────────────────────────────
// Key format: VNAI-YYYYMMDD-XXXX-XXXX
// YYYYMMDD = ngày hết hạn
// Verify: SHA-256(key + SALT) phải nằm trong VALID_HASHES

const SALT = 'vnedu@AI#2025$secret!';

// Danh sách hash hợp lệ: SHA-256(key.toUpperCase() + SALT)
const VALID_HASHES = [
  // Thêm hash vào đây sau khi tạo key
  // Dùng hàm generateKeyHash() bên dưới để tạo
  '29134e6ff9f4cbd6a14cbef05d301aa0e90821c3abc118149547d626b498923e'
];

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyKey(key) {
  const k = key.trim().toUpperCase();

  // Kiểm tra format VNAI-YYYYMMDD-XXXX-XXXX
  const match = k.match(/^VNAI-(\d{8})-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  if (!match) return { valid: false, reason: 'Sai định dạng key' };

  // Kiểm tra ngày hết hạn
  const expStr = match[1]; // YYYYMMDD
  const exp = new Date(
    parseInt(expStr.slice(0, 4)),
    parseInt(expStr.slice(4, 6)) - 1,
    parseInt(expStr.slice(6, 8))
  );
  exp.setHours(23, 59, 59);
  if (new Date() > exp) return { valid: false, reason: 'Key đã hết hạn' };

  // Kiểm tra hash
  const hash = await sha256(k + SALT);
  if (!VALID_HASHES.includes(hash)) return { valid: false, reason: 'Key không hợp lệ' };

  return { valid: true, expDate: exp };
}

async function checkLicense() {
  const { licenseKey } = await chrome.storage.local.get('licenseKey');
  if (!licenseKey) return false;
  const result = await verifyKey(licenseKey);
  return result.valid;
}

async function activateLicense(key) {
  const result = await verifyKey(key);
  if (result.valid) {
    await chrome.storage.local.set({ licenseKey: key.trim().toUpperCase() });
  }
  return result;
}

// ── Dùng để tạo hash cho key mới (chạy trong console) ─
// async function generateKeyHash(key) {
//   const k = key.trim().toUpperCase();
//   const h = await sha256(k + SALT);
//   console.log(k, '->', h);
// }
