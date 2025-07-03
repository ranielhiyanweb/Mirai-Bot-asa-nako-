const ITEMS_PER_PAGE = 15;

module.exports.config = {
  name: "help",
  version: "2.0.0",
  NonPREFIX: true,
  hasPermssion: 0,
  credits: "Aminul Sordar",
  description: "📚 Show all commands with pagination and details",
  commandCategory: "🛠 System",
  usages: "[page | command name]",
  cooldowns: 5
};

module.exports.languages = {
  en: {
    helpList:
      "📖 𝗛𝗘𝗟𝗣 𝗠𝗘𝗡𝗨 (𝗣𝗮𝗴𝗲 %1/%2)\n━━━━━━━━━━━━━━━\n%3\n━━━━━━━━━━━━━━━\n📌 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: %4\n📂 𝗧𝗼𝘁𝗮𝗹 𝗘𝘃𝗲𝗻𝘁𝘀: %5\n🧑‍💻 𝗠𝗮𝗱𝗲 𝗯𝘆: Secret para bibo\n💡 %6",
    moduleInfo:
      "🔹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱: %1\n📖 𝗗𝗲𝘀𝗰: %2\n\n🛠 𝗨𝘀𝗮𝗴𝗲: %3\n📁 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: %4\n⏱ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: %5s\n🔐 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: %6\n",
    user: "User 👤",
    adminGroup: "Group Admin 👮",
    adminBot: "Bot Admin 🤖"
  }
};

const tips = [
  "Try: help uptime to see how it works!",
  "Use the command name like 'help info'.",
  " ",
  "You can change prefix per group.",
  "Use commands wisely and don't spam.",
  "Need image help? Type help photo!"
];

module.exports.run = async function ({ api, event, args, getText }) {
  const { threadID, messageID } = event;
  const { commands, events } = global.client;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : global.config.PREFIX;

  // If user requested specific command help
  if (args[0] && commands.has(args[0].toLowerCase())) {
    const cmd = commands.get(args[0].toLowerCase());
    const perm =
      cmd.config.hasPermssion === 0
        ? getText("user")
        : cmd.config.hasPermssion === 1
        ? getText("adminGroup")
        : getText("adminBot");

    return api.sendMessage(
      getText(
        "moduleInfo",
        cmd.config.name,
        cmd.config.description,
        `${prefix}${cmd.config.name} ${cmd.config.usages || ""}`,
        cmd.config.commandCategory,
        cmd.config.cooldowns,
        perm,
        cmd.config.credits
      ),
      threadID,
      messageID
    );
  }

  // Paginated list of commands
  const allCmds = Array.from(commands.values()).map(
    (cmd, i) => `🔹 ${i + 1}. ${cmd.config.name}`
  );
  const totalCmds = allCmds.length;
  const totalEvts = global.client.events.size;
  const totalPages = Math.ceil(totalCmds / ITEMS_PER_PAGE);
  const page = Math.max(1, parseInt(args[0]) || 1);

  if (page > totalPages)
    return api.sendMessage(
      `❌ Page ${page} does not exist! Total pages: ${totalPages}`,
      threadID,
      messageID
    );

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageCmds = allCmds.slice(start, end).join("\n");
  const tip = tips[Math.floor(Math.random() * tips.length)];

  const msg = getText(
    "helpList",
    page,
    totalPages,
    pageCmds,
    totalCmds,
    totalEvts,
    tip
  );

  return api.sendMessage(msg, threadID, messageID);
};
module.exports.run = () => {}; // No manual run needed