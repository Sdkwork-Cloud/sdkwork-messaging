#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MessagingChannel {
    InApp,
    Announcement,
    AppPush,
    Sms,
    Email,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MessagingDirectChannel {
    Sms,
    Email,
}

impl MessagingDirectChannel {
    pub fn as_str(&self) -> &'static str {
        match self {
            MessagingDirectChannel::Sms => "sms",
            MessagingDirectChannel::Email => "email",
        }
    }
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MessagingPushPlatform {
    Ios,
    Android,
    Web,
}

impl MessagingPushPlatform {
    pub fn as_str(&self) -> &'static str {
        match self {
            MessagingPushPlatform::Ios => "ios",
            MessagingPushPlatform::Android => "android",
            MessagingPushPlatform::Web => "web",
        }
    }
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MessagingPushProvider {
    Apns,
    Fcm,
    WebPush,
    Vendor,
}

impl MessagingPushProvider {
    pub fn as_str(&self) -> &'static str {
        match self {
            MessagingPushProvider::Apns => "apns",
            MessagingPushProvider::Fcm => "fcm",
            MessagingPushProvider::WebPush => "web_push",
            MessagingPushProvider::Vendor => "vendor",
        }
    }
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MessagingAudienceKind {
    AllUsers,
    Tenant,
    Organization,
    Role,
    UserSegment,
    ExplicitUsers,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MessagingNotificationPriority {
    Low,
    Normal,
    High,
    Urgent,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MessagingDeliveryStatus {
    Accepted,
    Queued,
    Sent,
    Delivered,
    Failed,
    Opened,
    Cancelled,
    Expired,
}

impl MessagingDeliveryStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            MessagingDeliveryStatus::Accepted => "accepted",
            MessagingDeliveryStatus::Queued => "queued",
            MessagingDeliveryStatus::Sent => "sent",
            MessagingDeliveryStatus::Delivered => "delivered",
            MessagingDeliveryStatus::Failed => "failed",
            MessagingDeliveryStatus::Opened => "opened",
            MessagingDeliveryStatus::Cancelled => "cancelled",
            MessagingDeliveryStatus::Expired => "expired",
        }
    }
}

pub type MessagingPushDeliveryStatus = MessagingDeliveryStatus;

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MessagingVerificationChallengeStatus {
    Pending,
    Verified,
    Failed,
    Locked,
    Expired,
}

impl MessagingVerificationChallengeStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            MessagingVerificationChallengeStatus::Pending => "pending",
            MessagingVerificationChallengeStatus::Verified => "verified",
            MessagingVerificationChallengeStatus::Failed => "failed",
            MessagingVerificationChallengeStatus::Locked => "locked",
            MessagingVerificationChallengeStatus::Expired => "expired",
        }
    }
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MessagingNotificationRequest {
    pub audience_kind: MessagingAudienceKind,
    pub body: String,
    pub priority: MessagingNotificationPriority,
    pub title: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MessagingPushDeliveryRequest {
    pub audience_kind: MessagingAudienceKind,
    pub body: String,
    pub channel: MessagingChannel,
    pub device_id: String,
    pub idempotency_key: String,
    pub title: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MessagingOutboundMessageRequest {
    pub body: String,
    pub channel: MessagingDirectChannel,
    pub idempotency_key: String,
    pub subject: Option<String>,
    pub target: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MessagingVerificationCodeRequest {
    pub channel: MessagingDirectChannel,
    pub scene_code: String,
    pub target: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MessagingPushDeliveryResult {
    pub delivery_status: MessagingDeliveryStatus,
    pub device_id: String,
    pub provider_message_id: Option<String>,
    pub request_id: String,
}

pub const SDKWORK_MESSAGING_DOMAIN: &str = "messaging";
