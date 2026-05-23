// Content script chạy trên *.vnedu.vn
// Lắng nghe message từ popup để fill text

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'FILL_TEXT') {
    const result = fillText(msg.text, msg.selector);
    sendResponse(result);
  }
  if (msg.type === 'GET_FOCUSED') {
    const el = document.activeElement;
    const isInput = el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' || el.contentEditable === 'true');
    sendResponse({ selector: isInput ? getSelector(el) : null });
  }
  return true;
});

function fillText(text, customSelector) {
  const selectors = customSelector
    ? [customSelector]
    : [
        'textarea:focus',
        'textarea[class*="comment"]',
        'textarea[placeholder*="nhận xét"]',
        '.ant-input:focus',
        'textarea.ant-input',
        '[contenteditable="true"]:focus',
        'textarea'
      ];

  for (const sel of selectors) {
    let el;
    try { el = document.querySelector(sel); } catch { continue; }
    if (!el) continue;

    el.focus();

    if (el.contentEditable === 'true') {
      el.textContent = text;
    } else {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, 'value'
      )?.set;
      if (nativeSetter) nativeSetter.call(el, text);
      else el.value = text;
    }

    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return { success: true };
  }

  return { success: false };
}

function getSelector(el) {
  if (el.id) return `#${el.id}`;
  if (el.className) return `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`;
  return el.tagName.toLowerCase();
}
