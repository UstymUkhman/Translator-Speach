document.addEventListener('DOMContentLoaded', function () {
  var language = document.getElementById('language-field');
  var field    = document.getElementById('input-field');
  var file     = document.getElementById('file-field');

  function translateText () {
    var xhr = new XMLHttpRequest();
    var file = Date.now();

    xhr.open('POST', '/translate', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(encodeURI('message=' + field.value + '&file=' + file + '&lang=' + language.value + '&ua=' + navigator.userAgent));

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        console.log(xhr.responseText);
      }
    };
  }

  document.getElementById('translate').addEventListener('click', translateText);
});
