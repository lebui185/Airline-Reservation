angular.module('airlineReservationApp')
	.filter('fareTypeDecodeFilter', function() {
		var data = {
			vn: {
				F: 'linh hoạt',
				G: 'tiêu chuẩn',
				E: 'tiết kiệm'
			}
		};

		return function(fareType, language) {
			return data[language][fareType];
		};
	});