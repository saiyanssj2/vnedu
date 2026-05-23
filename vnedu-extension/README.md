# VnEdu Nhận Xét AI - Chrome Extension

Extension hỗ trợ giáo viên sinh nhận xét học sinh bằng AI và tự động điền vào trang vnEdu.

---

## Cài đặt

1. Tải thư mục `vnedu-extension` về máy
2. Mở Chrome → truy cập `chrome://extensions/`
3. Bật **Developer mode** (góc trên phải)
4. Bấm **Load unpacked** → chọn thư mục `vnedu-extension`
5. Icon extension xuất hiện trên thanh công cụ Chrome

---

## Cấu hình API Key (bắt buộc)

1. Truy cập [Google AI Studio](https://aistudio.google.com/app/apikey) để lấy Gemini API Key **miễn phí**
2. Click icon extension → chọn tab **⚙️ Cài đặt**
3. Dán API Key vào ô → bấm **💾 Lưu API Key**
4. Trạng thái chuyển sang ✓ xanh là thành công

---

## Sử dụng

### Sinh nhận xét

1. Login vào [vnedu.vn](https://vnedu.vn) → mở trang nhập nhận xét học sinh
2. **Click vào ô nhận xét** trên trang trước (để extension biết cần điền vào đâu)
3. Click icon extension → tab **✨ Sinh nhận xét**
4. Điền thông tin học sinh:
   - Họ tên, giới tính
   - Môn học, cấp học
   - Học lực, hạnh kiểm
   - Điểm mạnh, điểm yếu
   - Phong cách & độ dài nhận xét
5. Bấm **✨ Sinh nhận xét** → chờ AI tạo nội dung
6. Bấm **⬇️ Điền vào trang** → nhận xét tự động điền vào ô trên vnEdu

### Copy thủ công

Nếu không muốn tự động điền, bấm **📋 Copy** → paste thủ công vào trang.

---

## Xử lý lỗi

### "Không tìm thấy ô nhập liệu"

vnEdu dùng nhiều loại input khác nhau tùy phiên bản. Cách fix:

1. Mở trang vnEdu → click vào ô nhận xét
2. Nhấn **F12** → tab **Elements**
3. Tìm thẻ `<textarea>` hoặc `<input>` đang được chọn
4. Copy class hoặc id của thẻ đó

   Ví dụ:
   ```
   <textarea class="ant-input comment-field"></textarea>
   ```
   → selector là `textarea.ant-input`

5. Vào tab **⚙️ Cài đặt** → dán selector vào ô **Selector ô nhận xét** → **💾 Lưu**

### "Chưa cài API Key"

Vào tab **⚙️ Cài đặt** → nhập Gemini API Key → Lưu.

### "Hãy mở trang vnedu.vn trước"

Extension chỉ hoạt động trên domain `*.vnedu.vn`. Đảm bảo đang ở đúng trang.

---

## Cấu trúc file

```
vnedu-extension/
├── manifest.json       # Cấu hình extension (Manifest V3)
├── popup.html          # Giao diện popup
├── popup.js            # Logic sinh nhận xét & fill
├── content.js          # Script chạy trên trang vnEdu
├── background.js       # Service worker
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## Công nghệ

| Thành phần | Chi tiết |
|---|---|
| Extension | Chrome Manifest V3 |
| AI | Google Gemini 2.0 Flash (miễn phí) |
| Ngôn ngữ | Vanilla JS, HTML, CSS |
| Lưu trữ | chrome.storage.local |
