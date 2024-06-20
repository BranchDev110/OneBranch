import "@testing-library/jest-dom";
import ResizeObserver from "resize-observer-polyfill";

Object.defineProperty(URL, "createObjectURL", {
  writable: true,
  value: jest.fn(),
});

global.ResizeObserver = ResizeObserver;
