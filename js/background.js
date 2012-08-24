var settings, statistics, rules = [];
rules["20-20-20"] = {
	"name" : "20-20-20",
	"workTime" : 20 * 60, // 20 minutes
	"breakTime" : 20, // 20 seconds
};
rules["50-10"] = {
	"name" : "50-10",
	"workTime" : 50 * 60, // 50 minutes
	"breakTime" : 10 * 60, // 10 minutes
}
rules["pomodoro"] = {
	"name" : "Pomodoro",
	"workTime" : 25 * 60, // 25 minutes
	"breakTime" : 5 * 60, // 5 minutes
}
rules["custom"] = {
	"name" : "Custom",
	"workTime" : 20 * 60, // Default 20 minutes
	"breakTime" : 20, // Default 20 seconds
}
if(localStorage["settings"] == null) {
	settings = { 
		"rule" : "pomodoro",		
		"workTime" : rules["pomodoro"].workTime,
		"breakTime" : rules["pomodoro"].breakTime, 
		"playSound" : 0,
	};		
	if(localStorage["rule"] != null) { //For backwards compatibility
		settings.rule = localStorage["rule"];
		if(localStorage["rule"] == "custom") {
			rules["custom"].workTime = localStorage["workTime"];
			rules["custom"].breakTime = localStorage["breakTime"];
		}
	}
	localStorage["settings"] = JSON.stringify(settings); //If there are no settings, create default values
} else {
	settings = $.parseJSON(localStorage["settings"]);
	if(settings.rule == "custom") {
            rules["custom"].workTime = settings.workTime;
            rules["custom"].breakTime = settings.breakTime;
	}
}

if(localStorage["statistics"] == null) {
	statistics = {
		"breaks" : 0,
		"skips" : 0,
		"hourSkips1" : 0,
		"hourSkips4" : 0,
		"lastBreak" : 0,
	};
	if(localStorage["breaks"] != null) { // For backwards compatibility
		statistics.breaks = localStorage["breaks"];
	}
	if(localStorage["skips"] != null) {
		statistics.skips = localStorage["skips"];
	}
	if(localStorage["1hourSkips"] != null) {
		statistics.hourSkips1 = localStorage["1hourSkips"];
	}
	if(localStorage["4hourSkips"] != null) {
		statistics.hourSkips4 = localStorage["4hourSkips"];
	}
	if(localStorage["lastBreak"] != null) {
		statistics.lastBreak = localStorage["lastBreak"];
	}
	localStorage["statistics"] = JSON.stringify(statistics); // If there are no stats, create default ones
} else {
	statistics = $.parseJSON(localStorage["statistics"]);
}
var notification, breakTime, workTime, rule, enableSound, iCloseNotification = 0, timer, nextBreak;
resetTimes();
$(document).ready(function(){
	waitForNext();	
});

function resetTimes()
{
	if(settings.rule == "custom") {
		breakTime = settings.breakTime;
		workTime = settings.workTime;
	} else {
		breakTime = rules[settings.rule].breakTime;
		workTime = rules[settings.rule].workTime;
	}
}

function displayNotification()
{
	notification = webkitNotifications.createHTMLNotification('notification.html');
	notification.onclose = function() {
		if(iCloseNotification == 0) {
			skipBreak();
		}
	};
	notification.show();
	log("Displaying notification");
}

function closeNotification()
{
	iCloseNotification = 1;
	notification.cancel();
	notification.onclose = null;
	notification = null;
	log("Closing notification");
	iCloseNotification = 0;
}

function skipBreak()
{
	closeNotification();
	statistics.skips = parseInt(statistics.skips) + 1;
	updateStatistics();
	waitForNext();
	log("Skipping break");
}	

function skipForAnHour()
{
	closeNotification();
	statistics.hourSkips1 = parseInt(statistics.hourSkips1) + 1;
	updateStatistics();
	timer = setTimeout("displayNotification()", 1000 * 60 * 60);
	setNextBreak(1000 * 60 * 60);
	log("Skipping break for an hour");
}

function skipFor4Hours()
{
	closeNotification();
	statistics.hourSkips4 = parseInt(statistics.hourSkips4) + 1;
	updateStatistics();
	timer = setTimeout("displayNotification()", 1000 * 60 * 60 * 4);
	setNextBreak(1000 * 60 * 60 * 4);
	log("Skipping break for 4 hours");
}

function doBreak()
{
	timer = setTimeout("waitAndClose()", 1000 * breakTime);
	log("Doing a break");
}

function waitAndClose()
{
	closeNotification();
	var currentTime = new Date();
	statistics.breaks = parseInt(statistics.breaks) + 1;
	statistics.lastBreak = currentTime.getTime();
	updateStatistics();
	waitForNext();
	log("Waiting and closing");
}

function waitForNext()
{
	timer = setTimeout("displayNotification()", 1000 * workTime);
	setNextBreak(1000 * workTime);
	log("Waiting for next break");
    chrome.browserAction.setBadgeBackgroundColor({color : [255, 0, 0, 255]});
    chrome.browserAction.setBadgeText({text: '00:00'});
}

function updateSettings()
{
	localStorage["settings"] = JSON.stringify(settings);
        log("Updating settings");
        reassignVariables();
}

function updateStatistics()
{
	localStorage["statistics"] = JSON.stringify(statistics);
	log("Updating statistics");
}

function log(msg)
{
	var d = new Date();
	var datetime = d.getFullYear() + '/' + d.getMonth() + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
	console.log(datetime + ' ' + msg);
}

function reassignVariables()
{
    settings = $.parseJSON(localStorage["settings"]);
    if(settings.rule == "custom") {
        rules["custom"].workTime = settings.workTime;
        rules["custom"].breakTime = settings.breakTime;
    }
    resetTimes();
    resetTimer();
}

function resetTimer() {
	clearTimeout(timer);
	if(notification != null) {
		closeNotification();
	}
	waitForNext();
}

function getCurrentTimestamp() {
	return (new Date()).getTime();
}

function setNextBreak(time) {
	nextBreak = getCurrentTimestamp() + time;
}
