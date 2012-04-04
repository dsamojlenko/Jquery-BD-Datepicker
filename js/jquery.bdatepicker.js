/*!
 *
 * jQuery Business Days Datepicker
 * jQuery UI Datepicker wrapper that can disable and account for holidays and weekends.
 * Requires: jQuery, jQuery UI
 *
 */

(function ($) {
	$.fn.BDatePicker = function (params) {

		params = $.extend({ daysToAdd: null, noWeekends: false, holidayList: [] }, params);

		var noWeekends = params.noWeekends;
		var daysToAdd = params.daysToAdd;
		var holidaysToAdd = 0;
		var holidayList = params.holidayList;
		var holidayArray = new Array();
		var startdate = new Date();

		// get holidays into an array for use later
		var count = 0;
		$.each(holidayList, function (key, item) {
			if (item.date != null) {
				holidayArray[count] = item.date;
				count++;
			}
		});
		
		if (daysToAdd != null) {
			var newdate = new Date();
			
			// account for weekends
			if (noWeekends) {
				var day = startdate.getDay();
				newdate.setDate(
					startdate.getDate() + daysToAdd +
					(day === 6 ? 2 : +!day) +
					(Math.floor((daysToAdd - 1 + (day % 6 || 1)) / 5) * 2));
			} else {
				// weekends allowed
				newdate.setDate(startdate.getDate() + daysToAdd);
			}
			
		}

		// account for holidays
		if (holidayArray.length > 0) {

			// check for holidays in our date range so far
			$.each(holidayArray, function (index, value) {
				var holidayDate = new Date(value);

				if (holidayDate > startdate && holidayDate < newdate) {
					holidaysToAdd++;
				}				
			});

			if (daysToAdd != null) {
				if (holidaysToAdd > 0) {
					newdate.setDate(newdate.getDate() + holidaysToAdd);
				}
			}

		}
		
		return this.datepicker({
			minDate: newdate,
			beforeShowDay: function (date) {

				// if date is in our holidays array, disable it
				var sdate = $.datepicker.formatDate('mm-dd-yy', date);
				if ($.inArray(sdate, holidayArray) > -1) return [false];

				// disable weekends?
				if (noWeekends) {
					return $.datepicker.noWeekends(date);
				}
				// not sure which way is better
				// if (date.getDay() == 0 || date.getDay() == 6) return [!noWeekends];
				
				return [true];
			}
		});

	}
})(jQuery);