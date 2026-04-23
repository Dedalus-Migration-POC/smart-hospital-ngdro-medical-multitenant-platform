// The function returns the last part of the key
// Example user-profile-page.street_address o app.user-profile-page.street_address => street_address
export function getLastPartKey(key: string): string {
  const parts = key.split('.')
  return parts[parts.length - 1]
}
