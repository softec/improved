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
 * class Function
 *
 *  Extensions to the built-in `Function` object.
**/
Object.extend(Function.prototype, (function() {
  var slice = Array.prototype.slice,
      push = Array.prototype.push,
      unshift = Array.prototype.unshift;

  /**
   *  Function#functionName() -> String
   *
   *  Try to determine the function name and return it.
   *
   *  ##### Examples
   *
   *      function foobar() {
   *      }
   *      foobar.functionName();
   *      //-> 'foobar'
   *
   *      var cat = new Class.create("Animal", { eat: function(){} })
   *      cat.eat.functionName();
   *      //-> 'cat.eat'
   *
   *      Improved.emptyFunction.functionName();
   *      //-> undefined
  **/
  function functionName() {
    var funcname = this.name;
    return funcname || ((funcname == '') ? undefined
                                         : (this.name = this.toString().match(/^[\s\(]*function\s*([^( ]*)\s*\(/)[1])
        || undefined);
  }

  /**
   *  Function#argumentNames() -> Array
   *
   *  Reads the argument names as stated in the function definition and returns
   *  the values as an array of strings (or an empty array if the function is
   *  defined without parameters).
   *
   *  ##### Examples
   *
   *      function fn(foo, bar) {
   *        return foo + bar;
   *      }
   *      fn.argumentNames();
   *      //-> ['foo', 'bar']
   *
   *      Improved.emptyFunction.argumentNames();
   *      //-> []
  **/
  function argumentNames() {
    var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
      .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
      .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
  }

  function unshiftSlice(args, prefixArgs, rm) {
    var i, n = args.length = (i = args.length) + prefixArgs.length - rm >> 0;
    while (i--) args[--n] = args[i];
    i = n; n += rm;
    while (n) args[--i] = prefixArgs[--n];
    return args;
  }

  /** related to: Function#bindAsEventListener
   *  Function#bind(context[, args...]) -> Function
   *  - context (Object): The object to bind to.
   *  - args (?): Optional additional arguments to curry for the function.
   *
   *  Binds this function to the given `context` by wrapping it in another
   *  function and returning the wrapper. Whenever the resulting "bound"
   *  function is called, it will call the original ensuring that `this` is set
   *  to `context`. Also optionally curries arguments for the function.
   *
   *  ##### Examples
   *
   *  A typical use of [[Function#bind]] is to ensure that a callback (event
   *  handler, etc.) that is an object method gets called with the correct
   *  object as its context (`this` value):
   *
   *      var AlertOnClick = Class.create({
   *        initialize: function(msg) {
   *          this.msg = msg;
   *        },
   *        handleClick: function(event) {
   *          event.stop();
   *          alert(this.msg);
   *        }
   *      });
   *      var myalert = new AlertOnClick("Clicked!");
   *      $('foo').observe('click', myalert.handleClick); // <= WRONG
   *      // -> If 'foo' is clicked, the alert will be blank; "this" is wrong
   *      $('bar').observe('click', myalert.handleClick.bind(myalert)); // <= RIGHT
   *      // -> If 'bar' is clicked, the alert will be "Clicked!"
   *
   *  `bind` can also *curry* (burn in) arguments for the function if you
   *  provide them after the `context` argument:
   *
   *      var Averager = Class.create({
   *        initialize: function() {
   *          this.count = 0;
   *          this.total = 0;
   *        },
   *        add: function(addend) {
   *          ++this.count;
   *          this.total += addend;
   *        },
   *        getAverage: function() {
   *          return this.count == 0 ? NaN : this.total / this.count;
   *        }
   *      });
   *      var a = new Averager();
   *      var b = new Averager();
   *      var aAdd5 = a.add.bind(a, 5);   // Bind to a, curry 5
   *      var aAdd10 = a.add.bind(a, 10); // Bind to a, curry 10
   *      var bAdd20 = b.add.bind(b, 20); // Bind to b, curry 20
   *      aAdd5();
   *      aAdd10();
   *      bAdd20();
   *      bAdd20();
   *      alert(a.getAverage());
   *      // -> Alerts "7.5" (average of [5, 10])
   *      alert(b.getAverage());
   *      // -> Alerts "20" (average of [20, 20])
   *
   *  (To curry without binding, see [[Function#curry]].)
  **/
  function bindNoConv(context) {
    if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
    var __method = this, args = arguments;
    return function() {
      return __method.apply(context, unshiftSlice(arguments,args,1));
    }
  }

  function bindConv() {
    if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
    var __method = this, args = [];
    push.apply(args,arguments);
    return function() {
      var a = [];
      push.apply(a, args);
      push.apply(a, arguments);
      return __method.apply(a.shift(), a);
    }
  }

  /** related to: Function#bind
   *  Function#bindAsEventListener(context[, args...]) -> Function
   *  - context (Object): The object to bind to.
   *  - args (?): Optional arguments to curry after the event argument.
   *
   *  An event-specific variant of [[Function#bind]] which ensures the function
   *  will recieve the current event object as the first argument when
   *  executing.
   *
   *  It is not necessary to use `bindAsEventListener` for all bound event
   *  handlers; [[Function#bind]] works well for the vast majority of cases.
   *  `bindAsEventListener` is only needed when:
   *
   *  - Using old-style DOM0 handlers rather than handlers hooked up via
   *    [[Event.observe]], because `bindAsEventListener` gets the event object
   *    from the right place (even on MSIE). (If you're using `Event.observe`,
   *    that's already handled.)
   *  - You want to bind an event handler and curry additional arguments but
   *    have those arguments appear after, rather than before, the event object.
   *    This mostly happens if the number of arguments will vary, and so you
   *    want to know the event object is the first argument.
   *
   *  ##### Example
   *
   *      var ContentUpdater = Class.create({
   *        initialize: function(initialData) {
   *          this.data = Object.extend({}, initialData);
   *        },
   *        // On an event, update the content in the elements whose
   *        // IDs are passed as arguments from our data
   *        updateTheseHandler: function(event) {
   *          var argIndex, id, element;
   *          event.stop();
   *          for (argIndex = 1; argIndex < arguments.length; ++argIndex) {
   *            id = arguments[argIndex];
   *            element = $(id);
   *            if (element) {
   *              element.update(String(this.data[id]).escapeHTML());
   *            }
   *          }
   *        }
   *      });
   *      var cu = new ContentUpdater({
   *        dispName: 'Joe Bloggs',
   *        dispTitle: 'Manager <provisional>',
   *        dispAge: 47
   *      });
   *      // Using bindAsEventListener because of the variable arg lists:
   *      $('btnUpdateName').observe('click',
   *        cu.updateTheseHandler.bindAsEventListener(cu, 'dispName')
   *      );
   *      $('btnUpdateAll').observe('click',
   *        cu.updateTheseHandler.bindAsEventListener(cu, 'dispName', 'dispTitle', 'dispAge')
   *      );
  **/
  function bindAsEventListener() {
    var __method = this, args = arguments, context = args[0];
    return function(event) {
      args[0] = event || (!Improved.titanium && window.event);
      var result = __method.apply(context, args);
      args[0] = context;
      return result;
    }
  }

  /**
   *  Function#curry(args...) -> Function
   *  - args (?): The arguments to curry.
   *
   *  *Curries* (burns in) arguments to a function, returning a new function
   *  that when called with call the original passing in the curried arguments
   *  (along with any new ones):
   *
   *      function showArguments() {
   *        alert($A(arguments).join(', '));
   *      }
   *      showArguments(1, 2,, 3);
   *      // -> alerts "1, 2, 3"
   *
   *      var f = showArguments.curry(1, 2, 3);
   *      f('a', 'b');
   *      // -> alerts "1, 2, 3, a, b"
   *
   *  [[Function#curry]] works just like [[Function#bind]] without the initial
   *  context argument. Use `bind` if you need to curry arguments _and_ set
   *  context at the same time.
   *
   *  The name "curry" comes from [mathematics](http://en.wikipedia.org/wiki/Currying).
  **/
  function curryNoConv() {
    var __method = this, args = arguments;
    return function() {
      return __method.apply(this, unshiftSlice(arguments,args,0));
    }
  }

  function curryConv() {
    var __method = this, args = [];
    push.apply(args,arguments);
    return function() {
      var a = [];
      push.apply(a, args);
      push.apply(a, arguments);
      return __method.apply(this, a);
    }
  }

  /**
   *  Function#delay(timeout[, args...]) -> Number
   *  - timeout (Number): The time, in seconds, to wait before calling the
   *    function.
   *  - args (?): Optional arguments to pass to the function when calling it.
   *
   *  Schedules the function to run after the specified amount of time, passing
   *  any arguments given.
   *
   *  Behaves much like `window.setTimeout`, but the timeout is in seconds
   *  rather than milliseconds. Returns an integer ID that can be used to
   *  clear the timeout with `window.clearTimeout` before it runs.
   *
   *  To schedule a function to run as soon as the interpreter is idle, use
   *  [[Function#defer]].
   *
   *  ##### Example
   *
   *      function showMsg(msg) {
   *        alert(msg);
   *      }
   *      showMsg.delay(0.1, "Hi there!");
   *      // -> Waits a 10th of a second, then alerts "Hi there!"
  **/
  function delayNoConv(timeout) {
    var __method = this, args = arguments;
    return /*window.*/setTimeout(function() {
      return __method.apply(this, unshiftSlice(arguments,args,1));
    }, timeout*1000);
  }

  function delayConv() {
    var __method = this, args = [];
    push.apply(args,arguments);
    return /*window.*/setTimeout(function() {
      return __method.apply(this, args);
    }, args.shift()*1000);
  }

  /**
   *  Function#defer(args...) -> Number
   *  - args (?): Optional arguments to pass into the function.
   *
   *  Schedules the function to run as soon as the interpreter is idle.
   *
   *  A "deferred" function will not run immediately; rather, it will run as soon
   *  as the interpreter's call stack is empty.
   *
   *  Behaves much like `window.setTimeout` with a delay set to `0`. Returns an
   *  ID that can be used to clear the timeout with `window.clearTimeout` before
   *  it runs.
   *
   *  ##### Example
   *
   *      function showMsg(msg) {
   *        alert(msg);
   *      }
   *
   *      showMsg("One");
   *      showMsg.defer("Two");
   *      showMsg("Three");
   *      // Alerts "One", then "Three", then (after a brief pause) "Two"
   *      // Note that "Three" happens before "Two"
  **/
  function defer() {
    var __method = this, args = arguments;
    return /*window.*/setTimeout(function() {
      return __method.apply(this, args);
    }, 10);
  }

  /**
   *  Function#wrap(wrapper) -> Function
   *  - wrapper (Function): The function to use as a wrapper.
   *
   *  Returns a function "wrapped" around the original function.
   *
   *  [[Function#wrap]] distills the essence of aspect-oriented programming into
   *  a single method, letting you easily build on existing functions by
   *  specifying before and after behavior, transforming the return value, or
   *  even preventing the original function from being called.
   *
   *  The wraper function is called with this signature:
   *
   *      function wrapper(callOriginal[, args...])
   *
   *  ...where `callOriginal` is a function that can be used to call the
   *  original (wrapped) function (or not, as appropriate). (`callOriginal` is
   *  not a direct reference to the original function, there's a layer of
   *  indirection in-between that sets up the proper context \[`this` value\] for
   *  it.)
   *
   *  ##### Example
   *
   *      // Wrap String#capitalize so it accepts an additional argument
   *      String.prototype.capitalize = String.prototype.capitalize.wrap(
   *        function(callOriginal, eachWord) {
   *          if (eachWord && this.include(" ")) {
   *            // capitalize each word in the string
   *            return this.split(" ").invoke("capitalize").join(" ");
   *          } else {
   *            // proceed using the original function
   *            return callOriginal();
   *          }
   *        });
   *
   *      "hello world".capitalize();
   *      // -> "Hello world" (only the 'H' is capitalized)
   *      "hello world".capitalize(true);
   *      // -> "Hello World" (both 'H' and 'W' are capitalized)
  **/
  function wrapNoConv(wrapper) {
    var __method = this;
    return function() {
      return wrapper.apply(this, unshiftSlice(arguments,[__method.bind(this)],0));
    }
  }

  function wrapConv(wrapper) {
    var __method = this;
    return function() {
      var a = [__method.bind(this)];
      push.apply(a,arguments);
      return wrapper.apply(this, a);
    }
  }

  /**
   *  Function#methodize() -> Function
   *
   *  Wraps the function inside another function that, when called, pushes
   *  `this` to the original function as the first argument (with any further
   *  arguments following it).
   *
   *  The `methodize` method transforms the original function that has an
   *  explicit first argument to a function that passes `this` (the current
   *  context) as an implicit first argument at call time. It is useful when we
   *  want to transform a function that takes an object to a method of that
   *  object or its prototype, shortening its signature by one argument.
   *
   *  ##### Example
   *
   *      // A function that sets a name on a target object
   *      function setName(target, name) {
   *        target.name = name;
   *      }
   *
   *      // Use it
   *      obj = {};
   *      setName(obj, 'Fred');
   *      obj.name;
   *      // -> "Fred"
   *
   *      // Make it a method of the object
   *      obj.setName = setName.methodize();
   *
   *      // Use the method instead
   *      obj.setName('Barney');
   *      obj.name;
   *      // -> "Barney"
   *
   *  The example above is quite simplistic. It's more useful to copy methodized
   *  functions to object prototypes so that new methods are immediately shared
   *  among instances. In the Improved library, `methodize` is used in various
   *  places such as the DOM module, so that (for instance) you can hide an
   *  element either by calling the static version of `Element.hide` and passing in
   *  an element reference or ID, like so:
   *
   *      Element.hide('myElement');
   *
   *  ...or if you already have an element reference, just calling the
   *  methodized form instead:
   *
   *      myElement.hide();
  **/
  function methodizeNoConv() {
    if (this._methodized) return this._methodized;
    var __method = this;
    return this._methodized = function() {
      return __method.apply(null, unshiftSlice(arguments,[this],0));
    }
  }

  function methodizeConv() {
    if (this._methodized) return this._methodized;
    var __method = this;
    return this._methodized = function() {
      var a = [this];
      push.apply(a,arguments);
      return __method.apply(null, a);
    }
  }

  function EmptyConstructor() {}

  /**
   *  Function#newInstance(args) -> Object
   *  - args (Array): An argument array.
   *
   *  Returns an Object instance based on this function as a constructor
   *
   *  [[Function#newInstance]] create a new object and call this function
   *  for construction. The Object is very similar to an object created
   *  with new. This allow creating object from an argument array.
  **/
  function newInstance(args) {
    EmptyConstructor.prototype = this.prototype;
    var object = new EmptyConstructor;
    this.apply(object,args);
    return object;
  }

  var ieOperaAndroid = !Improved.titanium && (Improved.Browser.Opera || (Improved.Browser.IE && !Improved.Browser.IE9) || (Improved.Device.Android && Improved.Browser.WebKit));

  return {
    functionName:        functionName,
    argumentNames:       argumentNames,
    bind:                ((ieOperaAndroid) ? bindNoConv      : bindConv),
    bindAsEventListener: bindAsEventListener,
    curry:               ((ieOperaAndroid) ? curryNoConv     : curryConv),
    delay:               ((ieOperaAndroid) ? delayNoConv     : delayConv),
    defer:               defer,
    wrap:                ((ieOperaAndroid) ? wrapNoConv      : wrapConv),
    methodize:           ((ieOperaAndroid) ? methodizeNoConv : methodizeConv),
    newInstance:         newInstance
  };
})());
