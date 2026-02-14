export function getCoverUrl(releaseId) {
  return releaseId
    ? `https://coverartarchive.org/release/${releaseId}/front`
    : null;
}
