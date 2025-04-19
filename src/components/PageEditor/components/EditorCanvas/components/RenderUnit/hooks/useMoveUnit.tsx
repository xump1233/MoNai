import { ref, onUnmounted } from "vue";
import usePageData from "@/hooks/usePageData";
import type { IComponentUnit } from "@/interface";

const SNAP_THRESHOLD = 2;

export default function useUnitMove(id: string): {
  mouseDown: (e: MouseEvent) => void;
  setSnapEnable: (enable: boolean) => void;
} {
  const {
    focusUnit,
    unFocusAllUnit,
    moveFocusUnit,
    isFocus,
    setLines,
    unFocusList,
    findUnit,
  } = usePageData();

  const lastTop = ref<number | undefined>();
  const lastLeft = ref<number | undefined>();
  const currentUnitId = ref<string | undefined>();
  const startX = ref<number | undefined>();
  const startY = ref<number | undefined>();
  const enableSnap = ref<boolean>(true); // 默认开启吸附

  function setSnapEnable(enable: boolean): void {
    enableSnap.value = enable;
  }

  function mouseDown(e: MouseEvent): void {
    e.stopPropagation();
    if (e.button !== 0) return;

    startX.value = e.clientX;
    startY.value = e.clientY;
    lastLeft.value = undefined;
    lastTop.value = undefined;

    if (isFocus(id)) {
      currentUnitId.value = id;
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
      return;
    }

    if (e.ctrlKey) {
      focusUnit(id);
    } else {
      unFocusAllUnit();
      focusUnit(id);
    }
  }

  function mouseMove(e: MouseEvent): void {
    let offsetTop: number = 0;
    let offsetLeft: number = 0;
  
    if (lastLeft.value !== undefined && lastTop.value !== undefined) {
      offsetTop = e.clientY - lastTop.value;
      offsetLeft = e.clientX - lastLeft.value;
    }
  
    lastTop.value = e.clientY;
    lastLeft.value = e.clientX;
  
    const { unit } = findUnit(currentUnitId.value as string);
    const lines: { x: Set<number>; y: Set<number> } = {
      x: new Set<number>(),
      y: new Set<number>(),
    };
  
    if (unit) {
      const { top, left } = unit.position as { top: number; left: number };
      const { width: BWidth, height: BHeight } = unit.props as { width: number; height: number };
  
      let newOffsetTop: number = offsetTop;
      let newOffsetLeft: number = offsetLeft;
  
      const BTop = top + offsetTop;
      const BLeft = left + offsetLeft;
  
      unFocusList.value.forEach((otherUnit: IComponentUnit) => {
        const { top: ATop, left: ALeft } = otherUnit.position as { top: number; left: number };
        const { width: AWidth, height: AHeight } = otherUnit.props as {
          width: number;
          height: number;
        };
  
        const ySnapPoints: [number, number, () => number][] = [
          [ATop, BTop, () => ATop - top],
          [ATop + AHeight, BTop, () => ATop + AHeight - top],
          [ATop + AHeight / 2, BTop + BHeight / 2, () => ATop + AHeight / 2 - top - BHeight / 2],
          [ATop, BTop + BHeight, () => ATop - top - BHeight],
          [ATop + AHeight, BTop + BHeight, () => ATop + AHeight - top - BHeight],
        ];
  
        const xSnapPoints: [number, number, () => number][] = [
          [ALeft, BLeft, () => ALeft - left],
          [ALeft + AWidth, BLeft, () => ALeft + AWidth - left],
          [ALeft + AWidth / 2, BLeft + BWidth / 2, () => ALeft + AWidth / 2 - left - BWidth / 2],
          [ALeft, BLeft + BWidth, () => ALeft - left - BWidth],
          [ALeft + AWidth, BLeft + BWidth, () => ALeft + AWidth - left - BWidth],
        ];
  
        for (const [a, b, adjust] of ySnapPoints) {
          if (Math.abs(a - b) < SNAP_THRESHOLD) {
            lines.y.add(a);
            if (enableSnap.value) newOffsetTop = adjust();
          }
        }
  
        for (const [a, b, adjust] of xSnapPoints) {
          if (Math.abs(a - b) < SNAP_THRESHOLD) {
            lines.x.add(a);
            if (enableSnap.value) newOffsetLeft = adjust();
          }
        }
      });
  
      moveFocusUnit({
        offsetTop: newOffsetTop,
        offsetLeft: newOffsetLeft,
      });
      
      // 修复吸附导致的拖拽跳动
      lastTop.value = (lastTop.value ?? e.clientY) + (newOffsetTop - offsetTop);
      lastLeft.value = (lastLeft.value ?? e.clientX) + (newOffsetLeft - offsetLeft);
      
    }
  
    // ✅ 无论是否启用吸附，都展示辅助线
    setLines(lines);
  }
  
  function mouseUp(): void {
    setLines(undefined);
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", mouseUp);
  }

  onUnmounted(() => {
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", mouseUp);
  });

  return {
    mouseDown,
    setSnapEnable,
  };
}
