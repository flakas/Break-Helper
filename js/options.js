$(document).ready(function () {
  restore_options();

  $('input[name=rule]').change(function () {

    if ($('input[name=rule]:checked').val() === 'custom') {
      $('#customForm').show('fast');
    } else {
      $('#customForm').hide('fast');
    }
  });

  $('#apply').click(function () {
    var backgroundPage = chrome.extension.getBackgroundPage()
    let workTime = $('#workTime').val()
    let breakTime = $('#breakTime').val()
    let rule = $('input[name=rule]:checked').val()
    backgroundPage.app.settings.set('rule', rule)
    if (rule !== 'custom') {

    }
    backgroundPage.app.settings.set('workTime', $('#workTime').val())
    backgroundPage.app.settings.set('breakTime', $('#breakTime').val())
    backgroundPage.app.settings.set('playSound', $('input[name=playSound]:checked').val())
    $('#status').hide('fast');
    $('#status').html("<font color='green'>Options were successfuly applied.</font>");
    $('#status').show('fast');
    setTimeout(function () {
      $('#status').hide('fast');
    }, 2000);

    // Apply new settings
    backgroundPage.app.restart()
  });
});

// Restores select box state to saved value from localStorage.
function restore_options() {
  var backgroundPage = chrome.extension.getBackgroundPage(),
    rule = backgroundPage.app.settings.get('rule'),
    playSound = backgroundPage.app.settings.get('playSound'),
    breakTime = backgroundPage.app.settings.get('breakTime'),
    workTime = backgroundPage.app.settings.get('workTime');

  if (rule) {
    $('input[name=rule][value=' + rule + ']').attr('checked', true);
    if (rule === 'custom') {
      $('#customForm').show('fast');
    }
  }
  if (playSound) {
    $('input[name=playSound][value=' + playSound + ']').attr('checked', true);
  }
  if (breakTime) {
    $('#breakTime').val(breakTime);
  }
  if (workTime) {
    $('#workTime').val(workTime);
  }

}
