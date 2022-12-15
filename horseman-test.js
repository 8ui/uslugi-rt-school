const Horseman = require('node-horseman');
const horseman = new Horseman();

const baseUrl = "https://bishkek.kdmid.ru/queue"
const page1 = `${baseUrl}/orderinfo.aspx?id=69665&cd=259bfd9d&ems=60064349`;

horseman
  .viewport(1200, 800)
  // .open("https://browser-info.ru/")
  .on("resourceReceived", (resource) => {
    if (resource.url.includes("data:") === false) console.log("resource.url", resource.url)
    console.log("resource.redirectURL", resource.redirectURL)
  })
  .cookies({
    "ASP.NET_SessionId": "nr1ls4jhtpnvc22f0oaau055",
    "AlteonP": "AWHLTo6SL8Hd4+5JWGNRcw$$",
    "__ddg1_": "A3UWCafYdMM4zzEn7Wxo",
    "__ddg2_": "1NsIQI4chUGkkFkk",
  })
  .open(page1)
  .wait(50_000)
  // .wait
  // .screenshot('browser-info.png')
  // .on("urlChanged")
  // .waitForSelector("#ctl00_MainContent_imgSecNum", {timeout: 11000})
  .screenshot('kdmid.png')
  .close();
