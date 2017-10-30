(function() {
    "use strict";
    //  Module
    angular
        .module("spa-m2")
        .config(RouterFunction);

      RouterFunction.$inject = ["$stateProvider",
                                "$urlRouterProvider",
                                "spa-m2.APP_CONFIG"
                               ];

      function RouterFunction($stateProvider, $urlRouterProvider, APP_CONFIG) {
        $stateProvider
        .state("home", {
          url: "/",
          templateUrl: APP_CONFIG.main_page_html,
          // controller: ,
          // controllerAs: ,
        })

        $urlRouterProvider.otherwise("/");
      }
})();
