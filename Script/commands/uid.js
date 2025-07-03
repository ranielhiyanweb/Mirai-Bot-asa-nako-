module.exports.config = {
  name: "uid",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mirai Team",
  description: "Get the ID of the user or tagged person.",
  commandCategory: "other",
  cooldowns: 5
};

module.exports.languages = {
  vi: {
    self: "🪪 ID của bạn là: %1",
    mention: "🧑‍🤝‍🧑 %1: %2"
  },
  en: {
    self: "🪪 Your ID is: %1",
    mention: "🧑‍🤝‍🧑 %1: %2"
  }
};

module.exports.run = function({ api, event, getText }) {
  const { mentions, senderID, threadID, messageID } = event;
  
  if (Object.keys(mentions).length === 0) {
    return api.sendMessage(getText("self", senderID), threadID, messageID);
  } else {
    const mentionMessages = Object.entries(mentions).map(
      ([uid, name]) => getText("mention", name.replace("@", ""), uid)
    );
    return api.sendMessage(mentionMessages.join("\n"), threadID, messageID);
  }
};
