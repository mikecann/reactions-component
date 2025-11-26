export function encodeReaction(emoji: string): string {
  return btoa(encodeURIComponent(emoji));
}

export function decodeReaction(encoded: string): string {
  return decodeURIComponent(atob(encoded));
}

