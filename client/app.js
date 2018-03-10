window.PLAY_AUDIO = false;

document.addEventListener('DOMContentLoaded', function () {
  var language = document.getElementById('language-field');
  var field    = document.getElementById('input-field');
  var file     = document.getElementById('file-field');

  var translation = document.getElementById('translated-text');
  var track = document.getElementById('audio-translation');

  function translateText () {
    var xhr  = new XMLHttpRequest();
    var file = Date.now();

    xhr.open('POST', '/translate', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(encodeURI('message=' + field.value + '&file=' + file + '&lang=' + language.value + '&ua=' + navigator.userAgent));

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        var response = JSON.parse(xhr.response);

        translation.textContent = response.text;
        track.src = response.audio;

        if (PLAY_AUDIO) {
          track.play();
        }
      }
    };
  }

  document.getElementById('translate').addEventListener('click', translateText);

  var recording = document.getElementById('record');
  var recognition = new webkitSpeechRecognition();
  var isRecording = false;
  var results = [];

  recognition.interimResults = true;
  recognition.continuous = true;

  recognition.onresult = function (event) {
    for (var result in event.results) {
      if (event.results[result].isFinal) {
        results.push(event.results[result][0].transcript);
      }
    }

    if (!isRecording && results.length) {
      answerQuestion();
    }
  };

  function toggleRecording (event) {
    if (!isRecording) {
      recording.textContent = 'Stop Recording';
      recognition.start();
    } else {
      recording.textContent = 'Start Recording';
      recognition.stop();
    }

    isRecording = !isRecording;
  }

  function answerQuestion () {
    var xhr  = new XMLHttpRequest();
    var file = Date.now();

    xhr.open('POST', '/answer', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(encodeURI('records=' + JSON.stringify(results) + '&file=' + file));

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        var response = JSON.parse(xhr.response);

        translation.textContent = response.text;
        track.src = response.answer;
        results = [];

        if (PLAY_AUDIO) {
          track.play();
        }
      }
    };
  }

  recording.addEventListener('click', toggleRecording);
});
