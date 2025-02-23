import { ref, Ref, onMounted, onUnmounted, watch } from "vue"


// useContextMenu.js
export function useContextMenu(containerRef:Ref<HTMLElement>) {
    const x = ref(0);
    const y = ref(0);
    const isVisible = ref(false);

    function openMenu(e:MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        const closeContextMenu = new Event('closeContextMenu');
        window.dispatchEvent(closeContextMenu);
        isVisible.value = true;
        x.value = e.clientX;
        y.value = e.clientY;
    }

    function closeMenu() {
        isVisible.value = false;
    }

    function setupListeners() {
        if (containerRef.value) {
            containerRef.value.addEventListener('contextmenu', openMenu);
            window.addEventListener('closeContextMenu', closeMenu);
            window.addEventListener('click', closeMenu);
            window.addEventListener('scroll', closeMenu);
            window.addEventListener('contextmenu', closeMenu);
        }
    }

    function teardownListeners() {
        if (containerRef.value) {
            containerRef.value.removeEventListener('contextmenu', openMenu);
            window.removeEventListener('closeContextMenu', closeMenu);
            window.removeEventListener('click', closeMenu);
            window.removeEventListener('contextmenu', closeMenu);
        }
    }

    onMounted(() => setupListeners());
    onUnmounted(() => teardownListeners());

    watch(containerRef, (_) => {
        teardownListeners();
        setupListeners();
    });
    return {
        x,
        y,
        isVisible
    };
}