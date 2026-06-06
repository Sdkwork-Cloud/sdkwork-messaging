export interface MessagingPushDeviceRegisterRequest {
  deviceKey: string;
  platform: 'ios' | 'android' | 'web';
  provider: 'apns' | 'fcm' | 'web_push' | 'vendor';
  token: string;
  appVersion?: string;
  locale?: string;
  timezone?: string;
}
