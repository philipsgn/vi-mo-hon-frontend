function resolveApiBaseUrl({ configuredUrl, hostUri, isDevelopment }) {
  if (isDevelopment && hostUri) {
    const normalizedHostUri = /^[a-z][a-z\d+.-]*:\/\//i.test(hostUri)
      ? hostUri
      : `http://${hostUri}`;
    const { hostname } = new URL(normalizedHostUri);

    if (!hostname) {
      throw new Error('Expo did not provide a valid development host URI.');
    }

    return `http://${hostname}:3000/api`;
  }

  return configuredUrl || null;
}

module.exports = { resolveApiBaseUrl };
