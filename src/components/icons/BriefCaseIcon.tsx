import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

const BriefCaseIcon = ({ className = "", ...props }: ComponentProps<"svg">) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-5 h-5 ", className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.373 6.818C3.259 5.764 4.777 5.25 7 5.25h10c2.223 0 3.742.514 4.627 1.567.877 1.043.96 2.412.819 3.689l-.749 8.003c-.11 1.029-.369 2.156-1.287 2.995-.911.832-2.323 1.246-4.409 1.246H8c-2.087 0-3.499-.415-4.409-1.246-.919-.839-1.176-1.966-1.286-2.995l-.001-.01-.749-7.993c-.141-1.276-.057-2.647.819-3.689m1.149.964c-.472.561-.604 1.404-.477 2.565l.002.013.749 7.994c.099.929.307 1.586.805 2.042.506.463 1.465.853 3.398.853h8c1.933 0 2.892-.391 3.398-.853.499-.456.706-1.113.806-2.042l.751-8.007c.129-1.161-.004-2.004-.476-2.564-.465-.553-1.432-1.033-3.479-1.033H6.999c-2.047 0-3.013.48-3.478 1.032"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.793 4.051c-.041.325-.044.695-.044 1.15V6A.749.749 0 1 1 7.25 6v-.826c0-.423 0-.886.056-1.318.059-.447.183-.922.477-1.346.616-.892 1.747-1.26 3.417-1.26h1.6c1.67 0 2.8.368 3.417 1.26.293.424.419.899.477 1.346.057.432.057.895.057 1.318V6a.749.749 0 1 1-1.5 0v-.8c0-.455-.001-.825-.044-1.15-.041-.319-.117-.533-.224-.687-.183-.265-.653-.613-2.183-.613h-1.6c-1.529 0-2 .348-2.182.613-.108.154-.182.369-.224.687m1.956 8.7v1.28c0 .281.002.489.026.664.024.169.061.251.093.295.035.05.212.262 1.13.262.924 0 1.097-.213 1.132-.262a.66.66 0 0 0 .092-.3c.024-.178.026-.386.026-.669v-1.27zm.217-1.501h2.065c.221 0 .445 0 .628.021.185.021.496.076.744.325s.304.556.325.744c.02.182.02.407.02.628v1.064c0 .26 0 .567-.039.859-.04.302-.131.646-.349.96-.469.668-1.295.9-2.362.9-1.06 0-1.884-.229-2.354-.892a2.14 2.14 0 0 1-.355-.957 7 7 0 0 1-.04-.871v-1.063c0-.221 0-.446.02-.628.021-.187.076-.496.324-.744.249-.249.559-.304.745-.325.182-.021.407-.02.628-.02"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.257 10.56a.753.753 0 0 1-.166 1.047 17.24 17.24 0 0 1-7.997 3.157.751.751 0 0 1-.188-1.488 15.7 15.7 0 0 0 7.303-2.882.753.753 0 0 1 1.047.165m-20.255.288a.75.75 0 0 1 1.043-.196 15.54 15.54 0 0 0 7.04 2.635.749.749 0 1 1-.167 1.49 17 17 0 0 1-7.721-2.885.753.753 0 0 1-.195-1.043"
      />
    </svg>
  );
};

export default BriefCaseIcon;
