export interface MessagingOutboundMessage {
  id: string;
  channel: 'sms' | 'email';
  targetMasked: string;
  subject?: string;
  body: string;
  status: 'accepted' | 'queued' | 'sent' | 'delivered' | 'failed' | 'opened' | 'cancelled' | 'expired';
  createdAt?: string;
}
