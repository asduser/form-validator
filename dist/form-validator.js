(function(){

    "use strict";

    angular.module("app.utils", []);

    angular
        .module("app.utils")
        .directive("formValidator", formValidator);

    function formValidator(){

        return {
            restrict: "E",
            scope: {
                handler: "="
            },
            link: function(scope, el, attrs){

                var options = {
                    // Password length. If less - field won't be a valid.
                    "PasswordLength": get(attrs.passwordLength) || 6,
                    // Show\hide interactive errors on UI.
                    "DisplayErrors": get(attrs.displayErrors),
                    // Emails #ids collection to compare.
                    "Email": get(attrs.email) || false,
                    // Phones #ids collection which will be used for validation.
                    "Phone": get(attrs.phone) || false,
                    // Passwords #ids collection to compare (length, equal, empty).
                    "ComparePassword": get(attrs.comparePassword) || false,
                    // Retrieve input ids for generating the validation rules.
                    "Set": get(attrs.set),
                    // A border type depending on event happened.
                    "Border": {
                        "Default": "1px solid #ccc" || attrs.defaultBorder,
                        "Danger": "2px solid #aa0000" || attrs.dangerBorder
                    },
                    // #id or .class element which will manage current behaviour.
                    "Element": attrs.element,
                    // Procedure which will be invoked through directive scope (if validation result is successful).
                    "Handler": attrs.handler
                };

                try {
                    var result = $("#" + options.Element).length || $("." + options.Element).length;
                    if (!result) throw "Can't bind validation to non-existent entity. Be sure, that you had specified element #id or .class as a parameter into 'element' attribute.";
                } catch (e) {
                    throw new Error(e);
                }

                var element = $("#" + options.Element) || $("." + options.Element);
                element.bind("click", function($event){

                    extendArray( [options.Email, options.Phone, options.ComparePassword] , options.Set);

                    var validation = [
                        isValid([{ Type: 'Null', Collection: options.Set} ])
                    ];
                    options.ComparePassword && validation.push( isValid([{ Type: 'Password', Collection: options.ComparePassword }]));
                    options.Email && validation.push( isValid([{ Type: 'Email', Collection: options.Email }]));
                    options.Phone && validation.push( isValid([{ Type: 'Phone', Collection: options.Phone }]));

                    options.DisplayErrors && displayErrors(validation);
                    isPassed(validation) && scope.handler();
                });

                scope._options = options;
                scope.isDynamic = function(){
                    if (options.IsDynamic) {
                        element.trigger("click");
                    }
                };

                /*
                 ** FORM VALIDATION METHODS
                 */
                function isValid(validationRules){
                    var validation = {
                            IsEmailInCollection: IsEmailInCollection,
                            IsNullInCollection: IsNullInCollection,
                            IsPasswordInCollection: IsPasswordInCollection,
                            IsPhoneInCollection: IsPhoneInCollection
                        },
                        response = false;

                    validationRules.forEach(function(rule){
                        var method = "Is" + rule.Type + "InCollection";
                        response = validation[method](rule.Collection);
                    });
                    return response;
                }

                function displayErrors(collection){
                    collection.forEach(function(v){
                        if (!v.State) {
                            $("#error-validation-block-" + v.Type).show();
                        } else {
                            $("#error-validation-block-" + v.Type).hide();
                        }
                    });
                }

                function isPassed(collection){
                    return collection.every(function(v){ return v.State == true })
                }

                function IsEmailInCollection(collection) {
                    var status = true;
                    collection.forEach(function(i){
                        var ui = $('#'+i);
                        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        var result = re.test(ui.val());
                        if (!result) {
                            status = false;
                            renderNegativeBorder(ui);
                        } else {
                            renderPositiveBorder(ui);
                        }
                        renderFocusBorder(ui);
                    });
                    return {Type: "email", State: status};
                }

                function IsPhoneInCollection(collection){
                    var status = true;
                    collection.forEach(function(i){
                        var ui = $('#'+i);
                        var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
                        var result = re.test(ui.val());
                        if (!result) {
                            status = false;
                            renderNegativeBorder(ui);
                        } else {
                            renderPositiveBorder(ui);
                        }
                        renderFocusBorder(ui);
                    });
                    return {Type: "phone", State: status};
                }

                function IsNullInCollection(collection){
                    var result = true;
                    collection.forEach(function(i){
                        var ui = $('#'+i);
                        if (ui.val() == null || ui.val() == "") {
                            result = false;
                            renderNegativeBorder(ui);
                        } else {
                            renderPositiveBorder(ui);
                        }
                        renderFocusBorder(ui);
                    });
                    return {Type: "null", State: result};
                }

                function IsPasswordInCollection(collection){
                    var result = true, p1, p2;

                    p1 = $('#'+ collection[0]);
                    p2 = $('#'+ collection[1]);

                    if (!p1.val() && !p2.val() || p1.val().length < options.PasswordLength || p2.val().length < options.PasswordLength || p1.val() != p2.val()) {
                        result = false;
                        renderNegativeBorder(p1);
                        renderNegativeBorder(p2);
                    } else {
                        renderPositiveBorder(p1);
                        renderPositiveBorder(p2);
                    }
                    renderFocusBorder(p1);
                    renderFocusBorder(p2);

                    return {Type: "password", State: result};
                }

                function renderFocusBorder(ui){
                    ui.focus(function(){
                        ui[0].style.border = options.Border.Default;
                    })
                }

                function renderNegativeBorder(ui){
                    ui[0].style.border = options.Border.Danger;
                }

                function renderPositiveBorder(ui){
                    ui[0].style.border = options.Border.Default;
                }

            },
            template: '<div class="alert alert-danger" id="error-validation-block-null" style="display:none;"><strong>Warning!</strong> This field(s) cant be empty. </div>' +
                '<div class="alert alert-danger" id="error-validation-block-email" style="display:none;"><strong>Warning!</strong> Email is incorrect.</div>' +
                '<div class="alert alert-danger" id="error-validation-block-password" style="display:none;"><strong>Warning!</strong> Passwords must be equal. Passwords must be > {{ _options.PasswordLength }} symbols.</div>' +
                '<div class="alert alert-danger" id="error-validation-block-phone" style="display:none;"><strong>Warning!</strong> Phone is incorrect.<p> Use one of the examples below: </p><br/>(123) 456-7890 <br/>123-456-7890 <br/>123.456.7890 <br/>1234567890 <br/></div>'
        };

        /**
         * Retrieve value from received array and if it equals not false -> take its elements into the main collection.
         * @param valueCollection {Array}
         * @param mainArray {Array}
         */
        function extendArray(valueCollection, mainArray){
            valueCollection.forEach(function(value){
                if (value) {
                    value.forEach(function(el){
                        mainArray.push(el);
                    });
                }
            });
        }

        /**
         * Parse serialized string, otherwise just return it.
         * @param val {String|Boolean|Number|Array|Function}
         * @returns {*}
         */
        function get(val) {
            return typeof val == "string" ? JSON.parse(val) : val;
        }

        /**
         * Capitalize first letter in word.
         * @param string {String}
         * @returns {string}
         */
        function upperFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

    }

    // IoC container.
    formValidator.$inject = [];

})();