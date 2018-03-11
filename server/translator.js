// Complete cURL request:
// curl -s -o hello_world.mp3 "https://translate.google.com/translate_tts?ie=UTF-8&q=Hello%20World!&tl=en-US&client=tw-ob"
//  -H "User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.75 Safari/537.36"
//  -H "Referer: https://translate.google.com/?hl=en"
//  -H "Accept-Encoding: identity;q=1, *;q=0"
//  -H "Range: bytes=0-"
//  --compressed


'use strict';

var translate = require('google-translate-api'),
    exec      = require('child_process').exec,
    parser    = require('body-parser'),
    express   = require('express'),
    app       = express();


const ANSWERS = new Map([
  [{mp3: 'chewbacca'}, ['understand', 'you']],
  [{mp3: 'sparta'}, ['what', 'is', 'this']],
  [{mp3: 'sparta'}, ['where', 'are']],
  [{mp3: 'what'}, ['what']]
]);


app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../client'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/translate', function (req, res) {
  const MP3  = `audio/${req.body.message.replace(new RegExp(' ', 'g'), '-')}_${req.body.file}.mp3`;
  const LANG = req.body.lang.includes('zh') ? req.body.lang : req.body.lang.slice(0, 2);

  translate(req.body.message, {to: LANG}).then(response => {
    const URL = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURI(response.text)}&tl=${req.body.lang}&client=tw-ob`;
    const playCommand = `omxplayer -o local ./client/${MP3}`;

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

    exec(`curl -s -o ./client/${MP3} "${URL}" ${headersString} --compressed && ${playCommand}`, function () {
      res.status(200).send({ text: response.text, audio: MP3 });
    });
  });
});

app.post('/answer', function (req, res) {
  const records = JSON.parse(req.body.records);

  for (const record of records) {
    const question = record.trim().toLowerCase();

    for (const [answer, keyWords] of ANSWERS) {
      let check = true;

      for (const word of keyWords) {
        if (!question.includes(word)) {
          check = false;
          break;
        }
      }

      if (check) {
        return playAnswerTrack(res, answer.mp3);
      }
    }
  }

  playAnswerTrack(res);
});

function playAnswerTrack (res, answer = 'default') {
  const answerTrack = `answers/${answer}.mp3`;

  exec(`omxplayer -o local ./client/${answerTrack}`, function () {
    res.status(200).send({ text: answer, answer: answerTrack });
  });
}

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
  console.log('Server is Running on port ' + app.get('port') + '...');
});
