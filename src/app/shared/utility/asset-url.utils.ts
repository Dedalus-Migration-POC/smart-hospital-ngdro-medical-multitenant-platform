const internalAssetRoots = ['assets/', 'bootstrap-italia/'];

export function normalizeAssetUrl(url: string | null | undefined): string {
  if (!url) return '';

  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url)) return url;

  const normalizedUrl = url.startsWith('/') ? url.slice(1) : url;
  const isInternalAsset = internalAssetRoots.some((root) => normalizedUrl.startsWith(root));

  if (!isInternalAsset) return url;

  try {
    return new URL(normalizedUrl, globalThis.document?.baseURI).toString();
  } catch {
    return normalizedUrl;
  }
}
