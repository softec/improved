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

(function(){
  var requestId = 0,
      readyState = ['uninitialized','loading','loaded','interactive','complete'];

  function cleanup(scriptElem) {
    scriptElem.onload = scriptElem.onreadystatechange = null;
    scriptElem.remove();
    window[this.callback] = undefined;
    this._failTask = null;
    this._loadTask = null;
    this.readyState = 4;
    if( Object.isFunction(this.onreadystatechange) ) this.onreadystatechange();
  }

  Ajax.JSONPTransport = Class.create({
   initialize: function(callbackParam, evalJSON, sameOrigin, timeout) {
     this.onreadystatechange = Improved.emptyFunction;
     this.readyState = 0;
     this.status = 0;
     this.statusText = '';
     this.evalJSON = evalJSON;
     this.sameOrigin = sameOrigin;
     this.timeout = timeout || 10;
     this.callbackParam = callbackParam  || 'callback';
     this.responseText = null;
     this.responseJSON = null;
     this.responseXML = null;
   },

   getRequestId: function() {
     return requestId++;
   },

   open: function(method,url,async) {
     var callback = this.callback = '__ipdJSONP_' + this.getRequestId();
     this.src = url + (url.include('?') ? '&' : '?') + this.callbackParam + '=' + callback;
     window[callback] = function(json) {
       this.readyState = 4;
       this.status = 200;
       this.statusText = 'OK';
       if( Object.isString(json) ) {
         this.responseText = json;
       } else {
         this.responseJSON = json;
       }
     }.bind(this);
   },

   send: function(body) {
     if( this.evalJSON != 'force' && !this.sameOrigin() ) {
       this.status = 405;
       this.statusText = 'Method Not Allowed';
       this.readyState = 4;
       if( Object.isFunction(this.onreadystatechange) ) this.onreadystatechange();
       return;
     }
     var head = document.head || document.getElementsByTagName("head");
     // loading code inspired from LABjs
     this._loadTask = window.setTimeout(function () {
        if ("item" in head) { // check if ref is still a live node list
          if (!head[0]) { // append_to node not yet ready
              setTimeout(this._loadTask, 25);
              return;
          }
          head = head[0]; // reassign from live node list ref to pure node ref -- avoids nasty IE bug where changes to DOM invalidate live node lists
        }

        var scriptElem = new Element("script");
        scriptElem.onload = scriptElem.onreadystatechange = function () {
          var rs = readyState.indexOf(scriptElem.readyState);
          if( rs > 0 && rs < 4 && rs !== this.readyState ) {
            this.readyState = rs;
            if( Object.isFunction(this.onreadystatechange) ) this.onreadystatechange();
          }
          if (this.readyState != 4 && scriptElem.readyState && scriptElem.readyState !== "complete" && scriptElem.readyState !== "loaded") {
            return false;
          }
          window.clearTimeout(this._failTask);
          if( this.readyState != 4 ) {
            this.status = 204;
            this.statusText = 'No Content';
          }
          cleanup.call(this,scriptElem);
        }.bind(this);
        scriptElem.onerror = function () {
          window.clearTimeout(this._loadTask);
          window.clearTimeout(this._failTask);
          if( this.readyState != 4 ) {
            this.status = 404;
            this.statusText = 'Not Found';
          }
          cleanup.call(this,scriptElem);
        }.bind(this)
        scriptElem.src = this.src;
        head.insertBefore(scriptElem, head.firstChild);
        this._failTask = window.setTimeout(function () {
          window.clearTimeout(this._loadTask);
          if( this.readyState != 4 ) {
            this.status = 408;
            this.statusText = 'Request Timeout';
          }
          cleanup.call(this,scriptElem);
        }.bind(this), this.timeout * 1000);
      }.bind(this), 0);
   },

   setRequestHeader: function() {
   },

   getResponseHeader: function() {
     return null;
   },

   getAllResponseHeaders: function() {
     return null;
   }
  });
}())
