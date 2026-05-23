// Service worker - Manifest V3
// Hiện tại chỉ cần để extension hoạt động đúng
chrome.runtime.onInstalled.addListener(() => {
  console.log('VnEdu Nhận Xét AI installed');
});
