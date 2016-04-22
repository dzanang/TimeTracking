﻿(function () {
    var app = angular.module("school");
    app.controller("Calendar2Controller", function ($scope, $rootScope, DataService) {

        var dataSet = "details";
        $scope.selDetail = "";
        $scope.sortOrder = '-date';

        $scope.startDate = new Date("2016/04/22");
        $scope.endDate = new Date("2016/04/23");

        getTeams();
        fetchData();
        getPeople();
        getDays();
        //$scope.modalShow = false;
        //$scope.toggleModal = function () {
        //    $scope.modalShow = !$scope.modalShow;
        //};
        //app.directive('modalDialog', function () {
        //    return {
        //        restrict: 'E',
        //        scope: { show: '=' },
        //        replace: true,
        //        transclude: true,
        //        link: function (scope, element, attrs) {
        //            scope.dialogStyle = {};
        //            if (attrs.width) scope.dialogStyle.width = attrs.width;
        //            if (attrs.height) scope.dialogStyle.height = attrs.height;
        //            scope.hideModal = function () {
        //                scope.show = false;
        //            };
        //        },
        //        template: "<div class='modal' ng-show='show'><div class='modal-overlay' ng-click='hideModal()'></div><div class='modal-dialog' ng-style='dialogStyle'><div class='modal-close' ng-click='hideModal()'>X</div><div class='modal-dialog-content' ng-transclude></div></div></div>"
        //    };
        //});


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
                date: $scope.dt,
                person: currentUser.id,
                personName: currentUser.personName,
                workTime: "",
                description: "",
                team: 0,
                teamName: ""
            }
        };
        $scope.deleteData = function () {
            DataService.delete(dataSet, $scope.detail.id, function (data) { fetchData() });
            // fetchData();
        }

        $scope.saveData = function (selectedDate) {
            $scope.detail.date = new Date(selectedDate).toISOString();
            var promise;
            if ($scope.detail.id == 0) {
                DataService.create(dataSet, $scope.detail, function (data) { fetchData() });
            }
            else {
                DataService.update(dataSet, $scope.detail.id, $scope.detail, function (data) { fetchData() });
            }

            //fetchData();
        }


        $scope.today = function () {
            $scope.dt = new Date();
            //console.log($scope.dt);
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        $scope.options = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        $scope.toggleMin = function () {
            $scope.options.minDate = $scope.options.minDate ? null : new Date();
        };

        $scope.toggleMin();

        $scope.setDate = function (year, month, day) {
            $scope.dt = new Date(year, month, day);
            $scope.dt.setHours(2, 0, 0);
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date(tomorrow);
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
        };

        $scope.test = function () {
            console.log('calendar clicked');
        }


        //$scope.openModal = function (selectedDay) {
        //    var modalInstance = $modal.open({
        //        templateUrl: 'views/daymodal.html',
        //        controller: 'DayModalController',
        //        resolve: {
        //            day: function () {
        //                return selectedDay;
        //            }
        //        }
        //    });
        //}
    });
    app.filter('dateRange', function () {
        return function (input, startDate, endDate) {

            var retArray = [];

            angular.forEach(input, function (obj) {
                var receivedDate = new Date (obj.date);
                console.log(receivedDate);

                if (receivedDate >= startDate && receivedDate < endDate) {
                    console.log("poredjenje");
                    retArray.push(obj);
                }
            });

            return retArray;
        };
    });
}());