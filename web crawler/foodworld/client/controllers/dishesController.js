var starters = angular.module('starters');
var maincourse = angular.module('maincourse');
var desserts = angular.module('desserts');
var searchdish = angular.module('searchdish');


//scope binds controller to view of STARTERS
starters.controller('StarterController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
    $scope.getDishes = function(){
        $http.get('/api/dishes?type=Starter').success(function(response){
            $scope.dishes = response;
        });
    }
    
    $scope.getDish = function(){
        var id = $routeParams.id;
        $http.get('/api/dishes/'+id).success(function(response){
            $scope.dish = response;            
        });
    }
    
    $scope.addDishes = function(){
        $http.post('/api/dishes/', $scope.dish).success(function(response){
            alert(response);
        });
        window.location.href="#/";
        

        setTimeout("window.location.reload(true);", 1000);
    }
}]);


//scope binds controller to view of MAIN COURSE
maincourse.controller('MainCourseController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
    $scope.getDishes = function(){
        $http.get('/api/dishes?type=Main Course').success(function(response){
            $scope.dishes = response;            
        });
    }
    
    $scope.getDish = function(){
        var id = $routeParams.id;
        $http.get('/api/dishes/'+id).success(function(response){
            $scope.dish = response;            
        });
    }
    
}]);

angular.bootstrap(document.getElementById("profile"), ['maincourse']);

//scope binds controller to view of DESSERTS
desserts.controller('DessertController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
    $scope.getDishes = function(){
        $http.get('/api/dishes?type=Dessert').success(function(response){
            $scope.dishes = response;            
        });
    }
    
    $scope.getDish = function(){
        var id = $routeParams.id;
        $http.get('/api/dishes/'+id).success(function(response){
            $scope.dish = response;            
        });
    }
    
    
    
}]);

angular.bootstrap(document.getElementById("rating"), ['desserts']);

//scope binds controller to view of DESSERTS
searchdish.controller('SearchController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {    
    $scope.getDish = $scope.checkInDB = function(){
        $http.get('/api/dishes?name='+$scope.dishname).success(function(response){
            $scope.dishes = response;    
            //console.log($scope.dishes);
        });
    }
    
    $scope.getDish = function(){
        var id = $routeParams.id;
        $http.get('/api/dishes/'+id).success(function(response){
            $scope.dish = response;            
        });
    }
    
    

}]);

angular.bootstrap(document.getElementById("imdb"), ['searchdish']);
