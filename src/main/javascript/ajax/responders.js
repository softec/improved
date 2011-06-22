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

/** section: Ajax
 * Ajax.Responders
 *  includes Enumerable
 *
 *  A repository of global listeners notified about every step of
 *  Improved-based Ajax requests.
 *
 *  Sometimes, you need to provide generic behaviors over all Ajax operations
 *  happening on the page (through [[Ajax.Request]], [[Ajax.Updater]] or
 *  [[Ajax.PeriodicalUpdater]]).
 *
 *  For instance, you might want to automatically show an indicator when an
 *  Ajax request is ongoing, and hide it when none are. You may well want to
 *  factor out exception handling as well, logging those somewhere on the page
 *  in a custom fashion. The possibilities are myriad.
 *
 *  To achieve this, Improved provides `Ajax.Responders`, which lets you
 *  register (and, if you wish, unregister later) _responders_, which are
 *  objects with specially-named methods. These names come from a set of
 *  general callbacks corresponding to different points in time (or outcomes)
 *  of an Ajax request's life cycle.
 *
 *  For instance, Improved automatically registers a responder that maintains
 *  a nifty variable: [[Ajax.activeRequestCount]]. This represents, at a given
 *  time, the number of currently active Ajax requests &mdash; by monitoring their
 *  `onCreate` and `onComplete` events. The code for this is fairly simple:
 *
 *      Ajax.Responders.register({
 *        onCreate: function() {
 *          Ajax.activeRequestCount++;
 *        },
 *        onComplete: function() {
 *          Ajax.activeRequestCount--;
 *        }
 *      });
 *
 *  ##### Responder callbacks
 *
 *  The callbacks for responders are similar to the callbacks described in
 *  the [[Ajax section]], but take a different signature. They're invoked with
 *  three parameters: the requester object (i.e., the corresponding "instance"
 *  of [[Ajax.Request]]), the `XMLHttpRequest` object, and the result of
 *  evaluating the `X-JSON` response header, if any (can be `null`). They also
 *  execute in the context of the responder, bound to the `this` reference.
 *
 *  * `onCreate`: Triggered whenever a requester object from the `Ajax`
 *    namespace is created, after its parameters are adjusted and before its
 *    XHR connection is opened. This takes *two* arguments: the requester
 *    object and the underlying XHR object.
 *  * `onUninitialized` (*Not guaranteed*):  Invoked just after the XHR object
 *    is created.
 *  * `onLoading` (*Not guaranteed*): Triggered when the underlying XHR object
 *    is being setup, and its connection opened.
 *  * `onLoaded` (*Not guaranteed*): Triggered once the underlying XHR object
 *    is setup, the connection is open, and it is ready to send its actual
 *    request.
 *  * `onInteractive` (*Not guaranteed*): Triggered whenever the requester
 *    receives a part of the response (but not the final part), should it
 *    be sent in several packets.
 *  * `onException`: Triggered whenever an XHR error arises. Has a custom
 *    signature: the first argument is the requester (i.e. an [[Ajax.Request]]
 *    instance), and the second is the exception object.
 *  * `onComplete`: Triggered at the _very end_ of a request's life-cycle, after
 *    the request completes, status-specific callbacks are called, and possible
 *    automatic behaviors are processed. Guaranteed to run regardless of what
 *    happened during the request.
**/

Ajax.Responders = {
  responders: [],

  _each: function(iterator) {
    this.responders._each(iterator);
  },

  /**
   *  Ajax.Responders.register(responder) -> undefined
   *  - responder (Object): A list of functions with keys corresponding to the
   *    names of possible callbacks.
   *
   *  Add a group of responders to all Ajax requests.
  **/
  register: function(responder) {
    if (!this.include(responder))
      this.responders.push(responder);
  },

  /**
   *  Ajax.Responders.unregister(responder) -> undefined
   *  - responder (Object): A list of functions with keys corresponding to the
   *    names of possible callbacks.
   *
   *  Remove a previously-added group of responders.
   *
   *  As always, unregistering something requires you to use the very same
   *  object you used at registration. If you plan to use `unregister`, be sure
   *  to assign your responder to a _variable_ before passing it into
   *  [[Ajax.Responders#register]] &mdash; don't pass it an object literal.
  **/
  unregister: function(responder) {
    this.responders = this.responders.without(responder);
  },

  dispatch: function(callback, request, transport, json) {
    this.each(function(responder) {
      if (Object.isFunction(responder[callback])) {
        try {
          responder[callback].apply(responder, [request, transport, json]);
        } catch (e) { }
      }
    });
  }
};

Object.extend(Ajax.Responders, Enumerable);

Ajax.Responders.register({
  onCreate:   function() { Ajax.activeRequestCount++ },
  onComplete: function() { Ajax.activeRequestCount-- }
});
