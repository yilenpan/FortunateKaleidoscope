//this file is all done ---- dont mess with it

angular.module('sniphub', ['ngRoute','ui.router'])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
  $urlRouterProvider.otherwise('snippets');
  $stateProvider
    .state('snippets', {
      url: '/snippets',
      controller: 'SnippetsController',
      views: {
        'top' : { templateUrl: 'app/navbar.html'},
        'main' : { templateUrl: 'app/snippets/snippets.html' }
      }
    })
    .state('addSnippet', {
      url: '/addSnippet',
      controller: 'AddSnippetController',
      views: {
        'top' : { templateUrl: 'app/navbar.html'},
        'main' : { templateUrl: 'app/addSnippet/addSnippet.html' }
      }
    })
    .state('signup', {
      url: '/signup',
      controller: 'AuthController',
      views: {
        'main' : { templateUrl: 'app/auth/signup.html' }
      }
    })
    .state('signin', {
      url: '/signin',
      controller: 'AuthController',
      views: {
        'main' : { templateUrl: 'app/auth/signin.html' }
      }
    });

    $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.sniphub');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  // ***change this for out auth setup***

  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    //removed next.$$route.authenticate because it was returning undefined
    if (next.$$route && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});