const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const db = require('./db')
const parser = require('./parser');

// replace the value below with the Telegram token you receive from @BotFather
const token = '1791208940:AAGtX_BhXmRSPDJ1Wd9aI1Gj1VcUhlw3LKY';

// Create a bot that uses 'polling' to fetch new updates
const index = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
index.onText(/\/start/, async(msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chatId = msg.chat.id;
  
  await db.push('users', {
    chatId,
    firstName: msg.from.first_name,
    username: msg.from.username,
    license: msg.text,
  });
  
  // send back the matched "whatever" to the chat
  index.sendMessage(chatId, 'Здравствуйте, это Телеграм Бот для просмотра оценок в школе. Данные берутся с портала Услуги РТ.');
});

const app = express();
const port = 8082;
// parse the updates to JSON
app.use(express.json());

// We are receiving updates at the route below!
app.get(`/start`, async(req, res) => {
  const data = await parser();
  await db.push('data', data);
  res.sendStatus(200);
});

// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});