// async function testAPI() {
//     const msg = await fetch("https://api.telegram.org/bot7156880786:AAFvvQpiVQn7PcXeP49G-bg1TfwqDva4RKY/getUpdates").then(msg => msg.json());
//     console.log(msg.body);
// }

// testAPI().catch((err) => {console.log("ERROR in testAPI: " + err)});

const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '7156880786:AAFvvQpiVQn7PcXeP49G-bg1TfwqDva4RKY';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/start/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;

  console.log(chatId);
  console.log(typeof chatId);

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, "Hey there! I'm a bot that can help you with your WhatsApp messages. To get started, please send me your WhatsApp QR code.");
});