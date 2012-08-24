$(document).ready(function(){
	restore_options();
	
	$("input[name=rule]").change(function(){
		
		if($("input[name=rule]:checked").val() == "custom")
		{
			$("#customForm").show("fast");
		} else {
			$("#customForm").hide("fast");
		}
	});
	
	$("#apply").click(function(){
		var backgroundPage = chrome.extension.getBackgroundPage();
		backgroundPage.settings.rule = $("input[name=rule]:checked").val();
		backgroundPage.settings.workTime = $("#workTime").val();
		backgroundPage.settings.breakTime = $("#breakTime").val();
		backgroundPage.settings.playSound = $("input[name=playSound]:checked").val();
		backgroundPage.updateSettings();
		$("#status").hide("fast");
		$("#status").html('<font color="green">Options were successfuly applied.</font>');
		$("#status").show("fast");
		setTimeout(function(){
			$("#status").hide("fast");
		}, 2000);
    backgroundPage._gaq.push(['_trackEvent', 'settings:' + backgroundPage.settings.rule + ' ' + backgroundPage.settings.workTime + ' ' + backgroundPage.settings.breakTime + ' ' + backgroundPage.settings.playSound, 'updated']);
		
	});
});

// Restores select box state to saved value from localStorage.
function restore_options() {
	var backgroundPage = chrome.extension.getBackgroundPage();
	var rule = backgroundPage.settings.rule;
	var playSound = backgroundPage.settings.playSound;
	
    if (!rule) {
		//return;
	} else {
		$("input[name=rule][value=" + rule + "]").attr('checked', true);  
		if(rule == "custom")
		{
			$("#customForm").show("fast");
		}
	}
	if (playSound == null) {
		//return;
	} else {
		$("input[name=playSound][value=" + playSound + "]").attr('checked', true);  
	}
	if (backgroundPage.settings.breakTime == null) {
		//return;
	} else {
		$("#breakTime").val(backgroundPage.settings.breakTime);  
	}
	if (backgroundPage.settings.workTime == null) {
		//return;
	} else {
		$("#workTime").val(backgroundPage.settings.workTime);  
	}
	
}
