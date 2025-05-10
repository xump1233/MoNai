/**
 * 尝试将指定文本复制到剪贴板
 * @param text 要复制的文本内容
 * @returns Promise<boolean> 成功或失败的状态
 */
export default async function copyToClipboard(text: string): Promise<boolean> {
  // 优先尝试使用 Clipboard API（现代浏览器推荐）
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.warn("Clipboard API 复制失败，尝试使用 document.execCommand 回退", error);
      // 如果 Clipboard API 失败，回退到 execCommand
      return fallbackCopyTextToClipboard(text);
    }
  } else {
    // 如果不支持 Clipboard API，直接使用 execCommand
    return fallbackCopyTextToClipboard(text);
  }
}

/**
 * 使用 document.execCommand('copy') 实现复制（用于老浏览器）
 * @param text 要复制的文本内容
 * @returns boolean 成功或失败
 */
function fallbackCopyTextToClipboard(text: string): boolean {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // 使 textarea 不可见
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  textArea.style.left = "-9999px";
  textArea.style.opacity = "0";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("execCommand 复制失败", err);
    document.body.removeChild(textArea);
    return false;
  }
}