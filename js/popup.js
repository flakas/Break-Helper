var backgroundPage = chrome.extension.getBackgroundPage();
$(document).ready(function(){
	drawTimer();
  $('.iconReset').click(function() {
    backgroundPage._gaq.push(['_trackEvent', 'button-reset', 'clicked']);
  });
  $('.iconInfo').click(function() {
    backgroundPage._gaq.push(['_trackEvent', 'button-statistics', 'clicked']);
  });
  $('.iconPreferences').click(function() {
    backgroundPage._gaq.push(['_trackEvent', 'button-options', 'clicked']);
  });
});
function drawTimer() {
	var nextBreak = backgroundPage.nextBreak;
	var timer = $("#timer");
	var minutes, seconds;
	timerLeft = Math.round((nextBreak - backgroundPage.getCurrentTimestamp()) / 1000);
	if(timerLeft >= 0)
	{
		seconds = timerLeft % 60;						
		minutes = (timerLeft - seconds) / 60;	
		if(seconds < 10) 
		{
			seconds = '0' + seconds;
		}
		if(minutes < 10)
		{
			minutes = '0' + minutes;
		}
		timer.html(minutes + ':' + seconds);
			
	}								
	setTimeout("drawTimer()", 1000);
}

function reset_timer() {
	backgroundPage.resetTimer();
}
