require("dotenv").config();
const { Client, MessageAttachment, MessageEmbed } = require("discord.js");
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const PREFIX = "$";
const cron = require('cron')
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI(process.env.NEWS_KEY);
var data = "";
const NewsData = () => {
  newsapi.v2
    .topHeadlines({
      language: "en",
      category: "technology",
    })
    .then((res) => {
      data = res.articles;
      for (let i = 0; i < 5; i++) {
        const file = new MessageAttachment(data[i].urlToImage);
        const exampleEmbed = new MessageEmbed()
          .setTitle(data[i].title)
          .setDescription(data[i].description)
          .setImage(data[i].urlToImage)
          .setURL(data[i].url)
          .setColor("BLUE");
        client.channels.cache
          .get("939195496961024030")
          .send({ embeds: [exampleEmbed] });
      }
    });
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
    
});
client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(" ");
    if (CMD_NAME == "news") {
      NewsData();
    }
  }
});
let scheduledMessage = new cron.CronJob('00 00 17 * * *', () => {
  // This runs every day at 17:00:00, you can do anything you want
  NewsData();
});
scheduledMessage.start()

client.login(process.env.BOT_TOKEN);
