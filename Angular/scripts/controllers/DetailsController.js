﻿(function () {
    var app = angular.module("school");
    app.controller("DetailsController", function ($scope, $rootScope, DataService, $http) {

        var dataSet = "details";
        //$scope.selDetail = [];
        $scope.selTeam = "Day Off";
        //$scope.sortOrder = "-date";

        getTeams();
        //fetchData();
        getPeople();
        getDays();        

        $scope.message = "Fetching Details...";
        $scope.pageSizes = [5, 10, 15];
        $scope.pageSize = 10;
        $scope.currentPage = 0;

        $scope.changePage = function (page) {
            $scope.currentPage = page - 1;
            $scope.fetchDetails();
        }

        $scope.setSize = function (pageNo) {
            $scope.pageSize = pageNo;
            $scope.fetchDetails();
        };

        $scope.fetchDetails = function () {
            $scope.pages = [];
            DataService.getDetail(currentUser.id, $scope.currentPage, $scope.pageSize).then(function (response) {
                $scope.details = response.data;
                $scope.pagination = JSON.parse(response.headers("pagination"));               
                for (var i = 1; i <= $scope.pagination.pageCount ; i++) {
                    $scope.pages.push(i);
                }

                if ($scope.currentPage > $scope.pagination.pageCount - 1) {
                    $scope.currentPage = $scope.pagination.pageCount - 1;
                    $scope.fetchDetails();
                }

                $scope.message = "";
            }, function (reason) {
                $scope.message = reason;
            })
        }
        $scope.fetchDetails();

        function getDays() {
            DataService.read("days", currentUser.id, function (data) {
                $scope.days = data;
            });
        };

        function getTeams() {
            DataService.list("teams", function (data) {
                $scope.teams = data;
            });
        };
        function getPeople() {
            DataService.read("people", currentUser.id, function (data) {
                $scope.people = data;
            });
        };
        function fetchData() {
            DataService.read(dataSet, currentUser.id, function (data) {
                $scope.details = data;
                console.log($scope.details);
            });
        }

        $scope.transfer = function (item) {
            $scope.detail = item;
        };
        $scope.reloadRoute = function () {
            $window.location.reload();
        }

        $scope.newDetail = function () {
            $scope.detail = {
                id: 0,
                day: 0,
                date: dt,
                person: currentUser.id,
                personName: currentUser.personName,
                workTime: "",
                description: "",
                team: 0,
                teamName: ""
            }
        };
        $scope.deleteData = function () {
            DataService.delete(dataSet, $scope.detail.id, function (data) { $scope.fetchDetails() });
        }

        $scope.saveData = function () {
            console.log($scope.detail);
            var promise;
            if ($scope.detail.id == 0) {
                DataService.create(dataSet, $scope.detail, function (data) { fetchData() });
            }
            else {
                DataService.update(dataSet, $scope.detail.id, $scope.detail, function (data) { fetchDetails() });
            }
        }

        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(2011, 5, 22),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        $scope.toggleMin = function () {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();


        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function (year, month, day) {
            $scope.dt = new Date(year, month, day);
            $scope.dt.setHours(2, 0, 0);
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [
          {
              date: tomorrow,
              status: 'full'
          },
          {
              date: afterTomorrow,
              status: 'partially'
          }
        ];

        function getDayClass(data) {
            var date = data.date,
              mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }
            return '';
        }

        app.filter('monthName', [function () {
            return function (monthNumber) { //1 = January
                var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
                return monthNames[monthNumber - 1];
            }
        }]);
    });
}());

