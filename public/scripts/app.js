angular.module('airlineReservationApp', ['ui.router', 'ui.bootstrap', 'toastr'])
	.run(function($state) {
		$state.go('book-flight');
	});