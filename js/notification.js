$(document).ready(function(){
	var backgroundPage = chrome.extension.getBackgroundPage();
	$("#takeBreak").click(function() {				
    backgroundPage._gaq.push(['_trackEvent', 'notification.button#takeBreak', 'clicked']);
		switch(backgroundPage.settings.rule) {
			case "20-20-20":
				$("#notificationContent").html("<h1>You're on a break</h1><p>Look at an object that is at least 20 feet away.</p><div id=\"timer\"></div>");
				break;
			case "50-10":
				$("#notificationContent").html("<h1>You're on a break</h1><p>Do some exercises for your eyes or look through the window</p><div id=\"timer\"></div>");
				break;
			case "pomodoro":
				$("#notificationContent").html("<h1>You're on a break</h1><p>Do some exercises for your eyes or look through the window</p><div id=\"timer\"></div>");
				break;
			case "custom":
				$("#notificationContent").html("<h1>You're on a break</h1><p>Remember to get up and move around a bit</p><div id=\"timer\"></div>");
				break;						
		}
		drawTimer();
		backgroundPage.doBreak();			
	});
	
	$("#skipBreak").click(function(){
		backgroundPage.skipBreak();
    backgroundPage._gaq.push(['_trackEvent', 'notification.button#skipBreak', 'clicked']);
	});
	
	$("#skipForAnHour").click(function(){
		backgroundPage.skipForAnHour();
    backgroundPage._gaq.push(['_trackEvent', 'notification.button#skipForAnHour', 'clicked']);
	});
	
	$("#skipFor4Hours").click(function(){
		backgroundPage.skipFor4Hours();
    backgroundPage._gaq.push(['_trackEvent', 'notification.button#skipFor4Hours', 'clicked']);
	});
	
	switch(backgroundPage.settings.rule){
		case "20-20-20":
			$("h1").html("20 minutes are up <br />take a break!");
			break;
		case "50-10":
			$("h1").html("50 minutes are up <br />take a break!");
			break;
		case "pomodoro":
			$("h1").html("25 minutes are up <br />take a break!");
			break;
		case "custom":
			$("h1").html(backgroundPage.settings.workTime + " seconds are up <br />take a break!");
			break;
	}				
});
$(window).unload(function(){
	var backgroundPage = chrome.extension.getBackgroundpage();
	if(backgroundPage.iCloseNotification == 0) {
		backgroundPage.skipBreak();
	}
});
var backgroundPage = chrome.extension.getBackgroundPage();
var timerLeft = backgroundPage.rules[backgroundPage.settings.rule].breakTime;				
	function drawTimer() {
		var timer = $("#timer");
		var minutes, seconds;
		timerLeft -= 1;
		if(timerLeft <= 0)
		{
			if(backgroundPage.settings.playSound == 1) 
			{
				playSound('beep.mp3');	
			}				
			timer.html('Finished!');	
		} else
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
	function playSound( url ){   
		//$("body").append("<embed src=\""+url+"\" hidden=\"true\" autostart=\"true\" loop=\"false\" width=\"0\" height=\"0\">");
		$("body").append("<audio src=\"" + url + "\" autoplay=\"autoplay\" style=\"width:0;height:0;\"></audio>");
		//$("#sound").attr('src', url);
		//document.sound.play();
	}
