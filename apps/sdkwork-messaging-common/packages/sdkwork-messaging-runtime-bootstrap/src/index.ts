export interface SdkworkMessagingCapabilityTheme {
  accentColor?: string;
  icon?: string;
}

export interface SdkworkMessagingCapabilityManifest {
  description: string;
  host?: string;
  id: string;
  packageNames: string[];
  theme?: SdkworkMessagingCapabilityTheme;
  title: string;
}

export interface CreateSdkworkMessagingCapabilityManifestOptions {
  description: string;
  host?: string;
  id: string;
  packageNames?: readonly string[];
  theme?: SdkworkMessagingCapabilityTheme;
  title: string;
}

export function createSdkworkMessagingCapabilityManifest({
  description,
  host,
  id,
  packageNames = [],
  theme,
  title,
}: CreateSdkworkMessagingCapabilityManifestOptions): SdkworkMessagingCapabilityManifest {
  return {
    description,
    ...(host ? { host } : {}),
    id,
    packageNames: Array.from(new Set(packageNames.map((packageName) => packageName.trim()).filter(Boolean))),
    ...(theme ? { theme } : {}),
    title,
  };
}
