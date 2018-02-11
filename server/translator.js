// Complete cURL request:
// curl -s -o hello_world.mp3 "https://translate.google.com/translate_tts?ie=UTF-8&q=Hello%20World!&tl=en-US&client=tw-ob"
//  -H "User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.75 Safari/537.36"
//  -H "Referer: https://translate.google.com/?hl=en"
//  -H "Accept-Encoding: identity;q=1, *;q=0"
//  -H "Range: bytes=0-"
//  --compressed [&& mpg123 -q hello_world.mp3 &]


'use strict';

var translate = require('google-translate-api'),
    exec      = require('child_process').exec,
    parser    = require('body-parser'),
    express   = require('express'),
    request   = require('request'),
    app       = express();

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../client'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/translate', function (req, res) {
  const MP3  = `./translations/${req.body.message.replace(new RegExp(' ', 'g'), '-')}_${req.body.file}.mp3`;
  const LANG = req.body.lang.includes('zh') ? req.body.lang : req.body.lang.slice(0, 2);

  translate(req.body.message, {to: LANG}).then(res => {
    const URL = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURI(res.text)}&tl=${req.body.lang}&client=tw-ob`;

    const headers = {
      'Referer': `https://translate.google.com/?hl=${req.body.lang.slice(0, 2)}`,
      'Accept-Encoding': 'identity;q=1, *;q=0',
      'User-Agent': req.body.ua,
      'Range': 'bytes=0-'
    };

    let headersString = '';

    for (let h in headers) {
      headersString += ` -H "${h}: ${headers[h]}"`
    }

    exec(`curl -s -o ${MP3} "${URL}" ${headersString} --compressed`, function () {
      res.status(200).send({ text: res.text, audio: MP3 });
    });
  });
});

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
  console.log('Server is Running on port ' + app.get('port') + '...');
});
