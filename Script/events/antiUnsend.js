const messageStore = require('./messageStore');
const { formatUserName, getMessageTypeDescription } = require('./utils');

module.exports.config = {
  name: "antiUnsend",
  eventType: ["message", "message_unsend"],
  version: "1.0.0",
  credits: "MIRAI-BOT",
  description: "Automatically resend messages when users attempt to unsend them"
};

module.exports.run = async ({ event, api, Threads, Users }) => {
  try {
    // Get thread data to check if antiUnsend is enabled
    let data = (await Threads.getData(event.threadID)).data || {};
    
    // If antiUnsend is disabled for this group, return early
    if (data.antiUnsend === false) return;

    // Handle regular messages - store them for potential resending
    if (event.type === "message") {
      await handleMessageStorage(event, api);
      return;
    }

    // Handle unsend events
    if (event.type === "message_unsend") {
      await handleMessageUnsend(event, api, Users);
      return;
    }

  } catch (error) {
    console.error("Error in antiUnsend module:", error);
    api.sendMessage(
      "An error occurred while processing the anti-unsend feature.",
      event.threadID
    );
  }
};

/**
 * Store incoming messages for potential resending
 */
async function handleMessageStorage(event, api) {
  try {
    const messageData = {
      messageID: event.messageID,
      threadID: event.threadID,
      senderID: event.senderID,
      body: event.body || "",
      attachments: event.attachments || [],
      timestamp: Date.now(),
      type: event.type
    };

    // Store the message
    messageStore.storeMessage(event.messageID, messageData);

    // Clean up old messages (keep only last 1000 messages to prevent memory issues)
    messageStore.cleanupOldMessages(1000);

  } catch (error) {
    console.error("Error storing message:", error);
  }
}

/**
 * Handle message unsend events by resending the original message
 */
async function handleMessageUnsend(event, api, Users) {
  try {
    const originalMessage = messageStore.getMessage(event.messageID);
    
    if (!originalMessage) {
      // Message not found in store
      api.sendMessage(
        "⚠️ Someone tried to unsend a message, but I couldn't retrieve the original content.",
        event.threadID
      );
      return;
    }

    // Get the name of the user who unsent the message
    const userName = await formatUserName(originalMessage.senderID, Users);
    
    // Create the resend message
    let resendContent = `🔄 **Message Unsend Detected**\n`;
    resendContent += `👤 User: ${name}\n`;
    resendContent += `⏰ Original Time: ${new Date(originalMessage.timestamp).toLocaleString()}\n`;
    resendContent += `📝 Original Message:\n\n`;

    // Handle different message types
    if (originalMessage.body && originalMessage.body.trim()) {
      resendContent += `"${originalMessage.body}"`;
    }

    // Send the notification message
    await api.sendMessage(resendContent, event.threadID);

    // Handle attachments if present
    if (originalMessage.attachments && originalMessage.attachments.length > 0) {
      await handleAttachmentResend(originalMessage, api, userName);
    }

    // Remove the message from store after processing
    messageStore.removeMessage(event.messageID);

  } catch (error) {
    console.error("Error handling message unsend:", error);
    api.sendMessage(
      "❌ Failed to resend the unsent message due to an error.",
      event.threadID
    );
  }
}

/**
 * Handle resending of attachments
 */
async function handleAttachmentResend(originalMessage, api, userName) {
  try {
    for (const attachment of originalMessage.attachments) {
      let attachmentMessage = `📎 **Attachment from ${userName}**\n`;
      attachmentMessage += `Type: ${getMessageTypeDescription(attachment.type)}\n`;

      if (attachment.type === "photo") {
        // For photos, try to resend the image
        if (attachment.url) {
          await api.sendMessage({
            body: attachmentMessage,
            attachment: await api.getAttachment(attachment.url)
          }, originalMessage.threadID);
        }
      } else if (attachment.type === "video") {
        // For videos, try to resend the video
        if (attachment.url) {
          await api.sendMessage({
            body: attachmentMessage,
            attachment: await api.getAttachment(attachment.url)
          }, originalMessage.threadID);
        }
      } else if (attachment.type === "audio") {
        // For audio, try to resend the audio file
        if (attachment.url) {
          await api.sendMessage({
            body: attachmentMessage,
            attachment: await api.getAttachment(attachment.url)
          }, originalMessage.threadID);
        }
      } else if (attachment.type === "file") {
        // For files, provide information about the file
        attachmentMessage += `📄 File: ${attachment.filename || "Unknown file"}\n`;
        if (attachment.url) {
          attachmentMessage += `🔗 Original URL: ${attachment.url}`;
        }
        await api.sendMessage(attachmentMessage, originalMessage.threadID);
      } else if (attachment.type === "sticker") {
        // For stickers, provide sticker information
        attachmentMessage += `😀 Sticker ID: ${attachment.stickerID || "Unknown"}`;
        await api.sendMessage(attachmentMessage, originalMessage.threadID);
      } else {
        // For other types, provide basic information
        attachmentMessage += `📋 Content: ${JSON.stringify(attachment, null, 2)}`;
        await api.sendMessage(attachmentMessage, originalMessage.threadID);
      }
    }
  } catch (error) {
    console.error("Error resending attachments:", error);
    await api.sendMessage(
      `❌ Failed to resend some attachments from ${userName}`,
      originalMessage.threadID
    );
  }
}

/**
 * Command to toggle antiUnsend feature
 */
module.exports.handleReply = async ({ event, api, Threads, handleReply }) => {
  const { threadID, messageID } = event;
  
  if (handleReply.type === "toggle") {
    try {
      let data = (await Threads.getData(threadID)).data || {};
      
      if (event.body.toLowerCase().includes("enable") || event.body.toLowerCase().includes("on")) {
        data.antiUnsend = true;
        await Threads.setData(threadID, { data });
        api.sendMessage("✅ Anti-unsend feature has been enabled for this group.", threadID, messageID);
      } else if (event.body.toLowerCase().includes("disable") || event.body.toLowerCase().includes("off")) {
        data.antiUnsend = false;
        await Threads.setData(threadID, { data });
        api.sendMessage("❌ Anti-unsend feature has been disabled for this group.", threadID, messageID);
      } else {
        api.sendMessage("Please reply with 'enable' or 'disable' to toggle the anti-unsend feature.", threadID, messageID);
      }
    } catch (error) {
      console.error("Error toggling antiUnsend:", error);
      api.sendMessage("❌ Failed to toggle anti-unsend feature.", threadID, messageID);
    }
  }
};

/**
 * Command to check status and toggle feature
 */
module.exports.onLoad = async ({ api }) => {
  console.log("✅ Anti-unsend module loaded successfully");
  
  // Set up periodic cleanup of old messages
  setInterval(() => {
    messageStore.cleanupOldMessages(1000);
  }, 300000); // Clean up every 5 minutes
};
