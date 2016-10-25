angular.module('airlineReservationApp')
    .controller('BookFlightCtrl', function($scope, MAX_PASSENGER) {
        var vm = this;

        vm.widget = {
            departDatePicker: {
                isOpened: false
            },
            returnDatePicker: {
                isOpened: false
            },
            departureAirportSelectOptions: [{
                code: 'HAN',
                name: 'Ha Noi',
            }, {
                code: 'SGN',
                name: 'Ho Chi Minh',
            }],
            arrivalAirportSelectOptions: [{
                code: 'HAN',
                name: 'Ha Noi',
            }, {
                code: 'SGN',
                name: 'Ho Chi Minh',
            }],
            numOfAdultsSelectOptions: [1, 2, 3, 4, 5, 6],
            numOfChildrenSelectOptions: [],
            numOfInfantsSelectOptions: [],
            flightSearchForm: {
                isComplete: false
            },
            flightSelectForm: {
                isComplete: false
            },
            passengerForm: {
                isComplete: false
            },
            verifyForm: {
                isComplete: false
            },
            currentForm: 'flightSearchForm',
            departFlightTable: {
                orderAttr: 'departTime',
                orderReverse: false
            }
        };

        // flightSearchForm

        function getNumberOptionsFromZero(max) {
            var arr;

            if (max === 0) {
                arr = [0];
            } else {
                arr = new Array(max + 1);
                for (var i = 0; i < arr.length; i++) {
                    arr[i] = i;
                }
            }

            return arr;
        }


        $scope.$watch(function() {
            return vm.flightSCO.numOfChildren;
        }, function(numOfChildren) {
            var numOfInfants;

            // modify max number of infants
            if (vm.flightSCO.numOfAdults === 1 && numOfChildren === 2) {
                vm.widget.numOfInfantsSelectOptions = getNumberOptionsFromZero(0);
            } else if (numOfChildren > vm.flightSCO.numOfAdults) {
                numOfInfants = vm.flightSCO.numOfAdults * 2 - numOfChildren;
            } else {
                numOfInfants = vm.flightSCO.numOfAdults;
            }

            vm.widget.numOfInfantsSelectOptions = getNumberOptionsFromZero(numOfInfants);
            vm.flightSCO.numOfInfants = 0;
        });

        $scope.$watch(function() {
            return vm.flightSCO.numOfAdults;
        }, function(numOfAdults) {
            var numOfChildren;
            var numOfInfants = numOfAdults;

            // modify max number of children
            if (numOfAdults === 1) {
                vm.widget.numOfChildrenSelectOptions = getNumberOptionsFromZero(2);
            } else {
                numOfChildren = MAX_PASSENGER - numOfAdults;
                vm.widget.numOfChildrenSelectOptions = getNumberOptionsFromZero(numOfChildren);
            }
            vm.flightSCO.numOfChildren = 0;

            // modify max number of infants
            vm.widget.numOfInfantsSelectOptions = getNumberOptionsFromZero(numOfInfants);
            vm.flightSCO.numOfInfants = 0;
        });


        vm.flightSCO = {
            type: 'ONE_WAY',
            departDate: new Date(),
            numOfAdults: 1
        };

        vm.openDepartDatePicker = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.widget.departDatePicker.isOpened = true;
        };

        vm.openReturnDatePicker = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.widget.returnDatePicker.isOpened = true;
        };

        vm.onFlightSearchFormSubmit = function() {
            console.log(vm.flightSCO);
            vm.widget.flightSearchForm.isComplete = true;
            vm.widget.currentForm = 'flightSelectForm';
        };



        // flightSelectForm

        vm.onFlightSelectFormSubmit = function() {
            vm.widget.flightSelectForm.isComplete = true;
            vm.widget.currentForm = 'passengerForm';
        };

        vm.onFlightSelectFormBack = function() {
            vm.widget.currentForm = 'flightSearchForm';
        };

        //vm.departFlightsDisplay = [];

        vm.departFlights = [{
            id: 'BL326',
            departTime: new Date('2016-10-20'),
            seat: 200,
            fares: [{
                type: 'Thương gia linh hoạt',
                cost: 10
            }, {
                type: 'Thương gia tiêu chuẩn',
                cost: 20
            }, {
                type: 'Phổ thông linh hoạt',
                cost: 30
            }, {
                type: 'Phổ thông tiêu chuẩn',
                cost: 40
            }]
        }, {
            id: 'BL327',
            departTime: new Date('2016-10-21'),
            seat: 300,
            fares: [{
                type: 'Thương gia linh hoạt',
                cost: 10
            }, {
                type: 'Thương gia tiêu chuẩn',
                cost: 20
            }, {
                type: 'Phổ thông linh hoạt',
                cost: 30
            }, {
                type: 'Phổ thông tiêu chuẩn',
                cost: 40
            }]
        }, {
            id: 'BL328',
            departTime: new Date('2015-11-22'),
            seat: 400,
            fares: [{
                type: 'Thương gia linh hoạt',
                cost: 10
            }, {
                type: 'Thương gia tiêu chuẩn',
                cost: 20
            }, {
                type: 'Phổ thông linh hoạt',
                cost: 30
            }, {
                type: 'Phổ thông tiêu chuẩn',
                cost: 40
            }]
        }, {
            id: 'BL329',
            departTime: new Date('2015-10-24'),
            seat: 500,
            fares: [{
                type: 'Thương gia linh hoạt',
                cost: 10
            }, {
                type: 'Thương gia tiêu chuẩn',
                cost: 20
            }, {
                type: 'Phổ thông linh hoạt',
                cost: 30
            }, {
                type: 'Phổ thông tiêu chuẩn',
                cost: 40
            }]
        }];

        vm.returnFlights = [
            { id: 'BL326', priceClass: 'E', seat: 100, price: 100000 },
            { id: 'BL326', priceClass: 'F', seat: 20, price: 10000 },
            { id: 'BL327', priceClass: 'G', seat: 10, price: 500000 },
            { id: 'BL327', priceClass: 'E', seat: 100, price: 100000 },
        ];

        vm.changeDepartFlightTableSort = function(attr) {
            if (attr === vm.widget.departFlightTable.orderAttr) {
                vm.widget.departFlightTable.orderReverse = !(vm.widget.departFlightTable.orderReverse);
            } else {
                vm.widget.departFlightTable.orderAttr = attr;
                vm.widget.departFlightTable.orderReverse = false;
            }
        };

        vm.isSortAscending = function(attr) {
            return vm.widget.departFlightTable.orderAttr === attr &&
                vm.widget.departFlightTable.orderReverse === false;
        };

        vm.isSortDescending = function(attr) {
            return vm.widget.departFlightTable.orderAttr === attr &&
                vm.widget.departFlightTable.orderReverse === true;
        };

        // passengerForm

        vm.onPassengerFormSubmit = function() {
            console.log(vm.adultPassengers);
            console.log(vm.childPassengers);
            console.log(vm.infantPassengers);
            vm.widget.passengerForm.isComplete = true;
            vm.widget.currentForm = 'verifyForm';
        };

        vm.onPassengerFormBack = function() {
            vm.widget.currentForm = 'flightSelectForm';
        };

        vm.adultPassengers = [];
        vm.childPassengers = [];
        vm.infantPassengers = [];

        $scope.$watch(function() {
            return vm.flightSCO.numOfAdults;
        }, function(newVal) {
            vm.adultPassengers.length = 0;

            for (var i = 0; i < newVal; i++) {
                vm.adultPassengers.push({});
            }
        });

        $scope.$watch(function() {
            return vm.flightSCO.numOfChildren;
        }, function(newVal) {
            vm.childPassengers.length = 0;

            for (var i = 0; i < newVal; i++) {
                vm.childPassengers.push({});
            }
        });

        $scope.$watch(function() {
            return vm.flightSCO.numOfInfants;
        }, function(newVal) {
            vm.infantPassengers.length = 0;

            for (var i = 0; i < newVal; i++) {
                vm.infantPassengers.push({});
            }
        });

        // verifyForm
        vm.onVerifyFormBack = function() {
            vm.widget.currentForm = 'passengerForm';
        };

        vm.onVerifyFormVerifyBooking = function() {
            console.log("verify booking");
            vm.widget.verifyForm.isComplete = true;
            vm.widget.currentForm = 'finishForm';
        };
    });
