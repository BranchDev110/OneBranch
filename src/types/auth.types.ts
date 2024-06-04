export interface AuthBody {
  email: string;
  password: string;
}

export interface SignUpAuthRes {
  id: string;
}

export interface ForgotPasswordBody {
  email: string;
  originUrl: string;
}

export interface ResetPasswordBody {
  password: string;
  oobCode: string;
}
