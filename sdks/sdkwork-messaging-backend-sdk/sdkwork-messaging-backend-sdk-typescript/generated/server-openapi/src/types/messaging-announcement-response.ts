import type { MessagingAnnouncement } from './messaging-announcement';

export interface MessagingAnnouncementResponse {
  item: MessagingAnnouncement;
  /** Server-owned request correlation id. */
  requestId: string;
}
