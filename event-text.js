// For simplicity this calendar has no backend.
// An event is displayed as a sentence below the event creation dialogue
// with the details of the event in readable English.


/////////////////////////////////////////////////////////////////////////////
// New Event Creation
/////////////////////////////////////////////////////////////////////////////

$(function() {
	$('#create-event-button').click(function() {
		if (checkInputs()) {
			writeEventToScreen(getEventText());
		}
	});
});

// End time must come after start time
function isValidEndTime() {
	var startTime = $('#event-start-date').datetimepicker('getValue');
	var endTime = $('#event-end-date').datetimepicker('getValue');
    return !(endTime < startTime);
}
function checkInputs() {
	if(!$("#event-name").val()){
		writeEventToScreen('Please enter an event name');
		$("#event-name").focus();
		return false;
	}
	if(!$("#event-location").val()){
		writeEventToScreen('Please enter an event location');
		$("#event-location").focus();
		return false;
	}

	if ($('#all-day-event-checkbox').is(':checked')) {
		if (!$('#all-day-event-date').val()) {
			writeEventToScreen('Please enter the date for an all day event'); 
			$("#all-day-event-date").focus();
			return false;
		}
	
	else if(!$('#recurrent-event-end-date').val() && $('#recurrent-event-type-selector').val()!="none") {
		writeEventToScreen('Please enter the repeat end date');
		$("#recurrent-event-end-date").focus();
		return false;
	}
	else{
		return true;
	}
	}
	if(!$("#event-start-date").val()){
		writeEventToScreen('Please enter the start date');
		$("#event-start-date").focus();
		return false;
	}
	if(!$("#event-end-date").val()){
		writeEventToScreen('Please enter the end date');
		$("#event-end-date").focus();
		return false;
	}
	if (!isValidEndTime()) {
		writeEventToScreen('End date must come after start date.');
		return false;
	}

	if(!$("#recurrent-event-end-date").val()){
		writeEventToScreen('Please enter the repeating end date');
		$("#recurrent-event-end-date").focus();
		return false;
	}

	if(!$('#recurrent-event-end-date').val() && $('#recurrent-event-type-selector').val()!="none") {
		writeEventToScreen('Please enter the repeat end date');
		$("#recurrent-event-end-date").focus();
		return false;
	}



	var frequency = $('#' + $('#recurrent-event-time-selector').val() + '-recurrent-freq').val();
	console.log(frequency);
	if (!$.isNumeric(frequency) && frequency<1) {
		writeEventToScreen('Frequency must be a numeric value and be 1 or above.');
		return false;
	}

	return true;
}

// Functions for building the event string
function getWeeklyRepeatingDays() {
	var days = [];

	var weekdayIds = ['#weekday-sun', '#weekday-mon', '#weekday-tue', '#weekday-wed', '#weekday-thu', '#weekday-fri', 
		'#weekday-sat'];
	var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	for (i = 0; i < weekdayIds.length; i++) {
		if ($(weekdayIds[i]).is(':checked')) {
			days.push(weekdays[i]);
		}
	}

	return days;
}
function getMonthlyRepeatingDays() {
	var days = [];

	var monthdayIds = ['#month-1', '#month-2', '#month-3', '#month-4', '#month-5', '#month-6', '#month-7', '#month-8',
		'#month-9', '#month-10', '#month-11', '#month-12', '#month-13', '#month-14', '#month-15', '#month-16',
		'#month-17', '#month-18', '#month-19', '#month-20', '#month-21', '#month-22', '#month-23', '#month-24',
		'#month-25', '#month-26', '#month-27', '#month-28', '#month-29', '#month-30', '#month-31'];
	for (i = 0; i < monthdayIds.length; i++) {
		if ($(monthdayIds[i]).is(':checked')) {
			days.push(i+1);
		}
	}

	return days;
}
function getYearlyRepeatingMonths() {
	var months = [];

	var monthIds = ['#year-jan', '#year-feb', '#year-mar', '#year-apr', '#year-may', '#year-jun', '#year-jul', 
		'#year-aug', '#year-sept', '#year-oct', '#year-nov', '#year-dec'];
	var monthsNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	for (i = 0; i < monthIds.length; i++) {
		if ($(monthIds[i]).is(':checked')) {
			months.push(monthsNames[i]);
		}
	}

	return months;
}

function getWeeklyRepeatingString(arr) {
	var eventString = 'on every ';
	for (i = 0; i < arr.length-1; i++) {
		eventString += arr[i] + ', ';
	}
	if (arr.length > 1) {
		eventString += 'and ';
	}
	eventString += arr[arr.length-1] + ' of the week ';
	return eventString;
}
function getMonthlyRepeatingString(arr) {
	var eventString = 'on the ';
	for (i = 0; i < arr.length-1; i++) {
		eventString += arr[i] + ', ';
	}
	if (arr.length > 1) {
		eventString += 'and ';
	}
	eventString += arr[arr.length-1] + ' of the month ';
	return eventString;
}
function getYearlyRepeatingString(arr) {
	var eventString = 'in ';
	for (i = 0; i < arr.length-1; i++) {
		eventString += arr[i] + ', ';
	}
	if (arr.length > 1) {
		eventString += 'and ';
	}
	eventString += arr[arr.length-1] + ' on the corresponding day of the month(s) ';
	return eventString;
}



function getEventText() {
	var eventName = $('#event-name').val();
	var eventLocation = $('#event-location').val();

	var eventString = 'Event created: ' + eventName + ' at ' + eventLocation + ', ';

	var allDayEvent = $('#all-day-event-checkbox').is(':checked');

    var date = new Date();
    var curr_day = date.getDate();
    var curr_month = date.getMonth() + 1; //Months are zero based
    var curr_year = date.getFullYear();
    var curr_time_hours = date.getHours();
    var curr_time_mins = date.getMinutes();
	var ustoday = curr_year + "/" + "0" + curr_month + "/" + curr_day + " " + curr_time_hours + ":" + curr_time_mins;

	console.log(ustoday);
	console.log($('#event-start-date').val());
	
	if (allDayEvent) {
		// if($('#all-day-event-date').val() == ustoday ){
		// 	var date = new Date();
		// 	var eventDate = date;
		// 	eventString += 'an all day event on ' + eventDate;
		// }
		// else{
		// 	var eventDate = $('#all-day-event-date').datetimepicker('getValue');
		// 	eventString += 'an all day event on ' + eventDate;
		// }
		var eventDate = $('#all-day-event-date').val();
		eventString += 'an all day event on ' + eventDate;
	} 
	
	else {
		// $('#event-start-date').val() == test
		// if($('#event-start-date').val() == ustoday){
		// 	var date = new Date();
		// 	var startTime = date;
		// }
		// else{
		// 	var startTime = $('#event-start-date').datetimepicker('getValue');
		// }
		var startTime = $('#event-start-date').val();
		var endTime = $('#event-end-date').datetimepicker('getValue');
		eventString += 'starting at ' + startTime + ' and ending at ' + endTime;

	}

	var repeatOption = $('#recurrent-event-type-selector').val();
	if (repeatOption == 'none') {
		eventString += '.';
		return eventString;
	} else if (repeatOption == 'day') {
		eventString += ', repeating every day ';
	} else if (repeatOption == 'week') {
		eventString += ', repeating every week ';
	} else if (repeatOption == 'month') {
		eventString += ', repeating every month ';
	} else if (repeatOption == 'year') {
		eventString += ', repeating every year ';
	} else { // custom
		var frequencyOption = $('#recurrent-event-time-selector').val();
		var frequency = 1;
		var repeatingUnits = [];
		if (frequencyOption == 'daily') {
			frequency = $('#daily-recurrent-freq').val();
			eventString += ', ' + 'repeating every ' + frequency + ' day(s) ';
		} else if (frequencyOption == 'weekly') {
			frequency = $('#weekly-recurrent-freq').val();
			repeatingUnits = getWeeklyRepeatingDays();
			eventString += ', ' + 'repeating every ' + frequency + ' week(s) ' + getWeeklyRepeatingString(repeatingUnits);
		} else if (frequencyOption == 'monthly') {
			frequency = $('#monthly-recurrent-freq').val();
			repeatingUnits = getMonthlyRepeatingDays();
			eventString += ', ' + 'repeating every ' + frequency + ' month(s) ' + getMonthlyRepeatingString(repeatingUnits);
		} else { // yearly
			frequency = $('#yearly-recurrent-freq').val();
			repeatingUnits = getYearlyRepeatingMonths();
			eventString += ', ' + 'repeating every ' + frequency + ' year(s) ' + getYearlyRepeatingString(repeatingUnits);
		}
	}

	var endDate = $('#recurrent-event-end-date').datetimepicker('getValue');
	eventString += 'until ' + endDate + '.';
	return eventString;
}

function writeEventToScreen(eventString) {
	$('#new-event-text').text(eventString);
}
