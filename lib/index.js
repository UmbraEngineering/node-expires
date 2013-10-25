
exports.after = function(expires) {
	return Date.now() + exports.parse(expires);
};

// ------------------------------------------------------------------
//  Checks if a timestamp is expired

exports.expired = function(timestamp) {
	timestamp = exports.parseTimestamp(timestamp);
	return timestamp < Date.now();
};

// ------------------------------------------------------------------
//  Parses a timestamp

exports.parseTimestamp = function(timestamp) {
	if (typeof timestamp === 'object') {
		if (! (timestamp && timestamp instanceof Date)) {
			throw new TypeError('timestamp must be a Date object, a number, or date string');
		}
	} else {
		timestamp = new Date(timestamp);
	}
	return timestamp.getTime();
};

// ------------------------------------------------------------------
//  Expires parser

exports.parse = function(str, unit) {
	if (typeof str === 'string') {
		str = str.split(' ');
		var value = str[0];
		if (value.indexOf('/') >= 0) {
			value = value.split('/').map(function(str) {
				return Number(str);
			});
			if (value.length !== 2 || isNaN(value[0]) || isNaN(value[1])) {
				throw invalidExpires('value', str[1]);
			}
			value = value[0] / value[1];
		} else {
			value = Number(str[0]);
		}
		if (isNaN(value)) {
			throw invalidExpires('value', str[0]);
		}
		if (! str[1] || ! exports.units.hasOwnProperty(str[1])) {
			throw invalidExpires('unit', str[1]);
		}
		value *= exports.units[str[1]];
	}
	if (unit) {
		if (! exports.units.hasOwnProperty(unit)) {
			throw invalidExpires('unit', unit);
		}
		value /= exports.units[unit];
	}
	return value;
};

function invalidExpires(unitOrValue, value) {
	return new Error('"' + value + '" is not a valid expires ' + unitOrValue);
}

// ------------------------------------------------------------------
//  Define units

exports.units = { };
[
	['ms', 'millisecond', 'milliseconds',    1],
	['sec', 'secs', 'second', 'seconds',     1000],
	['min', 'mins', 'minute', 'minutes',     1000 * 60],
	['hr', 'hrs', 'hour', 'hours',           1000 * 60 * 60],
	['day', 'days',                          1000 * 60 * 60 * 24],
	['wk', 'wks', 'week', 'weeks',           1000 * 60 * 60 * 24 * 7],
	['yr', 'yrs', 'year', 'years',           1000 * 60 * 60 * 24 * 365]
].forEach(
	function(unit) {
		var value = unit.pop();
		unit.forEach(function(name) {
			exports.units[name] = value;
		});
	}
);

