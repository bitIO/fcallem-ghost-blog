/*!
* jQuery - Spectragram by Adrian Quevedo
* http://adrianquevedo.com/  - http://lab.adrianquevedo.com/ - http://elnucleo.com.co/
*
* Dual licensed under the MIT or GPL Version 2 licenses.
* You are free to use this plugin in commercial projects as long as the copyright header is left intact.
*
* This plugin uses the Instagram(tm) API and is not endorsed or certified by Instagram or Burbn, inc.
* All Instagram(tm) logos and trademarks displayed on this plugin are property of Burbn, Inc.
*
* Date: Thu Jul 15 14:05:02 2012 -0500
*/

if (typeof Object.create !== 'function') {
 Object.create = function(obj) {
   function F() {
   }
   ;
   F.prototype = obj;
   return new F()
 }
}
(function($, window, document, undefined) {
 var Instagram = {init: function(options, elem) {
     var self = this;
     self.elem = elem;
     self.$elem = $(elem);
     self.api = 'https://api.instagram.com/v1', self.accessData = $.fn.spectragram.accessData, self.options = $.extend({}, $.fn.spectragram.options, options)
   },getRecentMedia: function(userID) {
     var self = this, getData = '/users/' + userID + '/media/recent/?' + self.accessData.clientID + '&access_token=' + self.accessData.accessToken + '';
     self.fetch(getData).done(function(results) {
       self.display(results)
     })
   },getUserFeed: function() {
     var self = this, getData = '/users/search?q=' + self.options.query + '&count=' + self.options.max + '&client_id=' + self.accessData.clientID + '';
     self.fetch(getData).done(function(results) {
       if (results.data.length) {
         for (var length = results.data.length, i = 0; i < length; i++) {
           if ( results.data[i].username === self.options.query) {
            self.getRecentMedia(results.data[i].id);
           }
         }

       } else {
         $.error('Spectagram.js - Error: the username ' + self.options.query + ' does not exist.')
       }
     })
   },getPopular: function() {
     var self = this, getData = '/media/popular?client_id=' + self.accessData.clientID + '&access_token=' + self.accessData.accessToken + '';
     self.fetch(getData).done(function(results) {
       self.display(results)
     })
   },getRecentTagged: function() {
     var self = this, getData = '/tags/' + self.options.query + '/media/recent?client_id=' + self.accessData.clientID + '&access_token=' + self.accessData.accessToken + '';
     self.fetch(getData).done(function(results) {
       if (results.data.length) {
         self.display(results)
       } else {
         $.error('Spectagram.js - Error: the tag ' + self.options.query + ' does not have results.')
       }
     })
   },fetch: function(getData) {
     var self = this, getUrl = self.api + getData;
     return $.ajax({type: "GET",dataType: "jsonp",cache: false,url: getUrl})
   },display: function(results) {
     if ( ! results.data ) {
       $.error('Spectagram.js - No data retrieved.');
       console.log(results);
       return;
     }
     var self = this;
     var setSize = self.options.size;
     var size;
     var max = (self.options.max >= results.data.length) ? results.data.length : self.options.max;

     if (results.data.length === 0) {
       self.$elem.append($(self.options.wrapEachWith).append(self.options.notFoundMsg))
     } else {
       for (var i = 0; i < max; i++) {
         if (setSize == "small") {
           size = results.data[i].images.thumbnail.url
         } else if (setSize == "medium") {
           size = results.data[i].images.low_resolution.url
         } else {
           size = results.data[i].images.standard_resolution.url
         }
         self.$elem.append($(self.options.wrapEachWith).append("<a target='_blank' href='" + results.data[i].link + "'><img src='" + size + "'></img></a>"))
       }
     }
   }};
 jQuery.fn.spectragram = function(method, options) {
   if (jQuery.fn.spectragram.accessData.clientID) {
     this.each(function() {
       var instagram = Object.create(Instagram);
       instagram.init(options, this);
       if (instagram[method]) {
         return instagram[method](this)
       } else {
         $.error('Method ' + method + ' does not exist on jQuery.spectragram')
       }
     })
   } else {
     $.error('You must define an accessToken and a clientID on jQuery.spectragram')
   }
 };
 jQuery.fn.spectragram.options = {max: 10,query: 'coffee',size: 'medium',wrapEachWith: '<li></li>'};
 jQuery.fn.spectragram.accessData = {accessToken: null,clientID: null}
})(jQuery, window, document);
