/*!
 * bootstrap-add-clear v1.0.3 (http://github.com/gesquive/bootstrap-add-clear)
 * Licensed under MIT (http://github.com/gesquive/bootstrap-add-clear/blob/master/LICENSE)
 */
 (function (factory) {
   if (typeof define === 'function' && define.amd) {
       // AMD. Register as an anonymous module.
       define(['jquery'], factory);
   } else if (typeof module === 'object' && module.exports) {
       // Node/CommonJS
       module.exports = function( root, jQuery ) {
           if ( jQuery === undefined ) {
               // require('jQuery') returns a factory that requires window to
               // build a jQuery instance, we normalize how we use modules
               // that require this pattern but the window provided is a noop
               // if it's defined (how jquery works)
               if ( typeof window !== 'undefined' ) {
                   jQuery = require('jquery');
               }
               else {
                   jQuery = require('jquery')(root);
               }
           }
           factory(jQuery);
           return jQuery;
       };
   } else {
       // Browser globals
       factory(jQuery);
   }
  }(function ($) {
    // Create the defaults once
    var pluginName = "addClear",
      defaults = {
        closeSymbol: "",
        symbolClass: 'glyphicon glyphicon-remove-circle',
        color: "#CCC",
        top: 0,
        right: 0,
        returnFocus: true,
        showOnLoad: false,
        onClear: null,
        hideOnBlur: false,
        clearOnEscape: true,
        wrapperClass: ''
      };

    // The actual plugin constructor
    function Plugin(element, options) {
      this.element = element;

      this.options = $.extend({}, defaults, options);

      this._defaults = defaults;
      this._name = pluginName;

      this.init();
    }

    Plugin.prototype = {

      init: function() {
        var $this = $(this.element),
          me = this,
          options = this.options;

        $this.wrap("<div class='add-clear-span has-feedback " + options.wrapperClass + "'></div>");
        $this.after($("<span class='add-clear-x form-control-feedback " + options.symbolClass + "' style='display: none;'>" + options.closeSymbol + "</span>"));
        $this.next().css({
          color: options.color,
          cursor: 'pointer',
          'text-decoration': 'none',
          display: 'none',
          overflow: 'hidden',
          position: 'absolute',
          'pointer-events': 'auto',
          right: options.right,
          top: options.top
        }, this);

        if ($this.val().length >= 1 && options.showOnLoad === true) {
          $this.siblings(".add-clear-x").show();
        }

        $this.on('focus.addclear', function() {
          if ($(this).val().length >= 1) {
            $(this).siblings(".add-clear-x").show();
          }
        });

        $this.on('blur.addclear', function() {
          var self = this;

          if (options.hideOnBlur) {
            setTimeout(function() {
              $(self).siblings(".add-clear-x").hide();
            }, 50);
          }
        });

        $this.on('keyup.addclear', function(e) {
          if (options.clearOnEscape === true && e.keyCode == 27) {
            $(this).val('').focus();
            if (options.onClear) {
              options.onClear($(this).siblings("input"));
            }
          }
          if ($(this).val().length >= 1) {
            $(this).siblings(".add-clear-x").show();
          } else {
            $(this).siblings(".add-clear-x").hide();
          }
        });

        $this.on('input.addclear change.addclear paste.addclear', function() {
          if ($(this).val().length >= 1) {
            $(this).siblings(".add-clear-x").show();
          } else {
            $(this).siblings(".add-clear-x").hide();
          }
        });

        $this.siblings(".add-clear-x").on('click.addclear', function(e) {
          $(this).siblings(me.element).val("");
          $(this).hide();
          if (options.returnFocus === true) {
            $(this).siblings(me.element).focus();
          }
          if (options.onClear) {
            options.onClear($(this).siblings("input"));
          }
          e.preventDefault();
        });
      }

    };

    $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          $.data(this, "plugin_" + pluginName,
            new Plugin(this, options));
        }
      });
    };
}));
