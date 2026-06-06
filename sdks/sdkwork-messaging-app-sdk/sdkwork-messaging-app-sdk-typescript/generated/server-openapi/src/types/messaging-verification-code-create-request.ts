export interface MessagingVerificationCodeCreateRequest {
  sceneCode: string;
  target: string;
  channel?: 'sms' | 'email';
}
