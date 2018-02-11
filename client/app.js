window.SHOW_AUDIO = false;

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

        if (SHOW_AUDIO) {
          track.style.visibility = 'visible';
        }
      }
    };
  }

  document.getElementById('translate').addEventListener('click', translateText);
});
