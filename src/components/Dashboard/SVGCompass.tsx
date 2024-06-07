import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

const SVGGuage = ({ className = "", ...props }: ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 348 178"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("", className)}
    {...props}
  >
    <path
      d="M316.04 174c3.292 0 5.972-2.67 5.841-5.959a149 149 0 0 0-43.522-99.4A149 149 0 0 0 173 25 149 149 0 0 0 24.12 168.041c-.132 3.289 2.548 5.959 5.84 5.959s5.947-2.67 6.09-5.958A137.082 137.082 0 0 1 269.93 77.07a137.1 137.1 0 0 1 29.715 44.472 137 137 0 0 1 10.305 46.5c.144 3.288 2.798 5.958 6.09 5.958"
      fill="#000"
      fillOpacity={0.08}
    />
    {"//green"}
    <path
      d="M100.78 50.53c-1.662-2.84-5.32-3.807-8.092-2.033A149 149 0 0 0 24.12 167.992c-.133 3.289 2.547 5.96 5.839 5.961s5.947-2.668 6.091-5.957a137.08 137.08 0 0 1 62.66-109.2c2.767-1.785 3.731-5.424 2.069-8.266"
      fill="#1A932E"
    />
    {"//scale"}
    <path
      d="m.283 162.289 13.78.984M1.106 153.56l13.714 1.686M2.378 144.884l13.603 2.376M4.075 136.281l13.468 3.076M6.22 127.787l13.3 3.742M8.79 119.402l13.097 4.418m-10.094-12.661 12.836 5.083m-9.426-13.16 12.574 5.736M19.02 95.192l12.257 6.367M23.24 87.504l11.916 6.984m-7.318-14.449 11.553 7.578M32.81 72.82l11.155 8.16m-5.816-15.11 10.722 8.708M43.842 59.19l10.256 9.244M49.855 52.81l9.778 9.756m-3.446-15.82 9.266 10.246m-2.63-15.972 8.732 10.7m-1.811-16.09 8.174 11.132m14.1-25.086 6.388 12.252m1.483-16.124 5.752 12.555m2.298-16.021 5.104 12.836m3.117-15.896 4.445 13.081m3.916-15.704 3.776 13.28m4.71-15.486 3.095 13.457m5.492-15.226 2.402 13.6m6.27-14.928 1.699 13.707m7.024-14.589 1.007 13.78m7.746-14.222.305 13.806m8.468-13.798-.409 13.809m9.163-13.353-1.111 13.767m9.829-12.862-1.801 13.69m10.464-12.35-2.49 13.59m11.082-11.811-3.191 13.444M219.72 8.741l-3.867 13.252m12.232-10.615-4.544 13.049m12.753-9.973-5.198 12.8m13.249-9.315-5.851 12.516m13.703-8.627-6.469 12.198m14.122-7.921-7.087 11.857m28.593 3.258-8.812 10.64m15.435-4.902-9.335 10.174m15.654-4.093-9.836 9.685m15.842-3.298L289.978 68.6m16.008-2.49-10.781 8.639m16.102-1.673-11.199 8.07m16.158-.842-11.596 7.49m16.187-.024-11.97 6.898m16.178.804-12.308 6.273m16.109 1.622-12.611 5.648m16.006 2.435-12.88 4.989m15.861 3.265-13.115 4.318m15.678 4.068-13.326 3.649m15.455 4.847-13.491 2.979m15.174 5.628-13.621 2.286m14.871 6.396-13.716 1.584m14.529 7.14-13.79.892"
      stroke="#060606"
      strokeOpacity={0.3}
      strokeMiterlimit={10}
    />
    {"//numbers"}
    <path
      d="M12.18 171.112q0 1.656-1.272 2.436t-3.312.78q-2.1 0-3.324-.756-1.236-.756-1.236-2.46 0-3.204 4.56-3.204 2.076 0 3.336.78 1.248.78 1.248 2.424m-1.224 0q0-.984-.936-1.356-.948-.384-2.424-.384-1.548 0-2.448.372t-.9 1.368.9 1.38q.9.372 2.448.372 3.36 0 3.36-1.752m318.592-3.8 1.356-.384V176h-1.356zm6.901 8.868q-1.656 0-2.436-1.272t-.78-3.312q0-2.1.756-3.324.756-1.236 2.46-1.236 3.204 0 3.204 4.56 0 2.076-.78 3.336-.78 1.248-2.424 1.248m0-1.224q.984 0 1.356-.936.384-.948.384-2.424 0-1.548-.372-2.448t-1.368-.9-1.38.9q-.372.9-.372 2.448 0 3.36 1.752 3.36m7.89 1.224q-1.656 0-2.436-1.272t-.78-3.312q0-2.1.756-3.324.756-1.236 2.46-1.236 3.204 0 3.204 4.56 0 2.076-.78 3.336-.78 1.248-2.424 1.248m0-1.224q.984 0 1.356-.936.384-.948.384-2.424 0-1.548-.372-2.448t-1.368-.9-1.38.9q-.372.9-.372 2.448 0 3.36 1.752 3.36M82.542 36.14q.094-.938.079-1.685-.005-.752-.29-1.226-.345-.576-.833-.69-.484-.128-1.09.236-.555.334-.71.847t-.114 1.09l-1.266.061a4.25 4.25 0 0 1 .248-1.73q.301-.826 1.217-1.376 1.14-.687 2.107-.455.959.222 1.534 1.178.748 1.245.423 3.498l-.336 2.61 2.932-1.762.612 1.019-5.143 3.09zm8.55-.602a5 5 0 0 1-1.36.58q-.672.165-1.266.06l-.057-1.282q.344.06.904-.011.553-.081 1.098-.408.7-.42.907-1.077.212-.675-.197-1.352-.382-.639-1.041-.802-.655-.18-1.56.363a7 7 0 0 0-.917.664q-.454.385-.593.622l-2.232-4.063 3.878-2.33.605 1.007-2.756 1.657.973 1.851q.248-.261.815-.601 1.192-.717 2.248-.498 1.06.203 1.716 1.293.47.782.505 1.586a2.6 2.6 0 0 1-.377 1.515q-.43.707-1.294 1.226m171.912 5.744a5 5 0 0 1-1.15-.93 3.1 3.1 0 0 1-.648-1.088l1.106-.652q.108.331.433.793.331.45.877.778.7.42 1.376.295.694-.129 1.102-.808.382-.638.219-1.296-.149-.663-1.053-1.207a7 7 0 0 0-1.016-.498q-.553-.22-.828-.231l2.54-3.878 3.878 2.33-.606 1.008-2.756-1.656-1.178 1.728q.347.097.913.436 1.193.718 1.495 1.753.318 1.03-.337 2.121-.47.782-1.163 1.191a2.63 2.63 0 0 1-1.515.378q-.825-.048-1.689-.567m7.02 4.218q-1.42-.853-1.433-2.345t1.037-3.24q1.082-1.8 2.36-2.46 1.284-.67 2.745.207 2.747 1.65.398 5.559-1.069 1.779-2.387 2.458-1.311.667-2.72-.18m.63-1.05q.843.508 1.644-.103.817-.615 1.578-1.88.798-1.327.942-2.29t-.709-1.476-1.646.06q-.783.58-1.58 1.907-1.73 2.88-.229 3.783"
      fill="#000"
    />
    {"//yellow"}
    <path
      d="M231.323 43.39c1.342-3.005-.002-6.541-3.059-7.762A149 149 0 0 0 96.63 46.06c-2.826 1.687-3.597 5.391-1.798 8.148s5.485 3.52 8.318 1.843a137.07 137.07 0 0 1 120.25-9.53c3.061 1.21 6.581-.125 7.923-3.13"
      fill="#E5AE21"
    />
    {"//red"}
    <path
      d="M313.285 146.063c3.228-.643 5.336-3.785 4.565-6.985a149 149 0 0 0-85.013-101.535c-3.014-1.322-6.478.2-7.678 3.266s.318 6.51 3.328 7.843a137.08 137.08 0 0 1 77.662 92.756c.783 3.198 3.908 5.298 7.136 4.655"
      fill="#E65F2B"
    />
  </svg>
);
export default SVGGuage;
