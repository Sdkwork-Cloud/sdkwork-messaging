import type { MessagingVerificationPolicy } from './messaging-verification-policy';

export interface MessagingVerificationPolicyResponse {
  item: MessagingVerificationPolicy;
  /** Server-owned request correlation id. */
  requestId: string;
}
