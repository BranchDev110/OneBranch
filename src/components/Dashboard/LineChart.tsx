import { useRef, useState, useMemo, useEffect } from "react";
import * as d3 from "d3";
import useMeasure from "@/hooks/useMeasure";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

const LineChart = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const axesRef = useRef<SVGGElement | null>(null);

  const [data] = useState([
    { x: 1, y: 90 },
    { x: 2, y: 12 },
    { x: 3, y: 34 },
    { x: 4, y: 53 },
    { x: 5, y: 52 },
    { x: 6, y: 9 },
    { x: 7, y: 18 },
    { x: 8, y: 78 },
    { x: 9, y: 28 },
    { x: 10, y: 34 },
  ]);

  const {
    dimensions: { width, height },
  } = useMeasure({
    ref,
  });

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [min, max] = d3.extent(data, (d) => d.y);

  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, max || 0])
      .range([boundsHeight, 0]);
  }, [data, height, boundsHeight, min, max]);

  // X axis
  const [xMin, xMax] = d3.extent(data, (d) => d.x);
  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, xMax || 0])
      .range([0, boundsWidth]);
  }, [data, width, boundsWidth, xMax, xMin]);

  // Render the X and Y axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator);

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g").call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);

  // Build the line
  const lineBuilder = d3
    .line<any>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  const linePath = lineBuilder(data);
  if (!linePath) {
    return null;
  }

  return (
    <div ref={ref} className="w-full h-full min-h-48">
      {width * height === 0 ? (
        <></>
      ) : (
        <svg className="" viewBox={` 0 0 ${width} ${height}`}>
          <g
            width={boundsWidth}
            height={boundsHeight}
            transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
          >
            <path
              d={linePath}
              opacity={1}
              fill="none"
              strokeWidth={2}
              className="stroke-c2-200"
            />
          </g>
          <g
            width={boundsWidth}
            height={boundsHeight}
            ref={axesRef}
            transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
          />
        </svg>
      )}
    </div>
  );
};

export default LineChart;
