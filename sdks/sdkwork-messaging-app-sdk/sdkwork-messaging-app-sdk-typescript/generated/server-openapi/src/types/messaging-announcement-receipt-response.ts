export interface MessagingAnnouncementReceiptResponse {
  announcementId: string;
  acknowledged: boolean;
  /** Server-owned request correlation id. */
  requestId: string;
}
