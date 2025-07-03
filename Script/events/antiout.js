module.exports.config = {
  name: "antiout",
  eventType: ["log:unsubscribe"],
  version: "0.0.1",
  credits: "MIRAI-BOT",
  description: "Notify the group when someone leaves and try to re-add them with a random gif/photo/video"
};

module.exports.run = async ({ event, api, Threads, Users }) => {
  let data = (await Threads.getData(event.threadID)).data || {};
  if (data.antiout == false) return;

  // Ignore if the bot itself was removed
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
  const type = (event.author == event.logMessageData.leftParticipantFbId) ? "self-separation" : "removed-by-admin";

  if (type == "self-separation") {
    api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID, (error, info) => {
      if (error) {
        api.sendMessage(
          `failed to re-add ni ${name}.\nkay gi block kos animal or wala tay permission mo re-add stiha niya`,
          event.threadID
        );
      } else {
        api.sendMessage(
          `bawal mo left ${name} kay mga tisoy/tisay ta diri \n\n-admin sa pm.`,
          event.threadID
        );
      }
    });
  }
};
