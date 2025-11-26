// Shared reaction types and encoding utilities
// Used by both backend (Convex) and frontend

export const KNOWN_REACTION_TYPES = ["👍", "❤️", "😂", "😮", "😢"];

// Encode reaction emoji - works in both Node.js (backend) and browser (frontend)
export function encodeReaction(emoji: string): string {
  // Check if we're in Node.js (has Buffer) or browser (has btoa)
  if (typeof Buffer !== "undefined") {
    // Node.js/Convex backend
    return Buffer.from(encodeURIComponent(emoji), "utf-8").toString("base64");
  }
  // Browser frontend
  return btoa(encodeURIComponent(emoji));
}

// Decode reaction emoji - works in both Node.js (backend) and browser (frontend)
export function decodeReaction(encoded: string): string {
  // Check if we're in Node.js (has Buffer) or browser (has atob)
  if (typeof Buffer !== "undefined") {
    // Node.js/Convex backend
    return decodeURIComponent(Buffer.from(encoded, "base64").toString("utf-8"));
  }
  // Browser frontend
  return decodeURIComponent(atob(encoded));
}
