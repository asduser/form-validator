(function(){

    "use strict";

    angular
        .module("myApp", ["app.utils"])
        .controller("myController", myController);

    function myController(){
        var vm = this;

        vm.mock = {
            "password": "",
            "passwordConfirmed": "",
            "name": "",
            "phone": "",
            "email": "",
            "info": ""
        };

        vm.showMessage = function(){
            alert("Form was passed with success.");
        };

    }

})();