export interface MessagingAudience {
  kind: 'all_users' | 'tenant' | 'organization' | 'role' | 'user_segment' | 'explicit_users';
  value: string;
}
