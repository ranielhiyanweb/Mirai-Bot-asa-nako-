const axios = require("axios");
const fs = require("fs");
const request = require("request");
const path = require("path");

module.exports.config = {
  name: "download",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Aminul Sordar",
  description: "Automatically receive link in command and download video",
  commandCategory: "media",
  usages: "[any text containing links]",
  cooldowns: 5,
  dependencies: {
    axios: "",
    request: ""
  }
};

module.exports.languages = {
  en: {
    wait: "",
    noLink: " ",
    unsupported: " ",
    error: " "
  },
  
};

module.exports.run = async function({ api, event, args, getText }) {
  const { threadID, messageID } = event;
  const input = args.join(" ");

  // Tìm link đầu tiên trong input
  const linkMatch = input.match(/(https?:\/\/[^\s]+)/);
  if (!linkMatch) {
    return api.sendMessage(getText("noLink"), threadID, messageID);
  }

  const url = linkMatch[0];
  api.sendMessage(getText("wait"), threadID, messageID);
  api.setMessageReaction("⏳", messageID, () => {}, true);

  try {
    // Gọi API lấy data video
    const res = await axios.get(`https://nayan-video-downloader.vercel.app/alldown?url=${encodeURIComponent(url)}`);
    const data = res.data?.data;

    if (!data || (!data.high && !data.low)) {
      return api.sendMessage(getText("unsupported"), threadID, messageID);
    }

    const { title, high, low } = data;
    const videoUrl = high || low;

    // Tạo folder cache nếu chưa có
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const filePath = path.join(cacheDir, `video_${Date.now()}.mp4`);
    const caption = `🎬 Title: ${title}`;

    // Tải video về và gửi
    request(videoUrl)
      .pipe(fs.createWriteStream(filePath))
      .on("close", () => {
        api.sendMessage(
          { body: caption, attachment: fs.createReadStream(filePath) },
          threadID,
          () => {
            fs.unlinkSync(filePath);
            api.setMessageReaction("✅", messageID, () => {}, true);
          }
        );
      });
  } catch (err) {
    console.error(" error ", err);
    api.sendMessage(getText("error"), threadID, messageID);
    api.setMessageReaction(" ", messageID, () => {}, true);
  }
};
