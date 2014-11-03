(function (window, $, undefined) {
  'use strict';

  var simpletheme;

  simpletheme = function simpletheme(cockpit) {
    console.log("Loading Simple Theme plugin in the browser.");

    this.cockpit = cockpit;

    this.name = 'simpletheme';   
    this.viewName = 'Simple Theme'; 
    this.canBeDisabled = true; 

    this.enable = function () {
      jQuery('html').addClass('simpleTheme');
    };
    this.disable = function () {
      jQuery('html').removeClass('simpleTheme');
    };
  };

  simpletheme.prototype.listen = function listen() {
    var rov = this;
  };

  window.Cockpit.plugins.push(simpletheme);

}(window, jQuery));
