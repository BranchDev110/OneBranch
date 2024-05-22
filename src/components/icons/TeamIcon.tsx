import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

const TeamIcon = ({ className = "", ...props }: ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("w-4 h-4 ", className)}
    {...props}
  >
    <path d="M24 16.949c0 -1.404 -0.421 -2.76 -1.216 -3.922 -0.572 -0.835 -1.309 -1.529 -2.164 -2.044 1.006 -0.952 1.635 -2.298 1.635 -3.789 0 -2.879 -2.342 -5.221 -5.221 -5.221 -1.707 0 -3.306 0.844 -4.278 2.23 -0.247 -0.036 -0.499 -0.055 -0.756 -0.055s-0.509 0.019 -0.756 0.055c-0.971 -1.386 -2.571 -2.23 -4.278 -2.23 -2.879 0 -5.221 2.342 -5.221 5.221 0 1.491 0.629 2.837 1.635 3.789 -0.854 0.515 -1.591 1.209 -2.164 2.044C0.421 14.188 0 15.544 0 16.949v2.904h5.034v2.175h13.933V19.853h5.033zM17.033 3.261c2.169 0 3.933 1.764 3.933 3.933s-1.764 3.933 -3.933 3.933q-0.058 0 -0.117 -0.002c0.003 -0.008 0.005 -0.017 0.008 -0.025a5.155 5.155 0 0 0 0.168 -0.585c0.003 -0.014 0.007 -0.028 0.01 -0.042 0.012 -0.054 0.022 -0.108 0.032 -0.163 0.005 -0.026 0.01 -0.051 0.014 -0.077a5.219 5.219 0 0 0 0.035 -0.249c0.005 -0.043 0.01 -0.087 0.014 -0.13 0.004 -0.045 0.007 -0.089 0.01 -0.134 0.002 -0.035 0.005 -0.07 0.007 -0.106q0.005 -0.114 0.006 -0.228c0 -0.006 0 -0.011 0 -0.017 0 -0.003 0 -0.006 0 -0.009a5.348 5.348 0 0 0 -0.006 -0.232q-0.002 -0.034 -0.004 -0.067a5.412 5.412 0 0 0 -0.015 -0.195c-0.001 -0.015 -0.003 -0.029 -0.004 -0.044 -0.195 -1.882 -1.384 -3.493 -3.099 -4.238 0.739 -0.83 1.808 -1.323 2.94 -1.323m-6.394 2.418q0.019 -0.007 0.038 -0.013a3.789 3.789 0 0 1 0.275 -0.087 3.925 3.925 0 0 1 1.047 -0.143 3.943 3.943 0 0 1 1.115 0.162q0.045 0.013 0.09 0.027 0.06 0.019 0.12 0.041 0.018 0.006 0.036 0.013c1.315 0.486 2.301 1.657 2.525 3.077l0.005 0.034q0.011 0.072 0.018 0.145 0.003 0.027 0.006 0.054c0.004 0.044 0.007 0.089 0.01 0.134 0.001 0.019 0.003 0.038 0.004 0.058q0.004 0.086 0.004 0.173c0 0.005 0 0.01 0 0.015l0 0.007c0 0.056 -0.002 0.112 -0.004 0.167q-0.001 0.026 -0.003 0.052 -0.005 0.08 -0.012 0.16c-0.002 0.02 -0.005 0.041 -0.007 0.061a4.124 4.124 0 0 1 -0.013 0.103q-0.005 0.04 -0.012 0.079a3.866 3.866 0 0 1 -0.058 0.289 3.995 3.995 0 0 1 -0.041 0.156c-0.006 0.021 -0.011 0.041 -0.018 0.062 -0.009 0.03 -0.019 0.059 -0.028 0.088q-0.012 0.035 -0.024 0.07c-0.009 0.026 -0.018 0.053 -0.028 0.079q-0.025 0.067 -0.052 0.133c-0.008 0.02 -0.017 0.039 -0.025 0.059a3.866 3.866 0 0 1 -0.049 0.109l-0.006 0.013q-0.009 0.019 -0.018 0.038a3.737 3.737 0 0 1 -0.059 0.116c-0.008 0.015 -0.016 0.03 -0.024 0.045l-0.002 0.003c-0.022 0.041 -0.046 0.081 -0.069 0.12q-0.014 0.024 -0.028 0.047 -0.039 0.063 -0.08 0.124c-0.017 0.025 -0.035 0.05 -0.052 0.075q-0.022 0.032 -0.045 0.063a3.995 3.995 0 0 1 -0.103 0.134q-0.032 0.041 -0.066 0.08c-0.014 0.016 -0.028 0.033 -0.042 0.049 -0.023 0.027 -0.046 0.053 -0.07 0.079 -0.014 0.015 -0.029 0.03 -0.043 0.045a3.995 3.995 0 0 1 -0.119 0.12c-0.024 0.023 -0.048 0.047 -0.073 0.069 -0.017 0.016 -0.034 0.031 -0.052 0.046a3.866 3.866 0 0 1 -0.13 0.111q-0.052 0.043 -0.106 0.084 -0.015 0.011 -0.029 0.022c-0.655 0.487 -1.465 0.775 -2.341 0.775s-1.687 -0.289 -2.342 -0.775q-0.014 -0.011 -0.029 -0.022a3.866 3.866 0 0 1 -0.107 -0.084q-0.022 -0.018 -0.044 -0.036a4.124 4.124 0 0 1 -0.086 -0.074c-0.017 -0.015 -0.035 -0.03 -0.052 -0.046 -0.025 -0.023 -0.049 -0.046 -0.073 -0.069a3.995 3.995 0 0 1 -0.119 -0.121c-0.014 -0.015 -0.029 -0.03 -0.043 -0.045 -0.024 -0.026 -0.047 -0.053 -0.07 -0.079 -0.014 -0.016 -0.028 -0.032 -0.042 -0.049a4.124 4.124 0 0 1 -0.108 -0.134q-0.031 -0.04 -0.06 -0.08 -0.023 -0.031 -0.045 -0.063c-0.018 -0.025 -0.035 -0.05 -0.052 -0.075a3.93 3.93 0 0 1 -0.08 -0.124q-0.014 -0.023 -0.028 -0.046a3.93 3.93 0 0 1 -0.07 -0.122c-0.008 -0.015 -0.016 -0.031 -0.024 -0.046a3.995 3.995 0 0 1 -0.059 -0.116q-0.01 -0.021 -0.02 -0.042l-0.003 -0.006a3.866 3.866 0 0 1 -0.052 -0.114c-0.008 -0.018 -0.016 -0.036 -0.024 -0.055a3.995 3.995 0 0 1 -0.054 -0.136c-0.009 -0.025 -0.018 -0.049 -0.026 -0.074a3.866 3.866 0 0 1 -0.026 -0.077c-0.009 -0.028 -0.018 -0.056 -0.027 -0.084a3.802 3.802 0 0 1 -0.036 -0.126c-0.008 -0.03 -0.015 -0.06 -0.022 -0.09a3.737 3.737 0 0 1 -0.016 -0.071c-0.006 -0.029 -0.013 -0.058 -0.019 -0.087a3.866 3.866 0 0 1 -0.024 -0.137c-0.004 -0.025 -0.007 -0.05 -0.011 -0.074a3.866 3.866 0 0 1 -0.014 -0.111c-0.002 -0.018 -0.004 -0.036 -0.006 -0.055a3.93 3.93 0 0 1 -0.012 -0.164q-0.001 -0.024 -0.002 -0.047a3.93 3.93 0 0 1 -0.005 -0.177c0 -0.064 0.002 -0.127 0.005 -0.189 0.001 -0.017 0.002 -0.034 0.003 -0.051 0.003 -0.047 0.006 -0.094 0.011 -0.141q0.002 -0.024 0.005 -0.049 0.008 -0.076 0.019 -0.151 0.002 -0.015 0.004 -0.029c0.222 -1.421 1.209 -2.593 2.525 -3.079M3.034 7.194c0 -2.169 1.764 -3.933 3.933 -3.933 1.132 0 2.201 0.493 2.94 1.323 -1.716 0.745 -2.905 2.357 -3.099 4.24 -0.001 0.013 -0.002 0.026 -0.004 0.038a5.219 5.219 0 0 0 -0.015 0.202q-0.002 0.031 -0.003 0.062a5.348 5.348 0 0 0 -0.006 0.243c0 0.082 0.002 0.164 0.006 0.246 0.002 0.033 0.004 0.066 0.006 0.098 0.003 0.047 0.006 0.094 0.011 0.141 0.004 0.042 0.009 0.083 0.014 0.125a5.09 5.09 0 0 0 0.035 0.25q0.007 0.042 0.015 0.084c0.01 0.053 0.02 0.105 0.031 0.157 0.004 0.017 0.008 0.034 0.012 0.051a5.155 5.155 0 0 0 0.163 0.568c0.004 0.012 0.008 0.024 0.012 0.036q-0.058 0.002 -0.117 0.002c-2.168 0 -3.933 -1.764 -3.933 -3.933m3.08 8.215c-0.014 0.022 -0.028 0.045 -0.042 0.068 -0.029 0.048 -0.059 0.095 -0.087 0.143 -0.016 0.027 -0.031 0.054 -0.046 0.081a6.894 6.894 0 0 0 -0.12 0.22q-0.035 0.067 -0.069 0.135 -0.021 0.043 -0.042 0.086c-0.023 0.048 -0.045 0.096 -0.066 0.144 -0.012 0.026 -0.024 0.052 -0.035 0.079 -0.025 0.058 -0.049 0.116 -0.073 0.174 -0.007 0.017 -0.014 0.034 -0.021 0.051a6.83 6.83 0 0 0 -0.085 0.229c-0.006 0.018 -0.012 0.035 -0.018 0.053 -0.02 0.059 -0.04 0.118 -0.059 0.178 -0.009 0.027 -0.016 0.055 -0.025 0.082 -0.015 0.051 -0.03 0.101 -0.044 0.152q-0.012 0.045 -0.024 0.091a6.379 6.379 0 0 0 -0.037 0.147 6.949 6.949 0 0 0 -0.053 0.243c-0.006 0.03 -0.012 0.06 -0.018 0.09 -0.01 0.055 -0.019 0.109 -0.028 0.164 -0.004 0.026 -0.009 0.051 -0.013 0.077a6.894 6.894 0 0 0 -0.032 0.242l0 0.003q-0.012 0.111 -0.021 0.222H1.289v-1.616c0 -2.207 1.269 -4.189 3.257 -5.131a5.187 5.187 0 0 0 2.421 0.597c0.253 0 0.506 -0.019 0.757 -0.056a5.348 5.348 0 0 0 0.12 0.165c0.014 0.018 0.028 0.036 0.043 0.054a5.219 5.219 0 0 0 0.125 0.154c0.017 0.021 0.035 0.041 0.053 0.061a5.155 5.155 0 0 0 0.188 0.205 5.412 5.412 0 0 0 0.116 0.116c0.015 0.014 0.029 0.029 0.043 0.043q-0.084 0.051 -0.166 0.104c-0.009 0.006 -0.018 0.012 -0.027 0.018q-0.082 0.054 -0.163 0.109 -0.028 0.019 -0.056 0.039 -0.072 0.051 -0.143 0.103c-0.015 0.011 -0.03 0.022 -0.045 0.033q-0.09 0.068 -0.178 0.139c-0.013 0.01 -0.025 0.021 -0.038 0.031a6.765 6.765 0 0 0 -0.191 0.162 7.152 7.152 0 0 0 -0.135 0.122c-0.012 0.011 -0.023 0.021 -0.035 0.032a6.894 6.894 0 0 0 -0.161 0.157q-0.021 0.021 -0.041 0.042 -0.061 0.062 -0.12 0.126 -0.024 0.025 -0.047 0.051 -0.067 0.073 -0.132 0.148c-0.007 0.008 -0.014 0.015 -0.021 0.023q-0.074 0.086 -0.145 0.175 -0.02 0.025 -0.039 0.05 -0.054 0.068 -0.106 0.138 -0.02 0.027 -0.04 0.054a7.216 7.216 0 0 0 -0.134 0.188 6.894 6.894 0 0 0 -0.136 0.207m0.208 5.33v-1.616q0 -0.107 0.004 -0.214c0.001 -0.023 0.003 -0.047 0.004 -0.07 0.002 -0.047 0.005 -0.095 0.008 -0.142 0.002 -0.029 0.005 -0.057 0.008 -0.086 0.004 -0.042 0.007 -0.083 0.012 -0.125 0.003 -0.03 0.008 -0.06 0.012 -0.091 0.005 -0.039 0.01 -0.079 0.016 -0.118 0.005 -0.031 0.01 -0.062 0.016 -0.093 0.006 -0.038 0.012 -0.076 0.019 -0.113 0.006 -0.032 0.013 -0.063 0.019 -0.095 0.007 -0.036 0.015 -0.073 0.023 -0.109 0.007 -0.032 0.015 -0.064 0.023 -0.095 0.009 -0.035 0.017 -0.071 0.026 -0.106 0.009 -0.032 0.018 -0.064 0.027 -0.095 0.01 -0.035 0.019 -0.069 0.03 -0.104 0.01 -0.032 0.02 -0.064 0.031 -0.095 0.011 -0.034 0.022 -0.067 0.033 -0.101 0.011 -0.032 0.023 -0.063 0.034 -0.094 0.012 -0.033 0.024 -0.066 0.037 -0.099 0.012 -0.031 0.025 -0.062 0.038 -0.093 0.013 -0.032 0.026 -0.065 0.04 -0.097 0.013 -0.031 0.027 -0.062 0.041 -0.092 0.014 -0.032 0.028 -0.063 0.043 -0.095 0.014 -0.031 0.03 -0.061 0.045 -0.091 0.015 -0.031 0.03 -0.062 0.046 -0.093 0.016 -0.03 0.032 -0.06 0.048 -0.09 0.016 -0.03 0.033 -0.06 0.049 -0.09 0.017 -0.03 0.034 -0.059 0.051 -0.088 0.017 -0.03 0.035 -0.059 0.053 -0.088 0.018 -0.029 0.036 -0.058 0.055 -0.086 0.018 -0.029 0.037 -0.058 0.056 -0.086s0.038 -0.057 0.058 -0.085c0.019 -0.028 0.039 -0.056 0.059 -0.084 0.02 -0.028 0.041 -0.055 0.061 -0.083 0.02 -0.027 0.041 -0.055 0.061 -0.081 0.021 -0.027 0.043 -0.054 0.064 -0.081q0.032 -0.04 0.064 -0.079a5.928 5.928 0 0 1 0.067 -0.078q0.033 -0.039 0.068 -0.077c0.023 -0.026 0.046 -0.051 0.07 -0.076q0.035 -0.038 0.07 -0.075 0.036 -0.037 0.072 -0.073 0.036 -0.036 0.073 -0.072 0.037 -0.036 0.075 -0.071a6.057 6.057 0 0 1 0.076 -0.07q0.038 -0.034 0.078 -0.068 0.039 -0.034 0.079 -0.067a5.606 5.606 0 0 1 0.08 -0.065q0.041 -0.033 0.082 -0.065a6.572 6.572 0 0 1 0.167 -0.124 5.67 5.67 0 0 1 0.259 -0.175 5.477 5.477 0 0 1 0.18 -0.11 5.734 5.734 0 0 1 0.281 -0.154q0.046 -0.024 0.093 -0.047 0.037 -0.018 0.074 -0.035a5.187 5.187 0 0 0 2.421 0.597 5.187 5.187 0 0 0 2.421 -0.597q0.037 0.017 0.073 0.035a6.379 6.379 0 0 1 0.189 0.097 5.734 5.734 0 0 1 0.184 0.103 5.412 5.412 0 0 1 0.18 0.11 5.412 5.412 0 0 1 0.175 0.116q0.043 0.03 0.086 0.06t0.084 0.061a5.348 5.348 0 0 1 0.165 0.127q0.041 0.033 0.081 0.066 0.04 0.033 0.079 0.067a5.283 5.283 0 0 1 0.154 0.138q0.038 0.035 0.076 0.071 0.037 0.036 0.073 0.072 0.037 0.037 0.073 0.074 0.035 0.037 0.07 0.074 0.035 0.038 0.07 0.076 0.034 0.038 0.067 0.076c0.023 0.026 0.045 0.052 0.067 0.079q0.032 0.039 0.064 0.079 0.033 0.04 0.064 0.081c0.021 0.027 0.041 0.054 0.061 0.081 0.021 0.028 0.041 0.055 0.061 0.083 0.02 0.028 0.039 0.055 0.058 0.083 0.02 0.028 0.039 0.056 0.058 0.085 0.019 0.028 0.037 0.057 0.055 0.086 0.018 0.029 0.037 0.058 0.055 0.087 0.018 0.029 0.035 0.058 0.052 0.088 0.017 0.03 0.035 0.059 0.052 0.089s0.033 0.06 0.049 0.09c0.016 0.03 0.033 0.06 0.048 0.09 0.016 0.031 0.031 0.062 0.046 0.092 0.015 0.03 0.03 0.061 0.045 0.091 0.015 0.031 0.029 0.063 0.043 0.095 0.014 0.031 0.028 0.062 0.041 0.093 0.014 0.032 0.027 0.064 0.04 0.096 0.013 0.031 0.026 0.062 0.038 0.094 0.013 0.033 0.024 0.066 0.036 0.099 0.012 0.032 0.023 0.063 0.034 0.095 0.012 0.034 0.022 0.068 0.033 0.101 0.01 0.032 0.021 0.063 0.031 0.095 0.011 0.034 0.02 0.069 0.03 0.104 0.009 0.032 0.018 0.063 0.027 0.095 0.009 0.035 0.018 0.071 0.026 0.106 0.008 0.032 0.016 0.063 0.023 0.095 0.008 0.036 0.015 0.073 0.023 0.109 0.007 0.032 0.013 0.063 0.019 0.095 0.007 0.037 0.013 0.075 0.019 0.112 0.005 0.031 0.011 0.063 0.016 0.094 0.006 0.039 0.01 0.078 0.015 0.117 0.004 0.03 0.008 0.061 0.012 0.091 0.005 0.041 0.008 0.083 0.012 0.125 0.003 0.029 0.006 0.057 0.008 0.086 0.004 0.047 0.006 0.095 0.008 0.142 0.001 0.023 0.003 0.046 0.004 0.07q0.004 0.107 0.004 0.214v1.616zm12.622 -2.175a6.959 6.959 0 0 0 -0.054 -0.468c-0.004 -0.025 -0.008 -0.049 -0.012 -0.073 -0.009 -0.056 -0.018 -0.112 -0.029 -0.168 -0.005 -0.029 -0.011 -0.059 -0.017 -0.088q-0.015 -0.076 -0.032 -0.152a7.281 7.281 0 0 0 -0.082 -0.33c-0.014 -0.051 -0.029 -0.103 -0.045 -0.154 -0.008 -0.027 -0.016 -0.054 -0.024 -0.081 -0.019 -0.061 -0.039 -0.121 -0.06 -0.181 -0.006 -0.017 -0.011 -0.034 -0.017 -0.05a6.894 6.894 0 0 0 -0.086 -0.23c-0.006 -0.016 -0.013 -0.032 -0.02 -0.049 -0.024 -0.059 -0.048 -0.118 -0.074 -0.177 -0.011 -0.026 -0.023 -0.052 -0.035 -0.077 -0.022 -0.049 -0.044 -0.097 -0.067 -0.145q-0.02 -0.042 -0.041 -0.084a6.959 6.959 0 0 0 -0.114 -0.221q-0.037 -0.068 -0.075 -0.135c-0.015 -0.027 -0.03 -0.054 -0.046 -0.081 -0.028 -0.048 -0.058 -0.096 -0.087 -0.144 -0.014 -0.022 -0.027 -0.045 -0.041 -0.067a7.023 7.023 0 0 0 -0.136 -0.207 7.281 7.281 0 0 0 -0.134 -0.188q-0.02 -0.027 -0.04 -0.053 -0.052 -0.07 -0.106 -0.138 -0.019 -0.025 -0.039 -0.049 -0.071 -0.089 -0.145 -0.176 -0.01 -0.011 -0.02 -0.022a6.959 6.959 0 0 0 -0.3 -0.326c-0.013 -0.014 -0.027 -0.028 -0.04 -0.041a7.023 7.023 0 0 0 -0.162 -0.157c-0.011 -0.011 -0.023 -0.021 -0.034 -0.032a7.152 7.152 0 0 0 -0.136 -0.123q-0.026 -0.023 -0.052 -0.046a6.959 6.959 0 0 0 -0.138 -0.116c-0.013 -0.01 -0.025 -0.021 -0.038 -0.031a6.959 6.959 0 0 0 -0.177 -0.139c-0.015 -0.011 -0.03 -0.022 -0.045 -0.033a6.959 6.959 0 0 0 -0.36 -0.25c-0.01 -0.006 -0.019 -0.013 -0.028 -0.019q-0.082 -0.053 -0.166 -0.104c0.014 -0.014 0.028 -0.028 0.042 -0.042q0.06 -0.058 0.118 -0.118a4.897 4.897 0 0 0 0.188 -0.205c0.017 -0.02 0.035 -0.039 0.052 -0.06a5.219 5.219 0 0 0 0.127 -0.156c0.014 -0.017 0.027 -0.034 0.041 -0.052a5.348 5.348 0 0 0 0.121 -0.166c0.251 0.037 0.505 0.056 0.757 0.056a5.187 5.187 0 0 0 2.421 -0.597c1.988 0.942 3.257 2.923 3.257 5.131v1.616z" />
  </svg>
);
export default TeamIcon;