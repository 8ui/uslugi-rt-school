const request = require('request-promise');
const jsdom = require("jsdom");
const prompt = require("prompt-sync")();
const userEvent = require('@testing-library/user-event')
const { JSDOM } = jsdom;
const cookieJar = request.jar();
const fs = require('fs')

const rp = request.defaults({ jar: cookieJar, simple: false, followAllRedirects: true })

const baseUrl = "https://bishkek.kdmid.ru/queue"
const page1 = `${baseUrl}/orderinfo.aspx?id=69665&cd=259bfd9d&ems=60064349`;

const page1CaptchaImgId = "ctl00_MainContent_imgSecNum"
const page1CaptchaInputId = "ctl00_MainContent_txtCode"
const page1SubmitButton = "ctl00_MainContent_ButtonA"

const init = async() => {
  const response = await rp.get(page1, {
    headers: {
      "User-Agent": "'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'"
    },
  });
  fs.writeFile("page1.txt", response,  "utf8", (err) => {
    console.log('page1 saved')
  })
  let dom = new JSDOM(response);
  const captchaImg = dom.window.document.getElementById(page1CaptchaImgId);
  console.log('captchaImg', captchaImg)
  console.log(`${baseUrl}/${captchaImg.src}`);
  const captchaValue = prompt("Введите код капчи")

  const captchaInput = dom.window.document.getElementById(page1CaptchaInputId);
  captchaInput.value = captchaValue;


  const submitButton = dom.window.document.getElementById(page1SubmitButton);
  const res = await userEvent.click(submitButton)
  console.log('res', res)
}

init();
