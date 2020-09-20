
var myApp = angular.module("myApp",["ngRoute"]);

myApp.directive("mapCanvas", function() {
    return {
        restrict: "E",
        link: function(scope, element) {
            var lat_lng_text = JSON.parse(element[0].innerText);
            var myLatLng = { lat: lat_lng_text[0], lng: lat_lng_text[1] };
            var mapOptions = {
                center: myLatLng,
                zoom: 15,
            };
            var map = new google.maps.Map(element[0], mapOptions);
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: lat_lng_text[2],
            });
        },
    };
});

myApp.directive("youtubeEmbed", function($compile) {
    return {
        replace: true,
        scope: false,
        restrict: "E",
        link: function($scope, $element) {
            var video = $element.attr("video");
            var text = $element.text();
            var idx = video.indexOf("?v=");
            if (idx != -1) {
                var vid = video.substring(idx) + 3;
                video = "https://youtube.com/embed/" + vid;
            }
            var wrapped = angular.element("<div class='col-md-4'><div class='well' style='padding: 8px'><div class='videoWrapper'><iframe width='100%' src='"+video+"?rel=0&showinfo=0' frameborder='0' allowfullscreen></iframe></div><div class='text-center'>"+text+"</div></div></div>");
            var e = $compile(wrapped)($scope);
            $element.replaceWith(e);
        },
    };
})

myApp.factory("galleryService", function($q, $http) {
    var service = {};

    service.albums = function() {
        var deferred = $q.defer();
        deferred.resolve([
            {name: "Fellowship",
             images: [["1.Pastor.jpg", "Pastor"], ["Pastors.jpg", "Pastors"], ["Zac_Poonen.jpg", "Zac Poonen"], ["brother.jpg", "Brother"]]}
        ]);
        return deferred.promise;
    };

    return service;
});

myApp.config(["$routeProvider", function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "home.html",
            controller: "HomeController",
        })
        .when("/about-us", {
            templateUrl: "about-us.html",
            controller: "AboutUsController",
        })
        .when("/ministries", {
            templateUrl: "ministries.html",
            controller: "MinistriesController",
        })
        .when("/gallery/:album/:image", {
            templateUrl: "album-image.html",
            controller: "ImageController",
        })
        .when("/gallery/:album", {
            templateUrl: "gallery-album.html",
            controller: "AlbumController",
        })
        .when("/gallery", {
            templateUrl: "gallery.html",
            controller: "GalleryController",
        })
        .when("/contact", {
            templateUrl: "contact.html",
            controller: "ContactController",
        })
        .when("/request-prayer", {
            templateUrl: "request-prayer.html",
            controller: "RequestPrayerController",
        })
        .otherwise({
            redirectTo: "/"
        });
}]);

myApp.controller("MenuController", function($scope, $location) {
    $scope.isActive = function(path) {
        return $location.path() == path;
    };
});

myApp.controller("HomeController", function($scope, $http) {
    console.log("home");
    $(".carousel").carousel();
});

myApp.controller("AboutUsController", function($scope, $http) {
    console.log("about-us");
});

myApp.controller("MinistriesController", function($scope, $http) {
    console.log("ministries");
});

myApp.controller("GalleryController", function($scope, $http, galleryService) {
    console.log("gallery");
    galleryService.albums().then(function(a) {
        $scope.albums = a;
    });
});

myApp.controller("AlbumController", function($scope, galleryService, $routeParams) {
    console.log("album " + $routeParams.album);
    $scope.albumIdx = $routeParams.album;
    galleryService.albums().then(function(a) {
        $scope.album = a[$scope.albumIdx];
    });
});

myApp.controller("ImageController", function($scope, galleryService, $routeParams) {
    console.log("image " + $routeParams);
    $scope.albumIdx = $routeParams.album;
    $scope.imageIdx = $routeParams.image;
    $scope.album = galleryService.albums().then(function(a) {
        $scope.album = a[$scope.albumIdx];
        $scope.image = $scope.album.images[$scope.imageIdx];
    });
});

myApp.controller("ContactController", function($scope, $http) {
    console.log("contact");
});

myApp.controller("RequestPrayerController", function($scope, $http) {
    console.log("requestprayer");

    $scope.buttonDisabled = false;
    $scope.messageShow = false;
    $scope.formdata = {name: "", email: "", phone: "", message: ""};

    $scope.requestPrayer = function() {
        $scope.buttonDisabled = true;
        console.log($scope.formdata);
        $http.post("/request-prayer.do", $scope.formdata).then(function(res){
            $scope.buttonDisabled = false;
            $scope.messageShow = true;
        });
    };
});
