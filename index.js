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
  try {
    const chatId = msg.chat.id;
    
    // send back the matched "whatever" to the chat
    index.sendMessage(chatId, 'Здравствуйте, это Телеграм Бот для просмотра оценок в школе. Данные берутся с портала Услуги РТ.');
    
    await db.push('users', {
      chatId,
      firstName: msg.from.first_name,
      username: msg.from.username,
      license: msg.text,
    });
  } catch (e) {
    console.log(e)
  }
});

const getCurrentDate = (data) => {
  const date = (new Date()).getDate();
  return data[date] || []
}

const getNextDate = (data) => {
  const tomorrow = new Date();
  tomorrow.setDate(new Date().getDate() + 1);
  return data[tomorrow.getDate()] || []
}

const sendMarks = async(data) => {
  const users = await db.get('users');
  const currentDate = getCurrentDate(data);
  users.forEach((user) => {
    const marks = currentDate
      .filter(n => n.mark.length)
      .map(n => `<code>${n.mark.join(' ')}</code> - ${n.subject}`)
    const marksTitle = '<b>Оценки за сегодня</b>\n'
    index.sendMessage(user.chatId, `${marksTitle}${marks.join('\n')}`, { parse_mode: 'HTML' });
  })
}

const sendTasks = async(data) => {
  const users = await db.get('users');
  const nextDate = getNextDate(data);
  console.log('nextDate', nextDate)
  users.forEach((user) => {
    const tasks = nextDate
      .map(n => `${n.subject} - <code>${n.task}</code>`)
    const tasksTitle = '<b>Домашнее задание на завтра</b>\n'
    index.sendMessage(user.chatId, `${tasksTitle}${tasks.join('\n')}`, { parse_mode: 'HTML' });
  })
}

const app = express();
const port = 8082;
// parse the updates to JSON
app.use(express.json());

// We are receiving updates at the route below!
app.get('/start', async(req, res) => {
  const data = await parser();
  await db.push('data', data);
  await sendMarks(data);
  await sendTasks(data);
  res.send('OK');
});

// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});

// (async() => {
//   const [data] = await db.get('data');
//   await sendMarks(data);
//   await sendTasks(data);
//   console.log('done')
// })()