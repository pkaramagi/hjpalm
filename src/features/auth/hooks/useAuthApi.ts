import { useMutation, useQuery } from '@tanstack/react-query';

import {
  authGetStatusOptions,
  authLoginMutation,
  authRequestPasswordResetMutation,
  authResetPasswordMutation,
} from '@/client/@tanstack/react-query.gen';
import type {
  AuthGetStatusData,
  AuthGetStatusResponse,
  AuthLoginData,
  AuthLoginResponse,
  AuthRequestPasswordResetData,
  AuthRequestPasswordResetResponse,
  AuthResetPasswordData,
  AuthResetPasswordResponse,
  Options,
} from '@/client';

/**
 * Fetches the API health/authentication status.
 */
export function useAuthStatus(options?: Options<AuthGetStatusData>) {
  return useQuery(authGetStatusOptions(options));
}

/**
 * Triggers the Hey API login endpoint.
 */
export function useAuthLogin(options?: Partial<Options<AuthLoginData>>) {
  return useMutation(authLoginMutation(options));
}

/**
 * Requests a password reset token via email or username.
 */
export function useAuthRequestPasswordReset(options?: Partial<Options<AuthRequestPasswordResetData>>) {
  return useMutation(authRequestPasswordResetMutation(options));
}

/**
 * Resets the password using a previously issued token.
 */
export function useAuthResetPassword(options?: Partial<Options<AuthResetPasswordData>>) {
  return useMutation(authResetPasswordMutation(options));
}
