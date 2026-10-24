import { ref, watch, type Ref } from "vue";

// Follow the rendered active line, including space reserved for axis labels.
export function useChartTooltip(container: Ref<HTMLElement | null>) {
  const x = ref(0);
  watch(
    container,
    (element, _, onCleanup) => {
      if (!element) return;
      const update = () => {
        const line = element.querySelector<SVGLineElement>(".active-line");
        const bounds = element.getBoundingClientRect();
        if (!line || !bounds.width) return;
        x.value =
          ((line.getBoundingClientRect().left - bounds.left) *
            element.clientWidth) /
          bounds.width;
      };
      const observer = new MutationObserver(update);
      observer.observe(element, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["x1"],
      });
      update();
      onCleanup(() => observer.disconnect());
    },
    { flush: "post" },
  );
  return x;
}
