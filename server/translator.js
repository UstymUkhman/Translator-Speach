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


const FUNNY_ANSWERS = new Map([
  [{mp3: 'chewbacca'}, ['understand', 'me']],
  [{mp3: 'sparta'}, ['what', 'is', 'this']],
  [{mp3: 'sparta'}, ['where', 'are']],
  [{mp3: 'what'}, ['what']],

  [{mp3: 'acting'}, ['you', 'like', 'acting']],
  [{mp3: 'acting'}, ['can', 'you', 'act']],
  [{mp3: 'laugh'}, ['think', 'funny']],

  [{mp3: 'hi'}, ['hello']],
  [{mp3: 'hi'}, ['ciao']],
  [{mp3: 'hi'}, ['hi']]
]);

const SMART_ANSWERS = new Map([
  [{message: 'I might be older than you expect'}, ['how', 'old', 'you']],
  [{message: 'It looks like hell'}, ['what', 'is', 'this']],
  [{message: 'We are in school'}, ['where', 'are']]
]);


app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../client'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/translate', (req, res) => {
  playTranslatedMessage(res, {
    message: req.body.message,
    timestamp: req.body.now,
    lang: req.body.lang,
    ua: req.body.ua
  });
});

app.post('/answer', (req, res) => {
  const smart   = req.body.smart === 'true';
  const records = JSON.parse(req.body.records);
  const ANSWERS = smart ? SMART_ANSWERS : FUNNY_ANSWERS;

  const info = {
    now: req.body.now,
    ua: req.body.ua
  };

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
        return playAnswerTrack(res, smart, info, answer);
      }
    }
  }

  playAnswerTrack(res, smart, info);
});


const playTranslatedMessage = (res, query) => {
  const MP3  = `audio/${query.message.replace(new RegExp(' ', 'g'), '-')}_${query.timestamp}.mp3`;
  const LANG = query.lang.includes('zh') ? query.lang : query.lang.slice(0, 2);

  translate(query.message, {to: LANG}).then(response => {
    const URL = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURI(response.text)}&tl=${query.lang}&client=tw-ob`;
    const playCommand = `omxplayer -o local ./client/${MP3}`;

    const headers = {
      'Referer': `https://translate.google.com/?hl=${query.lang.slice(0, 2)}`,
      'Accept-Encoding': 'identity;q=1, *;q=0',
      'User-Agent': query.ua,
      'Range': 'bytes=0-'
    };

    let headersString = '';

    for (let h in headers) {
      headersString += ` -H "${h}: ${headers[h]}"`
    }

    exec(`curl -s -o ./client/${MP3} "${URL}" ${headersString} --compressed && ${playCommand}`, () => {
      res.status(200).send({ text: response.text, audio: MP3 });
    });
  });
};

const playAnswerTrack = (res, smart, info, answer = null) => {
  let unexpectedAnswer = '';
  let expectedAnswer = '';

  if (answer === null) {
    unexpectedAnswer = smart ? 'I\'m sorry, I haven\'t understood your question' : 'default';
  } else {
    expectedAnswer = smart ? answer.message : answer.mp3;
  }

  const answerMessage  = answer ? expectedAnswer : unexpectedAnswer;

  if (smart) {
    playTranslatedMessage(res, {
      message: answerMessage,
      timestamp: info.now,
      lang: 'en-US',
      ua: info.ua
    });
  } else {
    const answerTrack = `answers/${answerMessage}.mp3`;

    exec(`omxplayer -o local ./client/${answerTrack}`, () => {
      res.status(200).send({ text: answerMessage, audio: answerTrack });
    });
  }
}


app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
  console.log('Server is Running on port ' + app.get('port') + '...');
});
