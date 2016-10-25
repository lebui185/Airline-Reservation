angular.module('airlineReservationApp')
	.config(function($stateProvider) {
		$stateProvider.state({
            name: 'home',
            url: '/home',
            templateUrl: 'views/home/home.html',
            controller: 'HomeCtrl',
            controllerAs: 'homeVm',
        });

		$stateProvider.state({
            name: 'book-flight',
            url: '/book-flight',
            templateUrl: 'views/book-flight/book-flight.html',
            controller: 'BookFlightCtrl',
            controllerAs: 'bookFlightVm',
        });
	});