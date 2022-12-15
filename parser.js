const request = require('request-promise');
const jsdom = require("jsdom");
const fs = require("fs");
const { JSDOM } = jsdom;
const cookieJar = request.jar();

const rp = request.defaults({ jar: cookieJar, simple: false, followAllRedirects: true })

const site = 'https://uslugi.tatarstan.ru';

const init = async() => {
  const response = await rp.get(site);
  let dom = new JSDOM(response);
  const formEl = dom.window.document.getElementById('form1');
  const elements = [...formEl.elements];
  const form = {}
  elements.forEach(el => {
    let { value } = el;
    switch (el.name) {
      case 'user_login_form_model[phone_number]': {
        value = '9274615910'
        break;
      }
      case 'user_login_form_model[password]': {
        value = 'fgjrfkbgcbc'
        break;
      }
      default:
    }
    form[el.name] = value; //console.log(el.name, el.value)
  })
  await rp.post(`${site}/user/login`, {
    form,
  });

  const res = await rp.get(`${site}/edu?child_name=%D0%A1%D0%BE%D0%BA%D0%BE%D0%BB%D0%BE%D0%B2+%D0%94%D0%B0%D0%BD%D0%B8%D0%BB`)
  dom = new JSDOM(res);
  const idiary = dom.window.document.querySelector('.idiary-llp');

  const tr = [...idiary.querySelectorAll('tr')];
  const result = {

  }
  const skip = [0, 11, 22, 33, 34, 45, 56, 67];
  let currentDate;
  tr.forEach((item, i) => {
    if (skip.indexOf(i) === -1) {
      const date = getElemTd(item, 'td.tt-days')
      if (date) {
        currentDate = date;
        result[currentDate] = []
      }
      const subject = getElemTd(item, 'td.tt-subj')
      if (subject) {
        result[currentDate].push({
          subject,
          task: getElemTd(item, 'td.tt-task'),
          mark: getElemTd(item, 'td.tt-mark').replace(/\s/g, '').split('')
        })
      }
    }
  })

  return result;
  // fs.writeFile('output.txt', JSON.stringify(result), (err) => {
  //   if (!err) return console.log('Complete!')
  //   else {
  //     console.log(err)
  //   }
  // })
};

const getElemTd = (parent, query) => {
  const el = parent.querySelector(query);
  if (el) {
    return el.textContent.trim()
  }
  return '';
}

module.exports = init;
