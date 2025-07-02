import { ref, onUnmounted, computed } from "vue";
import usePageData from "@/hooks/usePageData";
import type { IComponentUnit } from "@/interface";

const SNAP_THRESHOLD = 2;
interface CanvasRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function useUnitMove(id: string): {
  mouseDown: (e: MouseEvent) => void;
  setSnapEnable: (enable: boolean) => void;
} {
  const {
    pageData,
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
  const enableSnap = ref<boolean>(true);
  const canvasRect = computed(():CanvasRect=>{
    return {
      top:0,
      left:0,
      width:pageData.value.pageContainer.width as number,
      height:pageData.value.pageContainer.height as number,
    }
  })

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
    let offsetTop = 0;
    let offsetLeft = 0;
  
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
      const { width: BWidth, height: BHeight } = unit.props as {
        width: number;
        height: number;
      };
  
      let newOffsetTop = offsetTop;
      let newOffsetLeft = offsetLeft;
  
      const BTop = top + offsetTop;
      const BLeft = left + offsetLeft;
  
      // === 1. 吸附组件逻辑 ===
      unFocusList.value.forEach((otherUnit: IComponentUnit) => {
        const { top: ATop, left: ALeft } = otherUnit.position as {
          top: number;
          left: number;
        };
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
  
      // === 2. 吸附画布逻辑 ===
      const canvasLinesY: [number, number, () => number][] = [
        [canvasRect.value.top, BTop, () => canvasRect.value.top - top],
        [canvasRect.value.top + canvasRect.value.height, BTop + BHeight, () => canvasRect.value.top + canvasRect.value.height - top - BHeight],
        [canvasRect.value.top + canvasRect.value.height / 2, BTop + BHeight / 2, () => canvasRect.value.top + canvasRect.value.height / 2 - top - BHeight / 2],
      ];
  
      const canvasLinesX: [number, number, () => number][] = [
        [canvasRect.value.left, BLeft, () => canvasRect.value.left - left],
        [canvasRect.value.left + canvasRect.value.width, BLeft + BWidth, () => canvasRect.value.left + canvasRect.value.width - left - BWidth],
        [canvasRect.value.left + canvasRect.value.width / 2, BLeft + BWidth / 2, () => canvasRect.value.left + canvasRect.value.width / 2 - left - BWidth / 2],
      ];
  
      for (const [a, b, adjust] of canvasLinesY) {
        if (Math.abs(a - b) < SNAP_THRESHOLD) {
          lines.y.add(a);
          if (enableSnap.value) newOffsetTop = adjust();
        }
      }
  
      for (const [a, b, adjust] of canvasLinesX) {
        if (Math.abs(a - b) < SNAP_THRESHOLD) {
          lines.x.add(a);
          if (enableSnap.value) newOffsetLeft = adjust();
        }
      }
  
      // === 3. 应用最终偏移 ===
      moveFocusUnit({
        offsetTop: newOffsetTop,
        offsetLeft: newOffsetLeft,
      });
  
      lastTop.value = (lastTop.value ?? e.clientY) + (newOffsetTop - offsetTop);
      lastLeft.value = (lastLeft.value ?? e.clientX) + (newOffsetLeft - offsetLeft);
    }
  
    // 展示辅助线
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
