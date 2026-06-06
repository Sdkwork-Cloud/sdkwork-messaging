import type { MessagingPushMessage } from './messaging-push-message';

export interface MessagingPushMessageResponse {
  item: MessagingPushMessage;
  /** Server-owned request correlation id. */
  requestId: string;
}
