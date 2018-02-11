// Complete cURL request:
// curl -s -o hello_world.mp3 "https://translate.google.com/translate_tts?ie=UTF-8&q=Hello%20World!&tl=en-US&client=tw-ob"
//  -H "User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.75 Safari/537.36"
//  -H "Referer: https://translate.google.com/?hl=en"
//  -H "Accept-Encoding: identity;q=1, *;q=0"
//  -H "Range: bytes=0-"
//  --compressed [&& mpg123 -q hello_world.mp3 &]


'use strict';

var exec     = require('child_process').exec,
    parser   = require('body-parser'),
    express  = require('express'),
    request  = require('request'),
    app      = express();

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../client'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/translate', function (req, res) {
  const URL = `https://translate.google.com/translate_tts?ie=UTF-8&q=${req.body.message}&tl=en-US&client=tw-ob`;
  const MP3 = `./translations/${req.body.file}.mp3`;
  let headersString = '';

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36', // 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.75 Safari/537.36',
    'Referer': 'https://translate.google.com/?hl=en',
    'Accept-Encoding': 'identity;q=1, *;q=0',
    'Range': 'bytes=0-'
  };

  for (let h in headers) {
    headersString += ` -H "${h}: ${headers[h]}"`
  }

  console.log(`curl -s -o ${MP3} "${URL}" ${headersString} --compressed`);

  // exec(`curl -s -o ${MP3} "${URL}" ${headersString} --compressed`, function (error, stdout, stderr) {
  //   if (error) {
  //     console.log(error);
  //     res.status(500).send('D:');
  //   }
  // });

  // request(call, function (error, response, body) {
  //   console.log(response);
  //   res.status(response.statusCode).send(file);
  // });

  // var mp3 = fs.createWriteStream(file);

  // request.post(call)
  //   .on('error', function (err) {
  //     console.log(err);
  //   })

  //   .on('data', function (data) {
  //     mp3.write(data);
  //   })

  //   .on('end', function(){
  //     mp3.end();
  //     res.status(200).send(file);
  //   });
});


app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
  console.log('Server is Running on port ' + app.get('port') + '...');
});
