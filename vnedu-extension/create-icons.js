// Chạy: node create-icons.js
// Tạo icon PNG đơn giản không cần thư viện ngoài

const fs = require('fs');
const path = require('path');

// PNG minimal: blue square với chữ "AI"
// Dùng raw PNG bytes (1x1 pixel blue, scale lên bằng PNG metadata)
// Thực tế: tạo PNG hợp lệ bằng pure Node.js

function createSimplePNG(size) {
  // Tạo PNG với màu nền #1565c0 (21, 101, 192)
  const PNG_HEADER = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function crc32(buf) {
    let crc = 0xFFFFFFFF;
    const table = [];
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      table[i] = c;
    }
    for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const typeB = Buffer.from(type);
    const crcB = Buffer.alloc(4);
    crcB.writeUInt32BE(crc32(Buffer.concat([typeB, data])));
    return Buffer.concat([len, typeB, data, crcB]);
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  // IDAT: raw pixel data (filter byte 0 + RGB per row)
  const zlib = require('zlib');
  const rowSize = 1 + size * 3;
  const raw = Buffer.alloc(size * rowSize);
  for (let y = 0; y < size; y++) {
    const base = y * rowSize;
    raw[base] = 0; // filter none
    for (let x = 0; x < size; x++) {
      const px = base + 1 + x * 3;
      raw[px] = 21;   // R
      raw[px+1] = 101; // G
      raw[px+2] = 192; // B
    }
  }
  const compressed = zlib.deflateSync(raw);

  return Buffer.concat([
    PNG_HEADER,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir);

[16, 48, 128].forEach(size => {
  fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), createSimplePNG(size));
  console.log(`Created icon${size}.png`);
});
