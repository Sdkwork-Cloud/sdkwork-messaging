export interface MessagingPushMessageSendRequest {
  recipientUserIds: string[];
  title: string;
  body: string;
  badge?: number;
  collapseKey?: string;
  data?: Record<string, string>;
  scheduledAt?: string;
}
