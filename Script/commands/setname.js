module.exports.config = {
	name: "setname",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "Change your nickname in your group or that of the person you tag",
	commandCategory: "other",
	usages: "[name] or [@tag] [name]",
	cooldowns: 3
};

module.exports.languages = {
	"en": {
		"selfChange": "Changed your nickname to: %1",
		"targetChange": "Changed %1's nickname to: %2",
		"missingName": "Please enter the nickname you want to set."
	},

};

module.exports.run = async function({ api, event, args, getText }) {
	const name = args.join(" ");
	if (!name) return api.sendMessage(getText("missingName"), event.threadID, event.messageID);

	const mention = Object.keys(event.mentions)[0];

	if (!mention) {
		await api.changeNickname(name, event.threadID, event.senderID);
		return api.sendMessage(getText("selfChange", name), event.threadID, event.messageID);
	}

	const newName = name.replace(event.mentions[mention], "").trim();
	await api.changeNickname(newName, event.threadID, mention);
	return api.sendMessage(getText("targetChange", event.mentions[mention].replace(/@/g, "").trim(), newName), event.threadID, event.messageID);
};
