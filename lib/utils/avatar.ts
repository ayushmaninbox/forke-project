import { decryptUrl, isEncrypted } from '@/lib/utils/encrypt'

/**
 * Resolves a stored avatar value into a usable URL.
 * Uploaded avatars are stored AES-256-GCM encrypted (their real /uploads path
 * is never exposed); OAuth avatars are plain external URLs. Server-only.
 */
export function resolveAvatarUrl(image: string | null | undefined): string | null {
  if (!image) return null
  if (isEncrypted(image)) return decryptUrl(image)
  return image
}
