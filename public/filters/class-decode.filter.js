angular.module('airlineReservationApp')
	.filter('classDecodeFilter', function() {
		var data = {
			vn: {
				Y: 'Thương gia',
				C: 'Phổ thông'
			},
			en: {
				Y: 'Business',
				C: 'Economy'
			}
		};

		return function(classCode, language) {
			return data[language][classCode];
		};
	});