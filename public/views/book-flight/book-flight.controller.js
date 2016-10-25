angular.module('airlineReservationApp')
    .controller('BookFlightCtrl', function($scope, MAX_PASSENGER, bookingService) {
        var vm = this;

        vm.widget = {
            departDatePicker: {
                isOpened: false
            },
            returnDatePicker: {
                isOpened: false
            },
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
            },
        };

        function calculateNumOfPassengers() {
            return vm.flightSCO.numOfAdults + vm.flightSCO.numOfChildren + vm.flightSCO.numOfInfants;
        }

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
                    if (vm.flightSearchForm.departDatePicker !== undefined) {
                        vm.flightSearchForm.departDatePicker.$setValidity('', true);
                    }
                    if (vm.flightSearchForm.returnDatePicker !== undefined) {
                        vm.flightSearchForm.returnDatePicker.$setValidity('', true);
                    }
                }
            } else {
                if (vm.flightSearchForm.departDatePicker !== undefined) {
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

                vm.flightSCO.numOfPassengers = calculateNumOfPassengers();

                console.log(vm.flightSCO);

                vm.departFlights = null;
                vm.returnFlights = null;

                bookingService.searchFlight(vm.flightSCO)
                    .then(function(res) {
                        console.log(res.data);
                        vm.departFlights = convertFlightToTableFormat(res.data);
                        console.log(vm.departFlights);
                    }, function(res) {
                        console.log(res);
                    });
                if (vm.flightType === 'ROUND_TRIP') {
                    var returnFlightSCO = {
                        departureAirport: vm.flightSCO.arrivalAirport,
                        arrivalAirport: vm.flightSCO.departureAirport,
                        departDate: vm.flightSCO.returnDate,
                        numOfPassengers: vm.flightSCO.numOfPassengers
                    };

                    bookingService.searchFlight(returnFlightSCO)
                        .then(function(res) {
                            console.log(res.data);
                            vm.returnFlights = convertFlightToTableFormat(res.data);
                            console.log(vm.returnFlights);
                        }, function(res) {
                            console.log(res);
                        });
                }

            } else {

            }
        };

        vm.onDepartFlightSelectChange = function(flight) {
            vm.selectedDepartFlight = flight;
        };

        //ajax init call

        $scope.$watch(function() {
            return vm.flightSCO.departureAirport;
        }, function(departureAirport) {
            vm.widget.arrivalAirportSelectOptions = null;

            if (departureAirport !== undefined && departureAirport !== '') {
                bookingService.getArrivalAirports(departureAirport.code)
                    .then(function(res) {
                        console.log(res.data);
                        vm.widget.arrivalAirportSelectOptions = res.data;
                        // $scope.$apply(function() {
                        //    vm.widget.arrivalAirportSelectOptions = res.data; 
                        // });
                    }, function(res) {
                        console.log(res);
                    });
            }
        });

        bookingService.getDepartureAirports()
            .then(function(res) {
                console.log(res.data);
                vm.widget.departureAirportSelectOptions = res.data;
            }, function(res) {
                console.log(res);
            });

        // flightSelectForm

        function decodeFlightHash(hash) {
            var flight = {};
            var tokens = hash.split(',');

            flight.code = tokens[0];
            flight.date = tokens[1];
            flight.class = tokens[2];
            flight.fareType = tokens[3];

            return flight;
        }

        vm.onFlightSelectFormSubmit = function() {
            var departFlight = decodeFlightHash(vm.departFlightHash);
            var booking = {
                numOfPassengers: calculateNumOfPassengers(),
                flightDetails: []
            };

            booking.flightDetails.push({
                code: departFlight.code,
                date: departFlight.date,
                class: departFlight.class,
                fareType: departFlight.fareType
            });

            if (vm.flightType === 'ROUND_TRIP') {
                var returnFlight = decodeFlightHash(vm.returnFlightHash);
                booking.flightDetails.push({
                    code: returnFlight.code,
                    date: returnFlight.date,
                    class: returnFlight.class,
                    fareType: returnFlight.fareType
                });
            }

            console.log(booking);

            bookingService.createBooking(booking)
                .then(function(res) {
                    console.log(res.data);
                    vm.booking = res.data;
                }, function(res) {
                    console.log(res);
                });

            vm.widget.flightSelectForm.isComplete = true;
            vm.widget.currentForm = 'passengerForm';
        };

        vm.onFlightSelectFormBack = function() {
            vm.widget.currentForm = 'flightSearchForm';
        };

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
        };

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

        function calculateBookingTotalFare(flightDetails) {
            var totalFare = 0;

            for (var i = 0; i < flightDetails.length; i++) {
                totalFare += Number(flightDetails[i].fare);
            }

            return totalFare;
        }


        vm.onPassengerFormSubmit = function() {
            console.log(vm.adultPassengers);
            console.log(vm.childPassengers);
            console.log(vm.infantPassengers);

            var passengers;
            passengers = vm.adultPassengers.concat(vm.childPassengers);
            passengers = passengers.concat(vm.infantPassengers);
            console.log(passengers);

            bookingService.addPassengers(vm.booking.id, passengers)
                .then(function(res) {
                    console.log(res.data);
                    vm.booking.totalFare = calculateBookingTotalFare(vm.booking.flightDetails);
                    vm.booking.passengers = passengers;
                    console.log(vm.booking);

                    vm.widget.passengerForm.isComplete = true;
                    vm.widget.currentForm = 'verifyForm';
                }, function(res) {
                    console.log(res);
                });
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
            bookingService.verifyBooking(vm.booking.id)
                .then(function(res) {
                    console.log(res.data);
                    vm.widget.verifyForm.isComplete = true;
                    vm.widget.currentForm = 'finishForm';
                }, function(res) {
                    console.log(res);
                });
        };

        vm.flightSCO.departDate = new Date('2016-10-05');
        vm.flightSCO.returnDate = new Date('2016-10-06');
    });
