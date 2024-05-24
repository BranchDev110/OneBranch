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
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
        onResize && onResize({ width, height });
      }
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    const handleWindowResize = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setDimensions({ width, height });
        onResize && onResize({ width, height });
      }
    };

    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [ref, onResize]);

  return { dimensions };
};

export default useMeasure;
