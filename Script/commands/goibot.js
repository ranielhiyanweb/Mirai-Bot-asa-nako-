const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "Obot",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Mod by John Lester",
  description: "goibot",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};
module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  var { threadID, messageID, reason } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Dhaka").format("HH:MM:ss L");
  var idgr = `${event.threadID}`;
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);

  var tl = ["ayaw sigeg mention og 'bot' bi kay nag pahuwaybko, mototoy ka?", "sige kag bot bot bot last nalang jud ka.", "ayaw sigeg panawag og bot gikapoy pako.",];
  var rand = tl[Math.floor(Math.random() * tl.length)]

     return api.sendMessage("ayaw sigeg tawag nako, last nalang na imong chat nga bot pusilon tika", threadID);
   };

    
   
    if ((event.body.toLowerCase() == "👍") || (event.body.toLowerCase() == "👍")) {
     return api.sendMessage("bawal mag lz diri, kick tika ron.", threadID);
   };
  
   
   if ((event.body.toLowerCase() == "hi") || (event.body.toLowerCase() == "hello") ||(event.body.toLowerCase() == "hlw") || (event.body.toLowerCase() == "helo")) {
     return api.sendMessage("hi Hello tara sha...", threadID);
   };


   

   if ((event.body.toLowerCase() == "morning") || (event.body.toLowerCase() == "good morning")) {
     return api.sendMessage("Hello dear, have a nice day ❤️", threadID);
   };

   if ((event.body.toLowerCase() == "anyone") || (event.body.toLowerCase() == "(_-_(_+_-")) {
     return api.sendMessage("Wala si anyone sorry", threadID);
   };

   if ((event.body.toLowerCase() == "raniel") || (event.body.toLowerCase() == "Hiyan") || (event.body.toLowerCase() == "hiyan") || (event.body.toLowerCase() == "@Raniel Hiyan")) {
     return api.sendMessage( "ayaw sigeg pangita ana niya kung dili man gani nimo jowaon.",threadID); 
   };

   
   
   mess = "{name}"
  
  if (event.body.indexOf("Bot") == 0 || (event.body.indexOf("bot") == 0)) {
    var msg = {
      body: `${name}, ${rand}`
    }
    return api.sendMessage(msg, threadID, messageID);
  };


module.exports.run = function({ api, event, client, __GLOBAL }) { }
