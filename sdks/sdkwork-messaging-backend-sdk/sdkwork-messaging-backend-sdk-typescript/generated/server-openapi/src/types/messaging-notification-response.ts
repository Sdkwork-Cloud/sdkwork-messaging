import type { MessagingNotification } from './messaging-notification';

export interface MessagingNotificationResponse {
  item: MessagingNotification;
  /** Server-owned request correlation id. */
  requestId: string;
}
