import React, { useEffect, useState } from "react";

type Dimensions = {
  width: number;
  height: number;
};

interface Props {
  ref: React.MutableRefObject<HTMLElement | null>;
  onResize?: (dims: Dimensions) => void;
}

const useMeasure = ({ ref, onResize }: Props) => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    let resizeTimer: NodeJS.Timeout | null = null;

    const handleResize = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setDimensions({ width, height });
        onResize && onResize({ width, height });
      }
    };

    const debouncedHandleResize = () => {
      if (!resizeTimer) {
        resizeTimer = setTimeout(() => {
          handleResize();
          resizeTimer = null;
        }, 400);
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
        onResize && onResize({ width, height });
      }
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);

      handleResize();
    }

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", debouncedHandleResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, [ref, onResize]);

  console.log({ dimensions });

  return { dimensions };
};

export default useMeasure;
