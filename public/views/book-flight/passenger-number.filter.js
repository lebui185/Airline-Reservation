angular.module('airlineReservationApp')
	.filter('passengerNumber', function() {
		return function(data, numOfAdult, passengerType) {
			if (passengerType === 'child') {
				return [1, 3, 5];
			} else if (passengerType === 'infant') {
				return [2, 4, 6];
			}

			return null;
		};
	});