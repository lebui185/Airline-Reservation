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
                orderAttr: 'time',
                orderReverse: false
            },
            returnFlightTable: {
                orderAttr: 'time',
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

        vm.flightType = 'ROUND_TRIP';

        vm.flightSCO = {
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

        vm.validateTravelDate = function() {
            if (vm.flightType === 'ROUND_TRIP') {
                if (vm.flightSCO.returnDate === undefined ||
                    vm.flightSCO.departDate > vm.flightSCO.returnDate) {
                    vm.flightSearchForm.departDatePicker.$setValidity('', false);
                    if (vm.flightSearchForm.returnDatePicker !== undefined) {
                        vm.flightSearchForm.returnDatePicker.$setValidity('', false);
                    }
                } else {
                    if (vm.flightSCO.departDate !== undefined) {
                        vm.flightSearchForm.departDatePicker.$setValidity('', true);
                    }
                    if (vm.flightSCO.returnDate !== undefined) {
                        vm.flightSearchForm.returnDatePicker.$setValidity('', true);
                    }
                }
            } else {
                if (vm.flightSCO.departDate !== undefined) {
                    vm.flightSearchForm.departDatePicker.$setValidity('', true);
                }
            }
        };

        vm.changeFlightType = function(type) {
            vm.flightType = type;
            vm.validateTravelDate();
        };

        vm.isValidFlightSCO = function(flightSCO) {
            if (flightSCO.departureAirport === undefined) {
                return false;
            }

            if (flightSCO.arrivalAirport === undefined) {
                return false;
            }

            if (flightSCO.departDate === undefined) {
                return false;
            }

            if (vm.flighType === 'ROUND_TRIP') {
                if (flightSCO.returnDate === undefined) {
                    return false;
                }
                if (flightSCO.departDate > flightSCO.returnDate) {
                    return false;
                }
                return true;
            }
            return true;
        };

        vm.onFlightSearchFormSubmit = function() {
            if (vm.isValidFlightSCO(vm.flightSCO)) {
                vm.widget.flightSearchForm.isComplete = true;
                vm.widget.currentForm = 'flightSelectForm';
            } else {

            }
        };

        vm.onDepartFlightSelectChange = function(flight) {
            vm.selectedDepartFlight = flight;
        };

        // flightSelectForm

        function decodeDepartFlight(hash) {
            var departFlight = {};
            var tokens = hash.split(',');

            departFlight.code = tokens[0];
            departFlight.date = tokens[1];
            departFlight.class = tokens[2];
            departFlight.fareType = tokens[3];

            return departFlight;
        }

        function decodeReturnFlight(hash) {
            var returnFlight = {};
            var tokens = hash.split(',');

            returnFlight.code = tokens[0];
            returnFlight.date = tokens[1];
            returnFlight.class = tokens[2];
            returnFlight.fareType = tokens[3];

            return returnFlight;
        }

        vm.onFlightSelectFormSubmit = function() {
            var departFlight = decodeDepartFlight(vm.departFlightHash);
            var returnFlight = decodeDepartFlight(vm.returnFlightHash);
            console.log(departFlight);
            console.log(returnFlight);
            vm.widget.flightSelectForm.isComplete = true;
            vm.widget.currentForm = 'passengerForm';
        };

        vm.onFlightSelectFormBack = function() {
            vm.widget.currentForm = 'flightSearchForm';
        };

        vm.departFlights = [{
            code: "BL326",
            departureAirport: "SGN",
            arrivalAirport: "TBB",
            date: "2016-10-05",
            time: "08:45:00",
            class: "Y",
            fareType: "F",
            numberOfSeats: 15,
            fare: 10000
        }, {
            code: "BL326",
            departureAirport: "SGN",
            arrivalAirport: "TBB",
            date: "2016-10-05",
            time: "08:45:00",
            class: "Y",
            fareType: "E",
            numberOfSeats: 15,
            fare: 20000
        }, {
            code: "BL327",
            departureAirport: "SGN",
            arrivalAirport: "TBB",
            date: "2016-10-05",
            time: "08:45:00",
            class: "Y",
            fareType: "G",
            numberOfSeats: 15,
            fare: 300000
        }, {
            code: "BL326",
            departureAirport: "SGN",
            arrivalAirport: "TBB",
            date: "2016-10-05",
            time: "08:45:00",
            class: "C",
            fareType: "F",
            numberOfSeats: 15,
            fare: 40000
        }, {
            code: "BL327",
            departureAirport: "SGN",
            arrivalAirport: "TBB",
            date: "2016-10-05",
            time: "08:45:00",
            class: "C",
            fareType: "G",
            numberOfSeats: 15,
            fare: 600000
        }];

        vm.returnFlights = [{
            code: "BL326",
            departureAirport: "SGN",
            arrivalAirport: "TBB",
            date: "2016-10-05",
            time: "08:45:00",
            class: "Y",
            fareType: "F",
            numberOfSeats: 15,
            fare: 10000
        }, {
            code: "BL326",
            departureAirport: "SGN",
            arrivalAirport: "TBB",
            date: "2016-10-05",
            time: "08:45:00",
            class: "Y",
            fareType: "E",
            numberOfSeats: 15,
            fare: 20000
        }, {
            code: "BL327",
            departureAirport: "SGN",
            arrivalAirport: "TBB",
            date: "2016-10-05",
            time: "08:45:00",
            class: "Y",
            fareType: "G",
            numberOfSeats: 15,
            fare: 300000
        }, {
            code: "BL326",
            departureAirport: "SGN",
            arrivalAirport: "TBB",
            date: "2016-10-05",
            time: "08:45:00",
            class: "C",
            fareType: "F",
            numberOfSeats: 15,
            fare: 40000
        }, {
            code: "BL327",
            departureAirport: "SGN",
            arrivalAirport: "TBB",
            date: "2016-10-05",
            time: "08:45:00",
            class: "C",
            fareType: "G",
            numberOfSeats: 15,
            fare: 600000
        }];

        function convertFlightToTableFormat(remoteFlights) {
            var localFlights = [];
            var i;
            var j;
            var isNewFlight = true;
            var fareAttr;
            var newFlight;

            for (i = 0; i < remoteFlights.length; i++) {
                for (j = 0; j < localFlights.length; j++) {
                    if (remoteFlights[i].code === localFlights[j].code &&
                        remoteFlights[i].date === localFlights[j].date) {
                        isNewFlight = false;
                        break;
                    }
                }

                if (isNewFlight) {
                    fareAttr = remoteFlights[i].class + remoteFlights[i].fareType;
                    newFlight = {
                        code: remoteFlights[i].code,
                        date: remoteFlights[i].date,
                        time: remoteFlights[i].time,
                        fare: {}
                    };
                    newFlight.fare[fareAttr] = remoteFlights[i].fare;
                    localFlights.push(newFlight);
                } else {
                    fareAttr = remoteFlights[i].class + remoteFlights[i].fareType;
                    localFlights[j].fare[fareAttr] = remoteFlights[i].fare;
                    isNewFlight = true;
                }
            }

            return localFlights;
        }

        vm.departFlights = convertFlightToTableFormat(vm.departFlights);
        vm.returnFlights = convertFlightToTableFormat(vm.returnFlights);

        vm.changeDepartFlightTableSort = function(attr) {
            if (attr === vm.widget.departFlightTable.orderAttr) {
                vm.widget.departFlightTable.orderReverse = !(vm.widget.departFlightTable.orderReverse);
            } else {
                vm.widget.departFlightTable.orderAttr = attr;
                vm.widget.departFlightTable.orderReverse = false;
            }
        };

        vm.isDepartTableSortAscending = function(attr) {
            return vm.widget.departFlightTable.orderAttr === attr &&
                vm.widget.departFlightTable.orderReverse === false;
        };

        vm.isDepartTableSortDescending = function(attr) {
            return vm.widget.departFlightTable.orderAttr === attr &&
                vm.widget.departFlightTable.orderReverse === true;
        };

        vm.changeReturnFlightTableSort = function(attr) {
            if (attr === vm.widget.returnFlightTable.orderAttr) {
                vm.widget.returnFlightTable.orderReverse = !(vm.widget.returnFlightTable.orderReverse);
            } else {
                vm.widget.returnFlightTable.orderAttr = attr;
                vm.widget.returnFlightTable.orderReverse = false;
            }
        }

        vm.isReturnTableSortAscending = function(attr) {
            return vm.widget.returnFlightTable.orderAttr === attr &&
                vm.widget.returnFlightTable.orderReverse === false;
        };

        vm.isReturnTableSortDescending = function(attr) {
            return vm.widget.returnFlightTable.orderAttr === attr &&
                vm.widget.returnFlightTable.orderReverse === true;
        };

        vm.isValidFlightSelectForm = function() {
            if (vm.departFlightHash !== undefined) {
                if (vm.flightType === 'ROUND_TRIP' && vm.returnFlightHash !== undefined) {
                    return true;
                }
                return false;
            }
            return false;
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
