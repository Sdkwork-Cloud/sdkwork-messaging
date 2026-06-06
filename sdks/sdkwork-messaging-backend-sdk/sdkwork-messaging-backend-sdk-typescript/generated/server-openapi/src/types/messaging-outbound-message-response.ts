import type { MessagingOutboundMessage } from './messaging-outbound-message';

export interface MessagingOutboundMessageResponse {
  item: MessagingOutboundMessage;
  /** Server-owned request correlation id. */
  requestId: string;
}
