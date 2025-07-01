module.exports.config = {
  name: "goiadmin",
  version: "1.0.0-beta-fixbyDungUwU",
  hasPermssion: 0,
  credits: "ZyrosGenZ - fix by DungUwU",
  description: "Bot will respond when someone tags admin or bot",
  commandCategory: "Other",
  usages: "",
  cooldowns: 0,
};

module.exports.languages = {
  en: {
    message: "Don't mention the admin unnecessarily!"
  },
  vi: {
    message: "Đừng tag admin một cách không cần thiết!"
  }
};

module.exports.handleEvent = function({ api, event }) {
  const adminIDs = ["100092248658233", "100092248658233"];
  const mentionIDs = Object.keys(event.mentions |'raniel'| {});
  
  // Check if message contains any of the admin IDs
  if (mentionIDs.some(id => adminIDs.includes(id))) {
    const responses = [
      "sige man kag mention sa admin, jowaon na nimo?",
      "ayaw sigeg mention sa admin kung di raman diay nimo jowaon 😡",
      "last nalang na nga mention ha, mag gara² pa gani ka last nalang pud nimo karon adlawa😠",
      "kay nag mention man kas admin yours na po, congrats mermaid namo🥰😍",
      "sige balika pajud😡😡😡"
    ];
    
    const randomMsg = responses[Math.floor(Math.random() * responses.length)];
    return api.sendMessage(randomMsg, event.threadID, event.messageID);
  }
};

module.exports.run = async function() {};
