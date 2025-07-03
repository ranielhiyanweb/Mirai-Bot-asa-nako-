/**
 * Utility functions for the antiUnsend module
 */

/**
 * Format user name for display
 * @param {string} userID - The user ID
 * @param {Object} Users - The Users object from the bot
 * @returns {Promise<string>} Formatted user name
 */
async function formatUserName(userID, Users) {
  try {
    // Try to get name from global cache first
    if (global.data && global.data.userName && global.data.userName.get(userID)) {
      return global.data.userName.get(userID);
    }
    
    // Fallback to Users.getNameUser if available
    if (Users && Users.getNameUser) {
      const name = await Users.getNameUser(userID);
      return name || `User ${userID}`;
    }
    
    // Last resort - just return the user ID
    return `User ${userID}`;
  } catch (error) {
    console.error("Error formatting user name:", error);
    return `User ${userID}`;
  }
}

/**
 * Get description for message attachment type
 * @param {string} type - The attachment type
 * @returns {string} Human-readable description
 */
function getMessageTypeDescription(type) {
  const typeMap = {
    'photo': '📸 Photo',
    'video': '🎥 Video',
    'audio': '🎵 Audio',
    'file': '📎 File',
    'sticker': '😀 Sticker',
    'gif': '🎬 GIF',
    'link': '🔗 Link',
    'location': '📍 Location',
    'contact': '👤 Contact'
  };
  
  return typeMap[type] || `📋 ${type || 'Unknown'}`;
}

/**
 * Sanitize message content for safe display
 * @param {string} content - The message content
 * @returns {string} Sanitized content
 */
function sanitizeMessageContent(content) {
  if (!content || typeof content !== 'string') return '';
  
  // Remove any potential harmful content
  return content
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Check if a message is too old to resend
 * @param {number} timestamp - The message timestamp
 * @param {number} maxAge - Maximum age in milliseconds (default: 24 hours)
 * @returns {boolean} True if message is too old
 */
function isMessageTooOld(timestamp, maxAge = 24 * 60 * 60 * 1000) {
  try {
    const now = Date.now();
