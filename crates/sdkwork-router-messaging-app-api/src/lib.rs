pub const MESSAGING_APP_API_PREFIX: &str = "/app/v3/api";
pub const MESSAGING_APP_API_AUTHORITY: &str = "sdkwork-messaging-app-api";
pub const MESSAGING_APP_SDK_FAMILY: &str = "sdkwork-messaging-app-sdk";
pub const MESSAGING_APP_API_AUTH_MODE: &str = "dual-token";

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MessagingRouteManifest {
    pub kind: &'static str,
    pub package_name: &'static str,
    pub surface: &'static str,
    pub owner: &'static str,
    pub domain: &'static str,
    pub capability: &'static str,
    pub api_authority: &'static str,
    pub sdk_family: &'static str,
    pub prefix: &'static str,
    pub routes: Vec<MessagingRoute>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MessagingRoute {
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

pub fn messaging_app_api_manifest() -> MessagingRouteManifest {
    MessagingRouteManifest {
        kind: "sdkwork.route.manifest",
        package_name: "sdkwork-router-messaging-app-api",
        surface: "app-api",
        owner: "sdkwork-messaging",
        domain: "messaging",
        capability: "messaging",
        api_authority: MESSAGING_APP_API_AUTHORITY,
        sdk_family: MESSAGING_APP_SDK_FAMILY,
        prefix: MESSAGING_APP_API_PREFIX,
        routes: vec![
            route(
                "GET",
                "/app/v3/api/messaging/notifications",
                "messaging.notifications.list",
                "messaging_notifications_list",
                None,
                "MessagingNotificationListResponse",
                false,
            ),
            route(
                "POST",
                "/app/v3/api/messaging/notifications/{notificationId}/read",
                "messaging.notifications.markRead",
                "messaging_notifications_mark_read",
                None,
                "MessagingNotificationReceiptResponse",
                true,
            ),
            route(
                "GET",
                "/app/v3/api/messaging/announcements",
                "messaging.announcements.list",
                "messaging_announcements_list",
                None,
                "MessagingAnnouncementListResponse",
                false,
            ),
            route(
                "POST",
                "/app/v3/api/messaging/announcements/{announcementId}/acknowledge",
                "messaging.announcements.acknowledge",
                "messaging_announcements_acknowledge",
                None,
                "MessagingAnnouncementReceiptResponse",
                true,
            ),
            route(
                "POST",
                "/app/v3/api/messaging/push_devices",
                "messaging.pushDevices.register",
                "messaging_push_devices_register",
                Some("MessagingPushDeviceRegisterRequest"),
                "MessagingPushDeviceResponse",
                true,
            ),
            route(
                "DELETE",
                "/app/v3/api/messaging/push_devices/{deviceId}",
                "messaging.pushDevices.unregister",
                "messaging_push_devices_unregister",
                None,
                "MessagingPushDeviceUnregisterResponse",
                true,
            ),
            route(
                "POST",
                "/app/v3/api/messaging/verification_codes",
                "messaging.verificationCodes.create",
                "messaging_verification_codes_create",
                Some("MessagingVerificationCodeCreateRequest"),
                "MessagingVerificationCodeResponse",
                true,
            ),
            route(
                "POST",
                "/app/v3/api/messaging/verification_codes/verify",
                "messaging.verificationCodes.verify",
                "messaging_verification_codes_verify",
                Some("MessagingVerificationCodeVerifyRequest"),
                "MessagingVerificationCodeVerifyResponse",
                true,
            ),
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
) -> MessagingRoute {
    MessagingRoute {
        method,
        path,
        operation_id,
        tag: "messaging",
        auth_mode: MESSAGING_APP_API_AUTH_MODE,
        handler_module: "crate::handlers",
        handler_name,
        request_schema,
        response_schema,
        supports_idempotency_key,
        ownership_owner: "sdkwork-messaging",
        ownership_api_authority: MESSAGING_APP_API_AUTHORITY,
        source_route_crate: "sdkwork-router-messaging-app-api",
    }
}
