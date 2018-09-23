var backgroundPage = chrome.extension.getBackgroundPage();
$(document).ready(function () {
  //drawTimer();
  $('.iconReset').bind('click', reset_timer);
  $('.iconStop').bind('click', stop_timer);
});

function drawTimer() {
  'use strict';
  var nextBreak = backgroundPage.nextBreak,
    timer = $('#timer'),
    minutes,
    seconds,
    timerLeft;
  timerLeft = Math.round((nextBreak - backgroundPage.getCurrentTimestamp()) / 1000);
  if (timerLeft >= 0) {
    seconds = timerLeft % 60;
    minutes = (timerLeft - seconds) / 60;
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    timer.html(minutes + ':' + seconds);

  }
  setTimeout(drawTimer, 1000);
}

function reset_timer() {
  'use strict';
  backgroundPage.app.restart();
}

function stop_timer() {
  'use strict';
  backgroundPage.app.stop();
}
