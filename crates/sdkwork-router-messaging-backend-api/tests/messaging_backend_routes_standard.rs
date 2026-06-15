use sdkwork_router_messaging_backend_api::{
    messaging_backend_api_manifest, MESSAGING_BACKEND_API_AUTHORITY,
    MESSAGING_BACKEND_API_AUTH_MODE, MESSAGING_BACKEND_API_PREFIX, MESSAGING_BACKEND_SDK_FAMILY,
};

#[test]
fn declares_standard_backend_api_route_manifest() {
    let manifest = messaging_backend_api_manifest();

    assert_eq!(manifest.kind, "sdkwork.route.manifest");
    assert_eq!(
        manifest.package_name,
        "sdkwork-router-messaging-backend-api"
    );
    assert_eq!(manifest.surface, "backend-api");
    assert_eq!(manifest.owner, "sdkwork-messaging");
    assert_eq!(manifest.domain, "messaging");
    assert_eq!(manifest.capability, "messaging");
    assert_eq!(manifest.api_authority, MESSAGING_BACKEND_API_AUTHORITY);
    assert_eq!(manifest.sdk_family, MESSAGING_BACKEND_SDK_FAMILY);
    assert_eq!(manifest.prefix, MESSAGING_BACKEND_API_PREFIX);
    assert_eq!(manifest.routes.len(), 10);
}

#[test]
fn backend_api_routes_use_backend_prefix_and_dual_token_auth() {
    let manifest = messaging_backend_api_manifest();

    for route in &manifest.routes {
        assert!(route.path.starts_with(MESSAGING_BACKEND_API_PREFIX));
        assert_eq!(route.auth_mode, MESSAGING_BACKEND_API_AUTH_MODE);
        assert_eq!(route.ownership_owner, "sdkwork-messaging");
        assert_eq!(
            route.ownership_api_authority,
            MESSAGING_BACKEND_API_AUTHORITY
        );
        assert_eq!(
            route.source_route_crate,
            "sdkwork-router-messaging-backend-api"
        );
    }

    assert!(manifest
        .routes
        .iter()
        .any(|route| route.operation_id == "messaging.notifications.create"));
    assert!(manifest
        .routes
        .iter()
        .any(|route| route.operation_id == "messaging.announcements.publish"));
    assert!(manifest
        .routes
        .iter()
        .any(|route| route.operation_id == "messaging.pushMessages.send"));
    assert!(manifest
        .routes
        .iter()
        .any(|route| route.operation_id == "messaging.outboundMessages.send"));
    assert!(manifest
        .routes
        .iter()
        .any(|route| route.operation_id == "messaging.verificationPolicies.update"));
    for operation_id in [
        "messaging.notifications.create",
        "messaging.announcements.publish",
        "messaging.pushMessages.send",
        "messaging.outboundMessages.send",
        "messaging.verificationPolicies.update",
    ] {
        let route = manifest
            .routes
            .iter()
            .find(|route| route.operation_id == operation_id)
            .expect("expected idempotent backend route");
        assert!(
            route.supports_idempotency_key,
            "{operation_id} must support Idempotency-Key",
        );
    }
    assert!(manifest.routes.iter().all(|route| {
        !route.operation_id.contains("template")
            && !route.operation_id.contains("provider")
            && !route.operation_id.contains("dialogueThread")
            && !route.path.contains("/im/")
    }));
}
