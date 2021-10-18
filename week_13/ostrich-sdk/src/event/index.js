/**
 * 记录最后一次鼠标事件
 */
export function recordLastEvent() {
  ["click", "touchstart", "mousedown", "keydown", "mouseover"].forEach(
    (eventType) => {
      document.addEventListener(
        eventType,
        (event) => {
          window._lastEvent = event;
        },
        {
          capture: true, // 捕获阶段
          passive: true, // 默认不阻止默认事件
        }
      );
    }
  );
}
