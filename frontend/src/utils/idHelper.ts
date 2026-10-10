/**
 * Safely extracts item ID whether from MongoDB Atlas (_id), custom ID (id), or authId
 */
export const getItemId = (item: any): string => {
  if (!item) return '';
  if (typeof item === 'string') return item;
  return item._id || item.id || item.session_id || item.sessionId || item.slug || item.authId || '';
};

/**
 * Formats long 24-char MongoDB ObjectIDs into clean, short, human-readable IDs
 * e.g., '6a883d5b2f970c45129384bc' => '#6A883D5B' or 'CMP-384BC'
 */
export const formatShortId = (rawId: string, prefix?: string): string => {
  if (!rawId) return 'N/A';
  if (rawId.length > 12) {
    const shortCode = rawId.slice(-6).toUpperCase();
    return prefix ? `${prefix}-${shortCode}` : `#${rawId.slice(0, 8).toUpperCase()}`;
  }
  return rawId;
};
