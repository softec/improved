/*
 * Copyright 2011 SOFTEC sa. All rights reserved.
 *
 * Work derived from:
 * # Prototype JavaScript framework, version 1.6.1 and later
 * # (c) 2005-2009 Sam Stephenson
 * # Prototype is freely distributable under the terms of an MIT-style license.
 * # For details, see the Prototype web site: http://www.prototypejs.org/
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

/**
 * Improved
 *
 *  The [[Improved]] namespace provides fundamental information about the
 *  Improved library you're using, as well as a central repository for default
 *  iterators or functions.
 *
 *  We say "namespace," because the [[Improved]] object is not intended for
 *  instantiation, nor for mixing in other objects. It's really just... a
 *  namespace.
 *
 *  ##### Your version of Improved
 *
 *  Your scripts can check against a particular version of Improved by
 *  examining [[Improved.Version]], which is a version [[String]] (e.g.
 *  "1.0").
 *
 *  ##### Browser features
 *
 *  Improved also provides a (nascent) repository of
 *  [[Improved.BrowserFeatures browser feature information]], which it then
 *  uses here and there in its source code. The idea is, first, to make
 *  Improved's source code more readable; and second, to centralize whatever
 *  scripting trickery might be necessary to detect the browser feature, in
 *  order to ease maintenance.
 *
 *  ##### Default iterators and functions
 *
 *  Numerous methods in Improved objects (most notably the [[Enumerable]]
 *  module) let the user pass in a custom iterator, but make it optional by
 *  defaulting to an "identity function" (an iterator that just returns its
 *  argument, untouched). This is the [[Improved.K]] function, which you'll
 *  see referred to in many places.
 *
 *  Many methods also take it easy by protecting themselves against missing
 *  methods here and there, reverting to empty functions when a supposedly
 *  available method is missing. Such a function simply ignores its potential
 *  arguments, and does nothing whatsoever (which is, oddly enough,
 *  blazing fast). The quintessential empty function sits, unsurprisingly,
 *  at [[Improved.emptyFunction]] (note the lowercase first letter).
**/
var Improved = (function (Improved) {
  /**
   *  Improved.Version -> String
   *
   *  The version of the Improved library you are using (e.g. "1.0").
  **/
  Improved.Version = '1.0';

  /**
   *  Improved.titanium -> Titanium API
   *
   *  Check and return the Titanium API if available
  **/
  try {
    Improved.titanium = Titanium;
  } catch(e) {};

  /**
   *  Improved.userAgent -> String
   *
   *  The user agent of the current running engine
  **/
  Improved.UserAgent = ((Improved.titanium && Improved.titanium.userAgent)
                        || navigator.userAgent).toLowerCase();

  if( !Improved.titanium ) {
    /**
     *  Improved.Browser
     *
     *  A collection of [[Boolean]] values indicating the browser which is
     *  currently in use. Available properties are `IE`, `IE9`, `Opera`,
     *  `WebKit`, `MobileSafari`, `Gecko`, `OperaMobile`, `OperaMini`,
     *  `Symbian`, `BlackBerry`, `Palm`, `WindowsMobile`, `WindowsPhone`,
     *  `WebOS`, `Maemo`, `NetFront` and `Bada`.
     *
     *  If Improved.Browser.IE is true, then you also get
     *  Improved.Browser.IEVersion, which will contain an integer value
     *  representing the version of IE detected.
     *
     *  Example
     *
     *      Improved.Browser.IE;
     *      //-> true, when executed in any IE browser.
     *
     *      Improved.Browser.IEVersion;
     *      //-> 8, when executed in Internet Explorer 8
    **/
    var brw = Improved.Browser = (function(){
      var ua = Improved.UserAgent;
      var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
      return {
        IE:             !isOpera && !!window.attachEvent,
        Opera:          isOpera,
        WebKit:         ua.indexOf('applewebkit/') > -1,
        Gecko:          ua.indexOf('gecko') > -1 && ua.indexOf('khtml') === -1,
        MobileSafari:   /apple.*mobile.*safari/.test(ua),
        OperaMobile:    isOpera && ua.indexOf('mobi') > -1,
        OperaMini:      isOpera && ua.indexOf('mini') > -1,
        Symbian:        ua.indexOf('symbian') > -1 || ua.indexOf('series') > -1,
        BlackBerry:     ua.indexOf('blackberry') > -1  || ua.indexOf('vnd.rim') > -1,
        Palm:           ua.indexOf('palm') > -1 || ua.indexOf('blazer') > -1 || ua.indexOf('xiino') > -1,
        WindowsMobile:  !isOpera && !!window.attachEvent && (ua.indexOf('windows ce') > -1 || ua.indexOf('iemobile') > -1 || ua.indexOf('wm5 pie') > -1 || ua.indexOf('htc') > -1),
        WindowsPhone:   ua.indexOf('windows phone') > -1,
        WebOS:          ua.indexOf('webos') > -1,
        Maemo:          !isOpera && ua.indexOf('maemo') > -1,
        NetFront:       ua.indexOf('netfront') > -1,
        OpenWave:       ua.indexOf('up.browser') > -1,
        Bada:           ua.indexOf('bada') > -1,
        DoCoMo:         ua.indexOf('docomo') > -1,
        Wap:            ua.indexOf('wap') > -1,
        Wap2:           ua.indexOf('wap2') > -1
      }
    })();

    if( brw.IE ) {
      var ie = (function(){
      var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
      while ( div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0] );
      return v;}());
      if( ie > 4 ) brw.IEVersion = ie;
      brw.IEMode = document.documentMode || brw.IEVersion;
    }

    /**
     *  Improved.BrowserExtensions
     *
     *  Provide constants for browser extensions, like -moz- and -webkit-.
     *  Improved.BrowserExtensions.cssPrefix is for CSS
     *  Improved.BrowserExtensions.jsPrefix is for CSS manipulation in JavaScript
     *  Improved.BrowserExtensions.transitionEnd is the name of the transitionEnd event.
    **/
    Improved.BrowserExtensions = (function(ex){
      if(brw.IE) {
        if (brw.IEVersion >= 9) {
          ex.cssPrefix = '-ms-';
          ex.jsPrefix = 'ms';
        }
        return ex;
      }
      if(brw.Opera) {
        ex.cssPrefix = '-o-';
        ex.jsPrefix = 'O'
        ex.transitionEnd = 'oTransitionEnd';
        return ex;
      }
      if(brw.Gecko) {
        ex.cssPrefix = '-moz-';
        ex.jsPrefix = 'Moz';
        ex.transitionEnd = 'transitionend';
        return ex;
      }
      if(brw.WebKit) {
        ex.cssPrefix = '-webkit-';
        ex.jsPrefix = 'webkit';
        ex.transitionEnd = 'webkitTransitionEnd';
        return ex;
      }
    })({
      cssPrefix: '',
      jsPrefix: '',
      transitionEnd: 'transitionend'
    });

    /**
     *  Improved.BrowserFeatures
     *
     *  A collection of [[Boolean]] values indicating the presence of specific
     *  browser features.
    **/
    Improved.BrowserFeatures = {
      /**
       *  Improved.BrowserFeatures.XPath -> Boolean
       *
       *  Used internally to detect if the browser supports
       *  [DOM Level 3 XPath](http://www.w3.org/TR/DOM-Level-3-XPath/xpath.html).
      **/
      XPath: !!document.evaluate,

      /**
       *  Improved.BrowserFeatures.SelectorsAPI -> Boolean
       *
       *  Used internally to detect if the browser supports the
       *  [NodeSelector API](http://www.w3.org/TR/selectors-api/#nodeselector).
      **/
      SelectorsAPI: !!document.querySelector,

      /**
       *  Improved.BrowserFeatures.ElementExtensions -> Boolean
       *
       *  Used internally to detect if the browser supports extending html element
       *  prototypes.
      **/
      ElementExtensions: (function() {
        var constructor = window.Element || window.HTMLElement;
        return !!(constructor && constructor.prototype);
      })(),

      SpecificElementExtensions: (function() {
        if (brw.MobileSafari)
          return false;

        if (typeof window.HTMLDivElement !== 'undefined')
          return true;

        var div = document.createElement('div');
        var form = document.createElement('form');
        var isSupported = false;

        if (div['__proto__'] && (div['__proto__'] !== form['__proto__'])) {
          isSupported = true;
        }

        div = form = null;

        return isSupported;
      })(),

      VML: (function() {
        if( typeof document.namespaces === 'undefined' ) return false;
        if( typeof document.namespaces['v'] !== 'undefined' ) return true;
      })(),

      addVMLSupport: function() {
        var self = Improved.BrowserFeatures, createVMLDocument;

        if( createVMLDocument ) return (self.VML = true);
        if( typeof document.namespaces === 'undefined' || (brw.IE && brw.IEMode > 8)) return (self.VML = false);

        var stylesheet = new Element('style');
        stylesheet.type = 'text/css';
        stylesheet.styleSheet.cssText = "v\\:* {behavior:url(#default#VML);display:inline-block}";
        $$('head')[0].insert(stylesheet);

        createVMLDocument = document.createDocumentFragment();
        createVMLDocument.namespaces.add('v', 'urn:schemas-microsoft-com:vml');

        Element.newVMLElement = function (tagName, prop) {
          return $(createVMLDocument.createElement('v:' + tagName)).writeAttribute(prop || {});
        };

        return true;
      }
    };
  }

  /**
   *  Improved.Device
   *
   *  A collection of [[Boolean]] values indicating the device which is
   *  currently in use. Available properties are 'Mobile', 'SmartPhone',
   *  `iPhone`, `iPod`, `iPad`,`Android`, `BlackBerryTouch` and `LinuxTablet`.
   *
   *  Example
   *
   *      Improved.Device.SmartPhone;
   *      //-> true, when executed on a smartphone (iPhone, Android or WindowsMobile).
  **/
  var dev = Improved.Device = (function(){
    var ua = Improved.UserAgent;
    return {
      iPhone:           ua.indexOf('iphone') > -1,
      iPod:             ua.indexOf('ipod') > -1,
      iPad:             ua.indexOf('ipad') > -1,
      Android:          ua.indexOf('android') > -1,
      BlackBerryTouch:  ua.indexOf('blackberry95') > -1 || ua.indexOf('blackberry 98') > -1,
      LinuxTablet:      (ua.indexOf('tablet') > -1 && ua.indexOf('linux') > -1),
      Samsung:          ua.indexOf('samsung') > -1 || ua.indexOf('sgh') > -1,
      KDDI:             ua.indexOf('kddi') > -1,
      Nokia:            ua.indexOf('nokia') > -1,
      HTC:              ua.indexOf('htc') > -1,
      SonyEricsson:     ua.indexOf('sonyericsson') === 0,
      Siemens:          ua.indexOf('sie') === 0,
      Motorola:         ua.indexOf('mot') === 0,
      HP:               ua.indexOf('hp') === 0,
      LG:               ua.indexOf('lg') === 0
    }
  })();

  dev.Mobile = dev.iPhone || dev.Android || brw.MobileSafari || brw.BlackBerry || brw.OperaMobile || brw.OperaMini
            || brw.Symbian || brw.Palm || brw.WindowsPhone || brw.WindowsMobile || brw.WebOS || brw.NetFront
            || brw.OpenWave || brw.Bada || brw.DoCoMo || brw.Wap || brw.Wap2 || dev.LinuxTablet || dev.Samsung
            || dev.KDDI || dev.Nokia || dev.SonyEricsson || dev.Siemens || dev.Motorola || dev.HP || dev.LG
            || Improved.UserAgent.indexOf('phone') > -1 || screen.width < 480;

  dev.SmartPhone = dev.iPhone || dev.Android || brw.MobileSafari || brw.WindowsPhone;

  Improved.ScriptFragment = '<script[^>]*>([\\S\\s]*?)<\/script>';
  Improved.JSONFilter = /^\/\*-secure-([\s\S]*)\*\/\s*$/;

  /**
   *  Improved.emptyFunction([argument...]) -> undefined
   *  - argument (Object): Optional arguments
   *
   *  The [[Improved.emptyFunction]] does nothing... and returns nothing!
   *
   *  It is used thoughout the framework to provide a fallback function in order
   *  to cut down on conditionals. Typically you'll find it as a default value
   *  for optional callback functions.
  **/
  Improved.emptyFunction = function() { };

  /**
   *  Improved.K(argument) -> argument
   *  - argument (Object): Optional argument...
   *
   *  [[Improved.K]] is Improved's very own
   *  [identity function](http://en.wikipedia.org/wiki/Identity_function), i.e.
   *  it returns its `argument` untouched.
   *
   *  This is used throughout the framework, most notably in the [[Enumerable]]
   *  module as a default value for iterators.
   *
   *  ##### Examples
   *
   *      Improved.K('hello world!');
   *      // -> 'hello world!'
   *
   *      Improved.K(200);
   *      // -> 200
   *
   *      Improved.K(Improved.K);
   *      // -> Improved.K
  **/
  Improved.K = function(x) { return x };

  return Improved;
}(Improved || {}));

var Prototype = Improved; // Prototype code compatibility

var Abstract = { };
