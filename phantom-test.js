const phantom = require('phantom');

const baseUrl = "https://bishkek.kdmid.ru/queue"
const page1 = `${baseUrl}/orderinfo.aspx?id=69665&cd=259bfd9d&ems=60064349`;

(async function() {
  const instance = await phantom.create();
  const page = await instance.createPage();
  await page.property('viewportSize', {width: 800, height: 600});
  await page.setting('javascriptEnabled');
  await page.setting(
    'userAgent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
  );
  await page.addCookie({
    "ASP.NET_SessionId": "nr1ls4jhtpnvc22f0oaau055",
    "AlteonP": "AWHLTo6SL8Hd4+5JWGNRcw$$",
    "__ddg1_": "A3UWCafYdMM4zzEn7Wxo",
    "__ddg2_": "1NsIQI4chUGkkFkk",
  })
  await page.on('onResourceRequested', function(requestData) {
    console.info('Requesting', requestData.url);
  });
  const status = await page.open(page1);
  const content = await page.property('content');
  console.log(content);

  await instance.exit();
})();
