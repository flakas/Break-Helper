var backgroundPage = chrome.extension.getBackgroundPage();
$(document).ready(function () {
  setInterval(drawTimer, 1000);
  drawTimer();
  $('.iconReset').bind('click', reset_timer);
  $('.iconStop').bind('click', stop_timer);
});

function drawTimer() {
  'use strict';
  var timerLeft = backgroundPage.app.state.timer.timeLeft,
    timer = $('#timer'),
    minutes,
    seconds;
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
}

function reset_timer() {
  'use strict';
  backgroundPage.app.restart();
}

function stop_timer() {
  'use strict';
  backgroundPage.app.stop();
}
