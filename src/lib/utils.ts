import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fakeAPICall = () => {
  return new Promise((resolve, reject) => {
    // Simulating a delay of 1-3 seconds
    const delay = Math.floor(Math.random() * 3000) + 1000;
    setTimeout(() => {
      // Simulating success 80% of the time
      const isSuccess = Math.random() < 0.8;
      if (isSuccess) {
        resolve({ message: "Request successful!", token: "fakeToken123" });
      } else {
        reject(new Error("Request failed. Please try again later."));
      }
    }, delay);
  });
};
