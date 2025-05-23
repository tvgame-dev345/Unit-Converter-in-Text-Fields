chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convertToMB",
    title: "Convert to MB",
    contexts: ["editable"]
  });

  chrome.contextMenus.create({
    id: "convertToGB",
    title: "Convert to GB",
    contexts: ["editable"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convertToMB") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: convertSelectedText,
      args: ["MB"]
    });
  } else if (info.menuItemId === "convertToGB") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: convertSelectedText,
      args: ["GB"]
    });
  }
});

function convertSelectedText(unit) {
  const active = document.activeElement;
  if (!active || (active.tagName !== "TEXTAREA" && active.tagName !== "INPUT")) return;

  const start = active.selectionStart;
  const end = active.selectionEnd;
  if (start === end) return;

  const selectedText = active.value.substring(start, end);
  const num = parseFloat(selectedText);
  if (isNaN(num)) return;

  let converted;
  if (unit === "MB") {
    converted = (num * 1024).toFixed(2);
  } else if (unit === "GB") {
    converted = (num / 1024).toFixed(2);
  }

  active.setRangeText(converted, start, end, "select");
}
