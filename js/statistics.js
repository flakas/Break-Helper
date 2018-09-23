$(document).ready(function () {
  var backgroundPage = chrome.extension.getBackgroundPage(),
    lastBreak = new Date();
  $('#breaks').html(backgroundPage.statistics.breaks);
  $('#skips').html(backgroundPage.statistics.skips);
  $('#1hourSkips').html(backgroundPage.statistics.hourSkips1);
  $('#4hourSkips').html(backgroundPage.statistics.hourSkips4);
  lastBreak.setTime(backgroundPage.statistics.lastBreak);
  $('#lastBreak').html(lastBreak.getFullYear()
    + '/' + lastBreak.getMonth()
    + '/' + lastBreak.getDate() + ' '
    + lastBreak.getHours() + ':'
    + lastBreak.getMinutes() + ':'
    + lastBreak.getSeconds());
  $('#rule').html(backgroundPage.rules[backgroundPage.settings.rule].name);
});
