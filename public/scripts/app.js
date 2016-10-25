angular.module('airlineReservationApp', ['ui.router', 'ui.bootstrap'])
	.run(function($state) {
		$state.go('book-flight');
	});