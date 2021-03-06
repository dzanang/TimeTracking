(function () {

    var app = angular.module("school");

    app.controller("LoginController", function ($scope, $rootScope, $location, LoginService) {

        $scope.wait = true;
        promise = LoginService.getCredentials();
        if (promise) {
            promise.then(
                function (response) {
                    authenticated = true;
                    currentUser = response.data;
                    $rootScope.role = currentUser.roles.toString();
                    $rootScope.userName = currentUser.name;
                    if(currentUser.roles == "admin"){
                        $location.path("/months");
                    }
                    else {
                        $location.path("/calendar")
                    }
                    $scope.wait = false;
                    $rootScope.$broadcast('userLoggedIn');
                },
                function (reason) {
                    $rootScope.message = reason.status;
                    $location.path("/login");
                })
        };
        $scope.wait = false;
        $scope.user = { name: "", pass: "", remember: false };
        startApp("googleBtn");

        $scope.login = function () {

            $scope.wait = true;
            promise = LoginService.login($scope.user);
            promise.then(
                function (response) {
                    authenticated = true;
                    currentUser = response.data;
                    $rootScope.role = currentUser.roles.toString();
                    $rootScope.userName = currentUser.name;
                    console.log($scope.userName);
                    if ($scope.user.remember) LoginService.setCredentials("local", $scope.user.name + ":" + $scope.user.pass);
                    if (currentUser.roles == "admin") {
                        console.log(currentUser.roles);
                        $location.path("/months");
                    }
                    else {
                        $location.path("/calendar")
                    }
                    $scope.wait = false;
                    $rootScope.$broadcast('userLoggedIn');
                    
                },
                function (reason) {
                    console.log(reason);
                    $rootScope.message = reason.status;
                    $scope.wait = false;
                }
            )
        };

        function startApp(actionButton) {
            gapi.load("auth2", function () {
                auth2 = gapi.auth2.init({
                    client_id: "990732731863-in59ar3adprbnpuhmgagtsfdmvcfv9q4.apps.googleusercontent.com",
                    cookiepolicy: "single_host_origin"
                });
                attachSignin(document.getElementById(actionButton));
            });
        };

        function attachSignin(element) {
            auth2.attachClickHandler(element, {},
                function (googleUser) {
                    $scope.wait = true;
                    var userEmail = googleUser.getBasicProfile().getEmail();
                    $rootScope.userName = googleUser.getBasicProfile().getName();
                    $rootScope.userImage = googleUser.getBasicProfile().getImageUrl();

                    LoginService.google(userEmail).then(
                        function (response) {
                            currentUser = response.data;
                            authenticated = true;
                            $rootScope.role = currentUser.roles.toString();
                            $rootScope.userName = currentUser.name;
                            $rootScope.message = "";
                            if ($scope.user.remember) LoginService.setCredentials("google", userEmail);
                            if (currentUser.roles == "admin") {
                                $location.path("/months");
                            }
                            else {
                                $location.path("/calendar")
                            }
                            $scope.wait = false;
                            $rootScope.$broadcast('userLoggedIn');
                        },
                        function (reason) {
                            currentUser = undefined;
                            authenticated = false;
                            $rootScope.message = "Invalid login, try again!";
                            $scope.wait = false;
                        }
                    );
                },
                function (error) {
                    console.log(error);
                });
        };
    });

    app.controller("LogoutController", function ($cookies, $location, $rootScope) {
        authenticated = false;
        $cookies.remove("gigiSchool");

        window.location.reload();
    });

}());