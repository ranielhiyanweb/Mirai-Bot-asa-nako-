/**
 * In-memory message store for anti-unsend functionality
 * Stores messages temporarily to enable resending when unsent
 */

class MessageStore {
  constructor() {
    this.messages = new Map();
    this.maxMessages = 1000; // Maximum messages to store
  }

  /**
   * Store a message with its metadata
   * @param {string} messageID - The message ID
   * @param {Object} messageData - The message data object
   */
  storeMessage(messageID, messageData) {
    try {
      // Add timestamp if not present
      if (!messageData.timestamp) {
        messageData.timestamp = Date.now();
      }

      this.messages.set(messageID, messageData);
      
      // Auto-cleanup if we exceed max messages
      if (this.messages.size > this.maxMessages) {
        this.cleanupOldMessages(this.maxMessages * 0.8); // Clean to 80% of max
      }
    } catch (error) {
      console.error("Error storing message:", error);
    }
  }

  /**
   * Retrieve a message by ID
   * @param {string} messageID - The message ID to retrieve
   * @returns {Object|null} The message data or null if not found
   */
  getMessage(messageID) {
    try {
      return this.messages.get(messageID) || null;
    } catch (error) {
      console.error("Error retrieving message:", error);
      return null;
    }
  }

  /**
   * Remove a message from the store
   * @param {string} messageID - The message ID to remove
   */
  removeMessage(messageID) {
    try {
      this.messages.delete(messageID);
    } catch (error) {
      console.error("Error removing message:", error);
    }
  }

  /**
   * Clean up old messages to prevent memory issues
   * @param {number} keepCount - Number of messages to keep
   */
  cleanupOldMessages(keepCount = 500) {
    try {
      if (this.messages.size <= keepCount) return;

      // Convert to array and sort by timestamp (oldest first)
      const messagesArray = Array.from(this.messages.entries())
        .sort((a, b) => (a[1].timestamp || 0) - (b[1].timestamp || 0));

      // Calculate how many to remove
      const toRemove = this.messages.size - keepCount;
      
      // Remove oldest messages
      for (let i = 0; i < toRemove; i++) {
        if (messagesArray[i]) {
          this.messages.delete(messagesArray[i][0]);
        }
      }

      console.log(`Cleaned up ${toRemove} old messages. Current count: ${this.messages.size}`);
    } catch (error) {
      console.error("Error cleaning up old messages:", error);
    }
  }

  /**
   * Get current statistics about the message store
   * @returns {Object} Statistics object
   */
  getStats() {
    try {
      const now = Date.now();
      const messages = Array.from(this.messages.values());
      
      const stats = {
        totalMessages: this.messages.size,
        oldestMessage: messages.length > 0 ? 
          Math.min(...messages.map(m => m.timestamp || now)) : null,
        newestMessage: messages.length > 0 ? 
          Math.max(...messages.map(m => m.timestamp || 0)) : null,
        memoryUsage: this.estimateMemoryUsage()
      };

      return stats;
    } catch (error) {
      console.error("Error getting store stats:", error);
      return {
        totalMessages: 0,
        oldestMessage: null,
        newestMessage: null,
        memoryUsage: 0
      };
    }
  }

  /**
   * Estimate memory usage of the store
   * @returns {number} Estimated memory usage in bytes
   */
  estimateMemoryUsage() {
    try {
      let totalSize = 0;
      
      for (const [key, value] of this.messages) {
        // Rough estimation of memory usage
        totalSize += key.length * 2; // String key (2 bytes per char in UTF-16)
        totalSize += JSON.stringify(value).length * 2; // JSON representation
      }
      
      return totalSize;
    } catch (error) {
      console.error("Error estimating memory usage:", error);
      return 0;
    }
  }

  /**
   * Clear all messages from the store
   */
  clear() {
    try {
      this.messages.clear();
      console.log("Message store cleared");
    } catch (error) {
      console.error("Error clearing message store:", error);
    }
  }

  /**
   * Get messages from a specific thread
   * @param {string} threadID - The thread ID
   * @returns {Array} Array of messages from the thread
   */
  getThreadMessages(threadID) {
    try {
      const threadMessages = [];
      
      for (const [messageID, messageData] of this.messages) {
        if (messageData.threadID === threadID) {
          threadMessages.push({ messageID, ...messageData });
        }
      }
      
      return threadMessages.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } catch (error) {
      console.error("Error getting thread messages:", error);
      return [];
    }
  }
}

// Create and export singleton instance
const messageStore = new MessageStore();

module.exports = messageStore;
