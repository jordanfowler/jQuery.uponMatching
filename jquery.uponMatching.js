/*
 * jQuery.uponMatching v0.1
 *
 * Copyright 2011, Jordan Fowler
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * April 2011
 */

(function($) {
  var methods = {
    init: function(options) {
      if (!options['matcher'] || !options['onMatch']) {
        $.error('jQuery.uponMatching requires options "matcher" and "onMatch" to be specified.');
      } else {
        var settings = {
          onMatch: function(event, value) {},
          onMiss: function(event, value) {},
          eventType: 'change',
          attr: 'val',
          delay: 50
        };

        return this.each(function() {
          var self = $(this);

          if (options) {
            $.extend(settings, options);
          };

          self.bind(options.eventType + '.uponMatching', settings, methods.test);
        });
      }
    },

    test: function(event) {
      var self = $(this),
          matcher = event.data.matcher,
          onMatch = event.data.onMatch,
          onMiss  = event.data.onMiss,
          attr = event.data.attr,
          delay = event.data.delay;

      var value = /^val(ue){0,1}$/.test(attr) ? self.val() : self.attr(attr);
      var retVal = null;

      if (matcher['test'] && typeof(matcher['test']) == 'function') {
        retVal = matcher.test(value)
      } else if (typeof(matcher) == 'function') {
        retVal = matcher(value)
      } else if (typeof(matcher) == 'string') {
        retVal = (matcher == value);
      }

      if (retVal) {
        setTimeout(function() {
          onMatch.apply(self, [event, value]);
        }, delay);
      } else {
        onMiss.apply(self, [event, value]);
      }
    },

    destroy: function() {
      return this.each(function() {
        $(window).unbind('.uponMatching');
      });
    }
  };

  $.fn.uponMatching = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || ! method) {
      return methods.init.apply( this, arguments );
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.uponMatching');
    }
  };
})(jQuery);