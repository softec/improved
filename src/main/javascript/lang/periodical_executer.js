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

/** section: Language
 * class PeriodicalExecuter
 *
 *  Oversees the calling of a particular function periodically.
 *
 *  [[PeriodicalExecuter]] shields you from multiple parallel executions of a
 *  `callback` function, should it take longer than the given interval to
 *  execute.
 *
 *  This is especially useful if you use one to interact with the user at
 *  given intervals (e.g. use a prompt or confirm call): this will avoid
 *  multiple message boxes all waiting to be actioned.
 *
 *  ##### Example
 *
 *      new PeriodicalExecuter(function(pe) {
 *        if (!confirm('Want me to annoy you again later?')) {
 *          pe.stop();
 *        }
 *      }, 5);
**/
var PeriodicalExecuter = Class.create({
  /**
   *  new PeriodicalExecuter(callback, frequency)
   *  - callback (Function): the function to be executed at each interval.
   *  - frequency (Number): the amount of time, in seconds, to wait in between
   *    callbacks.
   *
   *  Creates a [[PeriodicalExecuter]].
  **/
  initialize: function(callback, frequency) {
    this.callback = callback;
    this.frequency = frequency;
    this.currentlyExecuting = false;

    this.registerCallback();
  },

  registerCallback: function() {
    this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },

  execute: function() {
    this.callback(this);
  },

  /**
   *  PeriodicalExecuter#stop() -> undefined
   *
   *  Stops the periodical executer (there will be no further triggers).
   *  
   *  Once a [[PeriodicalExecuter]] is created, it constitues an infinite loop,
   *  triggering at the given interval until the page unloads. This method lets
   *  you stop it any time you want.
   *  
   *  ##### Example
   *
   *  This will only alert 1, 2 and 3, then the [[PeriodicalExecuter]] stops.
   *
   *      var count = 0;
   *      new PeriodicalExecuter(function(pe) {
   *        if (++count > 3) {
   *          pe.stop();
   *        } else {
   *          alert(count);
   *        }
   *      }, 1);
  **/
  stop: function() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  },

  onTimerEvent: function() {
    if (!this.currentlyExecuting) {
      // IE doesn't support `finally` statements unless all errors are caught.
      // We mimic the behaviour of `finally` statements by duplicating code
      // that would belong in it. First at the bottom of the `try` statement
      // (for errorless cases). Secondly, inside a `catch` statement which
      // rethrows any caught errors.
      try {
        this.currentlyExecuting = true;
        this.execute();
        this.currentlyExecuting = false;
      } catch(e) {
        this.currentlyExecuting = false;
        throw e;
      }
    }
  }
});
