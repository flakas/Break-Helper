var settings,
    statistics,
    timerRunning = false,
    fallback = false,
    rules = {
        "20-20-20": {
            "name" : "20-20-20",
            "workTime" : 20 * 60, // 20 minutes
            "breakTime" : 20      // 20 seconds
        },
        "50-10": {
            "name" : "50-10",
            "workTime" : 50 * 60, // 50 minutes
            "breakTime" : 10 * 60 // 10 minutes
        },
        "pomodoro": {
            "name" : "Pomodoro",
            "workTime" : 25 * 60, // 25 minutes
            "breakTime" : 5 * 60  // 5 minutes
        },
        "custom": {
            "name" : "Custom",
            "workTime" : 20 * 60, // Default 20 minutes
            "breakTime" : 20  // Default 20 seconds
        }
    };

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-22478295-2']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

if (typeof localStorage.settings === "undefined") {
    settings = {
        "rule" : "pomodoro",
        "workTime" : rules.pomodoro.workTime,
        "breakTime" : rules.pomodoro.breakTime,
        "playSound" : 0
    };
    localStorage.settings = JSON.stringify(settings); //If there are no settings, create default values
} else {
    settings = $.parseJSON(localStorage["settings"]);
    if(settings.rule == "custom") {
        rules["custom"].workTime = settings.workTime;
        rules["custom"].breakTime = settings.breakTime;
    }
}

if (typeof localStorage.statistics === "undefined") {
    statistics = {
        "breaks" : 0,
        "skips" : 0,
        "hourSkips1" : 0,
        "hourSkips4" : 0,
        "lastBreak" : 0
    };
    if (localStorage["breaks"] != null) { // For backwards compatibility
        statistics.breaks = localStorage["breaks"];
    }
    if (localStorage["skips"] != null) {
        statistics.skips = localStorage["skips"];
    }
    if (localStorage["1hourSkips"] != null) {
        statistics.hourSkips1 = localStorage["1hourSkips"];
    }
    if (localStorage["4hourSkips"] != null) {
        statistics.hourSkips4 = localStorage["4hourSkips"];
    }
    if (localStorage["lastBreak"] != null) {
        statistics.lastBreak = localStorage["lastBreak"];
    }
    localStorage["statistics"] = JSON.stringify(statistics); // If there are no stats, create default ones
} else {
    statistics = $.parseJSON(localStorage["statistics"]);
}
var notification, breakTime, workTime, rule, iCloseNotification = 0, timer, nextBreak, breakTimeLeft;
resetTimes();
$(document).ready(function () {
    chrome.notifications.onButtonClicked.addListener(handleNotificationInteraction);
    chrome.notifications.onClosed.addListener(handleNotificationClosed);
    waitForNext();
    updateBadge();
});

function resetTimes() {
    "use strict";
    if (settings.rule === "custom") {
        breakTime = settings.breakTime;
        workTime = settings.workTime;
    } else {
        breakTime = rules[settings.rule].breakTime;
        workTime = rules[settings.rule].workTime;
    }
}

function displayNotification() {
    "use strict";
    notification = chrome.notifications.create('bh-notification', {
        type: 'basic',
        title: 'Break Helper',
        message: "You've been working for quite a while, please take a break.",
        iconUrl: 'icon128.png',
        buttons: [
          { title: "Take a break" },
          { title: "Skip this break" }
        ],
        requireInteraction: true,
    });
    doSoundNotification();
    log("Displaying notification");
}

function handleNotificationInteraction(notificationId, buttonIndex) {
  if (notificationId === 'bh-notification') {
    if (buttonIndex === 0) {
      doBreak();
    } else if (buttonIndex === 1) {
      skipBreak();
      closeNotification();
    }
  }
}

function handleNotificationClosed(notificationId, byUser) {
  if (notificationId === 'bh-notification' && byUser && breakTimeLeft === 0) {
    skipBreak();
  }
}

function closeNotification() {
    "use strict";
    iCloseNotification = 1;
    chrome.notifications.clear('bh-notification', function (hasCleared) {
        notification = null;
        log("Closing notification: " + hasCleared);
        iCloseNotification = 0;
    });
}

function skipBreak() {
    "use strict";
    closeNotification();
    statistics.skips = parseInt(statistics.skips, 10) + 1;
    updateStatistics();
    waitForNext();
    log("Skipping break");
}

function skipForAnHour() {
    closeNotification();
    statistics.hourSkips1 = parseInt(statistics.hourSkips1, 10) + 1;
    updateStatistics();
    timer = setTimeout(displayNotification, 1000 * 60 * 60);
    setNextBreak(1000 * 60 * 60);
    log("Skipping break for an hour");
}

function skipFor4Hours() {
    closeNotification();
    statistics.hourSkips4 = parseInt(statistics.hourSkips4, 10) + 1;
    updateStatistics();
    timer = setTimeout(displayNotification, 1000 * 60 * 60 * 4);
    setNextBreak(1000 * 60 * 60 * 4);
    log("Skipping break for 4 hours");
}

function doBreak() {
    breakTimeLeft = breakTime;
    timer = setTimeout(waitAndClose, 1000 * breakTime);
    updateBreakNotificationTimer();
    log("Doing a break");
}

function updateBreakNotificationTimer() {
  if (breakTimeLeft <= 0) return;
  breakTimeLeft -= 1;
  var progress = breakTimeLeft / breakTime * 100;
  chrome.notifications.update('bh-notification', {
    type: 'progress',
    title: 'Break Helper',
    message: "You're on a break ($%1s).".replace("$%1s", secondsToClock(breakTimeLeft)),
    iconUrl: 'icon128.png',
    buttons: [],
    progress: Math.round(progress)
  });
  setTimeout(updateBreakNotificationTimer, 1000);
};

function waitAndClose() {
    closeNotification();
    var currentTime = new Date();
    statistics.breaks = parseInt(statistics.breaks, 10) + 1;
    statistics.lastBreak = currentTime.getTime();
    updateStatistics();
    waitForNext();
    log("Waiting and closing");
}

function waitForNext() {
    timer = setTimeout(displayNotification, 1000 * workTime);
    timerRunning = true;
    setNextBreak(1000 * workTime);
    log("Waiting for next break");
}

function updateSettings() {
    localStorage.settings = JSON.stringify(settings);
    log("Updating settings");
    reassignVariables();
}

function updateStatistics() {
    localStorage.statistics = JSON.stringify(statistics);
    log("Updating statistics");
}

function log(msg) {
    var d = new Date();
    var datetime = d.getFullYear() + '/' + d.getMonth() + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    console.log(datetime + ' ' + msg);
}

function reassignVariables() {
    settings = $.parseJSON(localStorage.settings);
    if (settings.rule === "custom") {
        rules.custom.workTime = settings.workTime;
        rules.custom.breakTime = settings.breakTime;
    }
    resetTimes();
    resetTimer();
}

function resetTimer() {
    stopTimer();
    if (notification !== null) {
        closeNotification();
    }
    waitForNext();
}

function stopTimer() {
    clearTimeout(timer);
    setNextBreak(0);
    timerRunning = false;
}

function getCurrentTimestamp() {
    return (new Date()).getTime();
}

function setNextBreak(time) {
    nextBreak = getCurrentTimestamp() + time;
}

function timeLeft() {
    var left = nextBreak - getCurrentTimestamp();
    return (left > 0) ? left : 0;
}

function updateBadgeClock() {
    var left = Math.round(timeLeft() / 1000),
        tempLeft,
        h,
        m,
        s;
    if (left > 0) {
        h = Math.floor(left / 3600);
        tempLeft = left % 3600;
        s = tempLeft % 60;
        m = (tempLeft - s) / 60;
        if (left > 300) {
            chrome.browserAction.setBadgeBackgroundColor({color : [0, 255, 0, 255]});
        }

        if (left <= 300 && left > 60) {
            chrome.browserAction.setBadgeBackgroundColor({color : [255, 140, 0, 255]});
        }

        if (left <= 60) {
            chrome.browserAction.setBadgeBackgroundColor({color : [255, 0, 0, 255]});
        }
        chrome.browserAction.setBadgeText({text: m.pad(2) + ':' + s.pad(2)});

    } else {
        chrome.browserAction.setBadgeBackgroundColor({color : [255, 0, 0, 255]});
        chrome.browserAction.setBadgeText({text: '00:00'});
    }
}

function updateBadge() {
    setTimeout(updateBadge, 1000);
    updateBadgeClock();
}

function playSound ( url ) {
    (new Audio(url)).play();
}

function doSoundNotification() {
  if (settings.playSound) {
    playSound('notification.mp3');
  }
}

function secondsToClock(leftSeconds) {
    var h, m, s, tempLeft;
    h = Math.floor(leftSeconds / 3600);
    tempLeft = leftSeconds % 3600;
    s = tempLeft % 60;
    m = (tempLeft - s) / 60;

    return h.pad(2) + ":" + m.pad(2) + ":" + s.pad(2);
}
Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}
