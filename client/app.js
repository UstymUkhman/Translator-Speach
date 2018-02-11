document.addEventListener('DOMContentLoaded', function () {
  function translateText () {
    var text = encodeURI(field.value),
        xhr  = new XMLHttpRequest(),
        file = 'file';

    console.log(text);

    xhr.open('POST', '/translate', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(encodeURI('file=' + file + '&message=' + text));

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        console.log(xhr.responseText);
      }
    };
  }

  var field = document.getElementById('input-field');
  document.getElementById('translate').addEventListener('click', translateText);
});
