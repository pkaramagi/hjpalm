export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  lastSignIn: string;
  location: string;
  initials: string;
}

export interface SignInFields {
  email: string;
  password: string;
  remember: boolean;
}

export interface SignInErrors {
  email?: string;
  password?: string;
}

export interface LockScreenFields {
  password: string;
}

export interface LockScreenErrors {
  password?: string;
}

export interface ForgotPasswordFields {
  email: string;
}

export interface ForgotPasswordErrors {
  email?: string;
}

export interface ChangePasswordFields {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}