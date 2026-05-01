type ErrorWithCode = {
  code?: string;
};

const getErrorCode = (error: unknown): string | undefined => {
  if (error && typeof error === 'object' && 'code' in error) {
    return (error as ErrorWithCode).code;
  }

  return undefined;
};

export const getRegisterErrorMessage = (error: unknown): string => {
  switch (getErrorCode(error)) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please log in instead.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Email and password signups are not enabled for this Firebase project.';
    case 'auth/weak-password':
      return 'Use a stronger password with at least 8 characters.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    default:
      return 'Unable to create your account. Please try again.';
  }
};

export const getLoginErrorMessage = (error: unknown): string => {
  switch (getErrorCode(error)) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email or password is incorrect.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    default:
      return 'Unable to log in. Please try again.';
  }
};
