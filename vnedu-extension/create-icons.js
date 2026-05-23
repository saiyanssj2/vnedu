const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Tao PNG tu raw pixel data
function createPNG(size, drawFn) {
  const pixels = new Uint8Array(size * size * 4); // RGBA

  // Fill background gradient (xanh dam -> xanh nhat)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      // Bo tron goc
      const cx = x - size / 2, cy = y - size / 2;
      const r = size * 0.15; // border radius
      const inRounded =
        (x >= r && x <= size - r) ||
        (y >= r && y <= size - r) ||
        (Math.sqrt((x < r ? (x-r)**2 : x > size-r ? (x-(size-r))**2 : 0) +
                   (y < r ? (y-r)**2 : y > size-r ? (y-(size-r))**2 : 0)) <= r);

      if (!inRounded) {
        pixels[idx+3] = 0; // transparent
        continue;
      }

      // Gradient: #1565c0 -> #0d47a1 theo chieu doc
      const t = y / size;
      pixels[idx]   = Math.round(21  + (13  - 21)  * t); // R
      pixels[idx+1] = Math.round(101 + (71  - 101) * t); // G
      pixels[idx+2] = Math.round(192 + (161 - 192) * t); // B
      pixels[idx+3] = 255;
    }
  }

  drawFn(pixels, size);

  // Encode PNG
  const rowSize = 1 + size * 4;
  const raw = Buffer.alloc(size * rowSize);
  for (let y = 0; y < size; y++) {
    raw[y * rowSize] = 0; // filter none
    for (let x = 0; x < size; x++) {
      const src = (y * size + x) * 4;
      const dst = y * rowSize + 1 + x * 4;
      raw[dst]   = pixels[src];
      raw[dst+1] = pixels[src+1];
      raw[dst+2] = pixels[src+2];
      raw[dst+3] = pixels[src+3];
    }
  }

  const compressed = zlib.deflateSync(raw);

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

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // RGBA

  return Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// Ve pixel voi anti-alias don gian
function setPixel(pixels, size, x, y, r, g, b, a = 255) {
  x = Math.round(x); y = Math.round(y);
  if (x < 0 || x >= size || y < 0 || y >= size) return;
  const idx = (y * size + x) * 4;
  const alpha = a / 255;
  pixels[idx]   = Math.round(pixels[idx]   * (1-alpha) + r * alpha);
  pixels[idx+1] = Math.round(pixels[idx+1] * (1-alpha) + g * alpha);
  pixels[idx+2] = Math.round(pixels[idx+2] * (1-alpha) + b * alpha);
  pixels[idx+3] = Math.min(255, pixels[idx+3] + a);
}

// Ve hinh chu nhat bo tron (stroke)
function drawRoundRect(pixels, size, x, y, w, h, r, thickness, cr, cg, cb) {
  for (let t = 0; t < thickness; t++) {
    const xi = x+t, yi = y+t, wi = w-t*2, hi = h-t*2, ri = Math.max(1, r-t);
    // 4 canh
    for (let i = xi+ri; i <= xi+wi-ri; i++) {
      setPixel(pixels, size, i, yi, cr, cg, cb);
      setPixel(pixels, size, i, yi+hi, cr, cg, cb);
    }
    for (let i = yi+ri; i <= yi+hi-ri; i++) {
      setPixel(pixels, size, xi, i, cr, cg, cb);
      setPixel(pixels, size, xi+wi, i, cr, cg, cb);
    }
    // 4 goc tron
    for (let angle = 0; angle <= 90; angle += 1) {
      const rad = angle * Math.PI / 180;
      const px = Math.cos(rad) * ri, py = Math.sin(rad) * ri;
      setPixel(pixels, size, xi+ri-px, yi+ri-py, cr, cg, cb);
      setPixel(pixels, size, xi+wi-ri+px, yi+ri-py, cr, cg, cb);
      setPixel(pixels, size, xi+ri-px, yi+hi-ri+py, cr, cg, cb);
      setPixel(pixels, size, xi+wi-ri+px, yi+hi-ri+py, cr, cg, cb);
    }
  }
}

// Fill hinh chu nhat bo tron
function fillRoundRect(pixels, size, x, y, w, h, r, cr, cg, cb, ca=255) {
  for (let py = y; py <= y+h; py++) {
    for (let px = x; px <= x+w; px++) {
      let inside = false;
      if (px >= x+r && px <= x+w-r) inside = true;
      else if (py >= y+r && py <= y+h-r) inside = true;
      else {
        const corners = [[x+r,y+r],[x+w-r,y+r],[x+r,y+h-r],[x+w-r,y+h-r]];
        for (const [cx,cy] of corners) {
          if (Math.sqrt((px-cx)**2+(py-cy)**2) <= r) { inside = true; break; }
        }
      }
      if (inside) setPixel(pixels, size, px, py, cr, cg, cb, ca);
    }
  }
}

// Ve duong ke ngang (dong van ban)
function drawLine(pixels, size, x1, y, x2, cr, cg, cb, ca=255) {
  for (let x = x1; x <= x2; x++) setPixel(pixels, size, x, y, cr, cg, cb, ca);
}

function drawIcon(pixels, size) {
  const s = size / 48; // scale factor (base 48px)
  const W = 255, A = 230; // white, white semi

  // Icon: to giay voi 3 dong ke va tia sang AI

  // To giay (paper)
  const px = Math.round(10*s), py = Math.round(8*s);
  const pw = Math.round(28*s), ph = Math.round(32*s);
  const pr = Math.round(4*s);
  fillRoundRect(pixels, size, px, py, pw, ph, pr, W, W, W, 240);

  // Goc gap (dog-ear) goc tren phai
  const foldSize = Math.round(8*s);
  // Ve tam giac che goc
  for (let fy = 0; fy < foldSize; fy++) {
    for (let fx = 0; fx < foldSize - fy; fx++) {
      setPixel(pixels, size, px+pw-foldSize+fx, py+fy, 21, 101, 192, 255);
    }
  }
  // Duong cheo goc gap
  for (let i = 0; i <= foldSize; i++) {
    const alpha = 180;
    setPixel(pixels, size, px+pw-foldSize+i, py+foldSize-i, 150, 180, 220, alpha);
  }

  // 3 dong ke (lines) tren giay
  const lineX1 = Math.round(14*s), lineX2 = Math.round(32*s);
  const lineY1 = Math.round(18*s), lineY2 = Math.round(24*s), lineY3 = Math.round(30*s);
  const lh = Math.max(1, Math.round(2*s));
  const lc = 180; // mau xam nhat

  for (let t = 0; t < lh; t++) {
    drawLine(pixels, size, lineX1, lineY1+t, lineX2-Math.round(6*s), lc, lc, lc, 200);
    drawLine(pixels, size, lineX1, lineY2+t, lineX2, lc, lc, lc, 200);
    drawLine(pixels, size, lineX1, lineY3+t, lineX2-Math.round(4*s), lc, lc, lc, 200);
  }

  // Badge "AI" goc duoi phai (hinh tron nho mau vang)
  const bx = Math.round(30*s), by = Math.round(30*s), br = Math.round(9*s);
  for (let dy = -br; dy <= br; dy++) {
    for (let dx = -br; dx <= br; dx++) {
      if (dx*dx + dy*dy <= br*br) {
        // Gradient vang -> cam
        const t = (dy + br) / (br * 2);
        const r = Math.round(255);
        const g = Math.round(193 - t * 30);
        const b = Math.round(7);
        setPixel(pixels, size, bx+dx, by+dy, r, g, b, 255);
      }
    }
  }

  // Chu "AI" trong badge (don gian bang pixel)
  const fs2 = Math.max(1, Math.round(4*s));
  // A: 2 duong cheo + 1 ngang
  const ax = bx - Math.round(3.5*s), ay = by - Math.round(2*s);
  for (let i = 0; i <= fs2*2; i++) {
    const t = i / (fs2*2);
    setPixel(pixels, size, Math.round(ax - fs2*t), Math.round(ay + i), 255,255,255,255);
    setPixel(pixels, size, Math.round(ax + fs2*t), Math.round(ay + i), 255,255,255,255);
  }
  for (let i = -Math.round(fs2*0.5); i <= Math.round(fs2*0.5); i++) {
    setPixel(pixels, size, ax+i, ay+fs2, 255,255,255,255);
  }
  // I: 1 duong thang
  const ix = bx + Math.round(2*s), iy = by - Math.round(2*s);
  for (let i = 0; i <= fs2*2; i++) {
    setPixel(pixels, size, ix, iy+i, 255,255,255,255);
    if (size >= 48) setPixel(pixels, size, ix+1, iy+i, 255,255,255,255);
  }
}

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir);

[16, 48, 128].forEach(size => {
  const png = createPNG(size, drawIcon);
  fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), png);
  console.log(`Created icon${size}.png (${size}x${size})`);
});
