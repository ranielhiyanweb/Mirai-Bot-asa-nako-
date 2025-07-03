const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "Obot",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Mod by John Lester",
  description: "goibot",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 1,
};
module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  var { threadID, messageID, reason } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Dhaka").format("HH:MM:ss L");
  var idgr = `${event.threadID}`;
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);

  var tl = [" ayaw sigeg pangita nako. " , "sa owner napud pangita kay pwede ma bbtym ayaw sigeg bot, bot, bot...!" , "ayaw sigeg pangita nako naa nakoy uyab" ,];
  var rand = tl[Math.floor(Math.random() * tl.length)]

    if ((event.body.toLowerCase() == "bie") || (event.body.toLowerCase() == "ming gabie")) {
     return api.sendMessage("maayong gabie saimo, katulog na kung wala kay ka bbtym.", threadID);
   };

    if((event.body.toLowerCase() == "good evening")){
      return api.sendMessage("Good night to you, go to sleep if youdon't have ka bbtym HAHAHA", threadID);
    };
     


   if ((event.body.toLowerCase() == "morning") || (event.body.toLowerCase() == "good morning")) {
     return api.sendMessage("Hello dear, have a nice day ❤️", threadID);
   };

   if ((event.body.toLowerCase() == "anyone") || (event.body.toLowerCase() == "osuwio28suhsh")) {
     return api.sendMessage("wala si anyone diri salamat", threadID);
   };

   

   if ((event.body.toLowerCase() == "owner") || (event.body.toLowerCase() == "Owner")) {
     return api.sendMessage("‎ang owner natulog kay walay ka bbtym haha", threadID);
   };

  

   if ((event.body.toLowerCase() == "nobody loves me") || (event.body.toLowerCase() == "nobody love me")) {
     return api.sendMessage("️lab man ttaka \n\n-admin sa pm", threadID);
   };

   
   
   if ((event.body.toLowerCase() == "😂") || (event.body.toLowerCase() == "😁") || (event.body.toLowerCase() == "😆") || (event.body.toLowerCase() == "🤣") || (event.body.toLowerCase() == "😸") || (event.body.toLowerCase() == "😹")) {
     return api.sendMessage("Brother, if you don't smile so much, you look like a thief..!", threadID);
   };

   if ((event.body.toLowerCase() == "lmsc") || (event.body.toLowerCase() == "Lmsc") || (event.body.toLowerCase() == "LMSC") || (event.body.toLowerCase() == "lf jowa")) {
     return api.sendMessage("bro! If you want to talk nonsense called love, go to owner's messenger, you crazy goat🌚🐸🌶️", threadID);
   };

   

   if ((event.body.toLowerCase() == "is the bot sad") || (event.body.toLowerCase() == "is the bot sad")) {
     return api.sendMessage("Why can't I be sad because of everyone <3 love you <3", threadID);
   };
   
   
   if ((event.body.toLowerCase() == "Raniel") || (event.body.toLowerCase() == "raniel") || (event.body.toLowerCase() == "Hiyan") || (event.body.toLowerCase() == "hiyan") || (event.body.toLowerCase() == "@Raniel Hiyan")){
     return api.sendMessage("natulog si raniel kay walay ka bbtym haha", threadID);
   };
   

   if ((event.body.toLowerCase() == "i love you") || (event.body.toLowerCase() == "Love you") || (event.body.toLowerCase() == "I Love You") || (event.body.toLowerCase() == "ভালোবাসি") || (event.body.toLowerCase() == "i love you")) {
     return api.sendMessage("nya lab ka?", threadID);
   };

     

   if ((event.body.toLowerCase() == "kaon namo") || (event.body.toLowerCase() == "Kaon namo")) {
     return api.sendMessage("I'm full when I see you eat <3", threadID);
   };

   mess = "{name}"
  
  if (event.body.indexOf("Bot") == 0 || (event.body.indexOf("bot") == 0)) {
    var msg = {
      body: `${name}, ${rand}`
    }
    return api.sendMessage(msg, threadID, messageID);
  };

}

module.exports.run = function({ api, event, client, __GLOBAL }) { }