pub const MESSAGING_BACKEND_API_PREFIX: &str = "/backend/v3/api";
pub const MESSAGING_BACKEND_API_AUTHORITY: &str = "sdkwork-messaging-backend-api";
pub const MESSAGING_BACKEND_SDK_FAMILY: &str = "sdkwork-messaging-backend-sdk";
pub const MESSAGING_BACKEND_API_AUTH_MODE: &str = "dual-token";

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MessagingBackendRouteManifest {
    pub kind: &'static str,
    pub package_name: &'static str,
    pub surface: &'static str,
    pub owner: &'static str,
    pub domain: &'static str,
    pub capability: &'static str,
    pub api_authority: &'static str,
    pub sdk_family: &'static str,
    pub prefix: &'static str,
    pub routes: Vec<MessagingBackendRoute>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MessagingBackendRoute {
    pub method: &'static str,
    pub path: &'static str,
    pub operation_id: &'static str,
    pub tag: &'static str,
    pub auth_mode: &'static str,
    pub handler_module: &'static str,
    pub handler_name: &'static str,
    pub request_schema: Option<&'static str>,
    pub response_schema: &'static str,
    pub supports_idempotency_key: bool,
    pub ownership_owner: &'static str,
    pub ownership_api_authority: &'static str,
    pub source_route_crate: &'static str,
}

pub fn messaging_backend_api_manifest() -> MessagingBackendRouteManifest {
    MessagingBackendRouteManifest {
        kind: "sdkwork.route.manifest",
        package_name: "sdkwork-routes-messaging-backend-api",
        surface: "backend-api",
        owner: "sdkwork-messaging",
        domain: "messaging",
        capability: "messaging",
        api_authority: MESSAGING_BACKEND_API_AUTHORITY,
        sdk_family: MESSAGING_BACKEND_SDK_FAMILY,
        prefix: MESSAGING_BACKEND_API_PREFIX,
        routes: vec![
            route("GET", "/backend/v3/api/messaging/notifications", "messaging.notifications.list", "messaging_notifications_list", None, "MessagingNotificationListResponse", false),
            route("POST", "/backend/v3/api/messaging/notifications", "messaging.notifications.create", "messaging_notifications_create", Some("MessagingNotificationCreateRequest"), "MessagingNotificationResponse", true),
            route("GET", "/backend/v3/api/messaging/announcements", "messaging.announcements.list", "messaging_announcements_list", None, "MessagingAnnouncementListResponse", false),
            route("POST", "/backend/v3/api/messaging/announcements", "messaging.announcements.publish", "messaging_announcements_publish", Some("MessagingAnnouncementPublishRequest"), "MessagingAnnouncementResponse", true),
            route("GET", "/backend/v3/api/messaging/push_messages", "messaging.pushMessages.list", "messaging_push_messages_list", None, "MessagingPushMessageListResponse", false),
            route("POST", "/backend/v3/api/messaging/push_messages", "messaging.pushMessages.send", "messaging_push_messages_send", Some("MessagingPushMessageSendRequest"), "MessagingPushMessageResponse", true),
            route("GET", "/backend/v3/api/messaging/outbound_messages", "messaging.outboundMessages.list", "messaging_outbound_messages_list", None, "MessagingOutboundMessageListResponse", false),
            route("POST", "/backend/v3/api/messaging/outbound_messages", "messaging.outboundMessages.send", "messaging_outbound_messages_send", Some("MessagingOutboundMessageSendRequest"), "MessagingOutboundMessageResponse", true),
            route("GET", "/backend/v3/api/messaging/verification_policies", "messaging.verificationPolicies.list", "messaging_verification_policies_list", None, "MessagingVerificationPolicyListResponse", false),
            route("PUT", "/backend/v3/api/messaging/verification_policies/{policyId}", "messaging.verificationPolicies.update", "messaging_verification_policies_update", Some("MessagingVerificationPolicyUpdateRequest"), "MessagingVerificationPolicyResponse", true),
        ],
    }
}

fn route(
    method: &'static str,
    path: &'static str,
    operation_id: &'static str,
    handler_name: &'static str,
    request_schema: Option<&'static str>,
    response_schema: &'static str,
    supports_idempotency_key: bool,
) -> MessagingBackendRoute {
    MessagingBackendRoute {
        method,
        path,
        operation_id,
        tag: "messaging",
        auth_mode: MESSAGING_BACKEND_API_AUTH_MODE,
        handler_module: "crate::handlers",
        handler_name,
        request_schema,
        response_schema,
        supports_idempotency_key,
        ownership_owner: "sdkwork-messaging",
        ownership_api_authority: MESSAGING_BACKEND_API_AUTHORITY,
        source_route_crate: "sdkwork-routes-messaging-backend-api",
    }
}
