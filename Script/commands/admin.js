module.exports.config = {
  name: "admin",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "aminulsordar",
  description: "Bot operator information",
  commandCategory: "info",
  cooldowns: 1
};

module.exports.languages = {
  en: {
    message: `The Bot Modefier Info
╔══❀══◄░❀░►══❀══╗
 -NAME ➪ Raniel Hiyan❯⸙

 -Gender ➪ Male 

 -Age ➪ 13+ ikaw na mag tagna pila.

 -Relationship ➪ Single ready to mingle

 -Work ➪ Student sa CCTC


 -Facebook ➪ https://www.facebook.com/100092248658233


 -Page ➪ https://www.facebook.com/share/g/1EHHK6Rb7H/

 -Mail ➪ Inbox him if needed

╚══❀══◄░❀░►══❀══╝`
  },

};

module.exports.run = async function ({ api, event, getText }) {
  return api.sendMessage(getText("message"), event.threadID, event.messageID);
};
