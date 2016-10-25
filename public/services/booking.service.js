angular.module('airlineReservationApp')
	.factory('bookingService', function($http, $filter, RESTAPI_URL) {
		var dateFilter = $filter("date");

		var getDepartureAirports = function() {
			return $http({
				method: 'GET',
				url: RESTAPI_URL + '/departure-airports'
			});
		};

		var getArrivalAirports = function(departureAirport) {
			return $http({
				method: 'GET',
				url: RESTAPI_URL + '/arrival-airports',
				params: {
					'departure-airport': departureAirport
				}
			});
		};

		var searchFlight = function(flightSCO) {
			var departDate = dateFilter(flightSCO.departDate, "yyyy-MM-dd");

			return $http({
				method: 'GET',
				url: RESTAPI_URL + '/flights',
				params: {
					'departure-airport': flightSCO.departureAirport.code,
					'arrival-airport': flightSCO.arrivalAirport.code,
					'depart-day': departDate,
					'num-passenger': flightSCO.numOfPassengers
				}
			});
		};

		var createBooking = function(booking) {
			return $http({
				method: 'POST',
				url: RESTAPI_URL + '/bookings',
				data: booking
			});
		};

		var addPassengers = function(bookingId, passengers) {
			return $http({
				method: 'PUT',
				url: RESTAPI_URL + '/bookings/' + bookingId + '/passengers',
				data: passengers
			});
		};

		var verifyBooking = function(bookingId) {
			return $http({
				method: 'PUT',
				url: RESTAPI_URL + '/bookings',
				data: {
					id: bookingId,
					status: 1
				}
			});
		};

		return {
			getDepartureAirports: getDepartureAirports,
			getArrivalAirports: getArrivalAirports,
			searchFlight: searchFlight,
			createBooking: createBooking,
			addPassengers: addPassengers,
			verifyBooking: verifyBooking
		};
	});