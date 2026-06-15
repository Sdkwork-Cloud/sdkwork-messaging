use sdkwork_router_messaging_app_api::{
    messaging_app_api_manifest, MESSAGING_APP_API_AUTHORITY, MESSAGING_APP_API_AUTH_MODE,
    MESSAGING_APP_API_PREFIX, MESSAGING_APP_SDK_FAMILY,
};

#[test]
fn declares_standard_app_api_route_manifest() {
    let manifest = messaging_app_api_manifest();

    assert_eq!(manifest.kind, "sdkwork.route.manifest");
    assert_eq!(manifest.package_name, "sdkwork-router-messaging-app-api");
    assert_eq!(manifest.surface, "app-api");
    assert_eq!(manifest.owner, "sdkwork-messaging");
    assert_eq!(manifest.domain, "messaging");
    assert_eq!(manifest.capability, "messaging");
    assert_eq!(manifest.api_authority, MESSAGING_APP_API_AUTHORITY);
    assert_eq!(manifest.sdk_family, MESSAGING_APP_SDK_FAMILY);
    assert_eq!(manifest.prefix, MESSAGING_APP_API_PREFIX);
    assert_eq!(manifest.routes.len(), 8);
}

#[test]
fn app_api_routes_use_app_prefix_and_dual_token_auth() {
    let manifest = messaging_app_api_manifest();

    for route in &manifest.routes {
        assert!(route.path.starts_with(MESSAGING_APP_API_PREFIX));
        assert_eq!(route.auth_mode, MESSAGING_APP_API_AUTH_MODE);
        assert_eq!(route.ownership_owner, "sdkwork-messaging");
        assert_eq!(route.ownership_api_authority, MESSAGING_APP_API_AUTHORITY);
        assert_eq!(route.source_route_crate, "sdkwork-router-messaging-app-api");
    }

    assert!(manifest
        .routes
        .iter()
        .any(|route| route.operation_id == "messaging.notifications.list"));
    assert!(manifest
        .routes
        .iter()
        .any(|route| route.operation_id == "messaging.announcements.acknowledge"));
    assert!(manifest
        .routes
        .iter()
        .any(|route| route.operation_id == "messaging.pushDevices.register"));
    assert!(manifest
        .routes
        .iter()
        .any(|route| route.operation_id == "messaging.verificationCodes.create"));
    for operation_id in [
        "messaging.notifications.markRead",
        "messaging.announcements.acknowledge",
        "messaging.pushDevices.register",
        "messaging.pushDevices.unregister",
        "messaging.verificationCodes.create",
        "messaging.verificationCodes.verify",
    ] {
        let route = manifest
            .routes
            .iter()
            .find(|route| route.operation_id == operation_id)
            .expect("expected idempotent app route");
        assert!(
            route.supports_idempotency_key,
            "{operation_id} must support Idempotency-Key",
        );
    }
    assert!(manifest.routes.iter().all(
        |route| !route.operation_id.contains("dialogueThread") && !route.path.contains("/im/")
    ));
}
