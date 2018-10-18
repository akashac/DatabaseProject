var starters = angular.module('starters',['ngRoute']);
var maincourse = angular.module('maincourse',['ngRoute']);
var desserts = angular.module('desserts',['ngRoute']);
var searchdish = angular.module('searchdish',['ngRoute']);

starters.config(function($routeProvider){
    $routeProvider.when('/', {
        controller:'StarterController',
        templateUrl:'views/dishes.html'
    })
    .when('/dishes',{
        controller:'StarterController',
        templateUrl:'views/dishes.html'        
    })
    .when('/dishes/details/:id',{
        controller:'StarterController',
        templateUrl:'views/dish_details.html '
    })
    .when('/dishes/add',{
        controller:'StarterController',
        templateUrl:'views/add_dishes.html '
    })
    .when('/restaurants/details/:id',{
        controller:'StarterController',
        templateUrl:'views/restaurant_details.html'  
    })
    .otherwise({
        redirectTo:'/'
    });
});


maincourse.config(function($routeProvider){
    $routeProvider.when('/', {
        controller:'MainCourseController',
        templateUrl:'views/dishes.html'
    })
    .when('/dishes',{
        controller:'MainCourseController',
        templateUrl:'views/dishes.html'        
    })
    .when('/dishes/details/:id',{
        controller:'MainCourseController',
        templateUrl:'views/dish_details.html '
    })
    .when('/dishes/add',{
        controller:'MainCourseController',
        templateUrl:'views/add_dishes.html '
    })
    .when('/restaurants/details/:id',{
        controller:'MainCourseController',
        templateUrl:'views/restaurant_details.html'  
    })
    .otherwise({
        redirectTo:'/'
    });
});


desserts.config(function($routeProvider){
    $routeProvider.when('/', {
        controller:'DessertController',
        templateUrl:'views/dishes.html'
    })
    .when('/dishes',{
        controller:'DessertController',
        templateUrl:'views/dishes.html'        
    })
    .when('/dishes/details/:id',{
        controller:'DessertController',
        templateUrl:'views/dish_details.html '
    })
    .when('/dishes/add',{
        controller:'DessertController',
        templateUrl:'views/add_dishes.html '
    })
    .when('/restaurants/details/:id',{
        controller:'DessertController',
        templateUrl:'views/restaurant_details.html'  
    })
    .otherwise({
        redirectTo:'/'
    });
});

searchdish.config(function($routeProvider){
    $routeProvider.when('/', {
        controller:'SearchController',
        templateUrl:'views/dishes.html'
    })
    .when('/dishes',{
        controller:'SearchController',
        templateUrl:'views/dishes.html'        
    })
    .when('/dishes/details/:id',{
        controller:'SearchController',
        templateUrl:'views/dish_details.html '
    })
    .when('/dishes/add',{
        controller:'SearchController',
        templateUrl:'views/add_dishes.html '
    })
    .when('/restaurants/details/:id',{
        controller:'SearchController',
        templateUrl:'views/restaurant_details.html'  
    })
    .otherwise({
        redirectTo:'/'
    });
});
