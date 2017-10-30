(function() {
    "use strict";
    //  Module
    angular
        .module("spa-m2.cities")
        .controller("spa-m2.cities.CitiesController", CitiesController);
    //  Controller
    CitiesController.$inject = ["spa-m2.cities.City"];
    function CitiesController(City) {
        var vm  =  this;
        vm.cities;
        vm.city;
        vm.edit = edit;
        vm.create = create;
        vm.update = update;
        vm.remove = remove;
        //  activate logic
        activate();
        ////////
        function activate() {
          newCity();
          vm.cities = City.query();
        }

        function newCity() {
          vm.city = new City();
        }

        function handleError(response) {
          console.log(response);
        }

        function edit(object) {
          //console.log("selected", object);
          vm.city = object;
        }

        function create() {
          //console.log("creating city", vm.city);
          vm.city.$save()
          .then(function(response){
            //console.log(response);
            vm.cities.push(vm.city);
            newCity();
          })
          .catch(handleError);
        }

        function update() {
          //console.log("creating city", vm.city);
          vm.city.$update()
          .then(function(response){
            newCity();
            //console.log(response);
          })
          .catch(handleError);
        }

        function remove() {
          //console.log("creating city", vm.city);
          vm.city.$delete()
          .then(function(response){
            //console.log(response);
            // remove element from local array
            removeElement(vm.cities, vm.city)
            //vm.cities = City.query();
            //replace edit area with prototype inctance
            newCity();
          })
          .catch(handleError);
        }

        function removeElement(elements, element) {
          for (var i=0; i<elements.length; i++) {
            if (elements[i].id == element.id) {
              elements.splice(i,1);
              break;
            }
          }
        }
    }
})();
