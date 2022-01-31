const request = require('request-promise');
const jsdom = require("jsdom");

const { JSDOM } = jsdom;

const cookieJar = request.jar();
const rp = request.defaults({ jar: cookieJar, simple: false, followAllRedirects: true })

const parserSchool = async() => {
  const URL = "https://edu.tatar.ru/n_chelny/sch14/page3557061.htm";
  const response = await rp.get(URL);
  return response.length;
}

module.exports = parserSchool;
