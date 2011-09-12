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
 * class Class
 *
 *  Manages Improved's class-based OOP system.
 *
 **/
var Class = (function() {

  // Some versions of JScript fail to enumerate over properties, names of which.
  // correspond to non-enumerable properties in the prototype chain
  var IS_DONTENUM_BUGGY = (function(){
    for (var p in { toString: 1 }) {
      // check actual property name, so that it works with augmented Object.prototype
      if (p === 'toString') return false;
    }
    return true;
  })();

  /**
   *  Class.create([classname][, superclass][, methods...]) -> Class
   *    - classname (String): A name for better class introspection
   *    - superclass (Class): The optional superclass to inherit methods from.
   *    - methods (Object): An object whose properties will be "mixed-in" to the
   *        new class. Any number of mixins can be added; later mixins take
   *        precedence.
   *
   *  [[Class.create]] creates a class and returns a constructor function for
   *  instances of the class. Calling the constructor function (typically as
   *  part of a `new` statement) will invoke the class's `initialize` method.
   *
   *  [[Class.create]] accepts two kinds of arguments. If the first argument is
   *  a [[Class]], it's used as the new class's superclass, and all its methods
   *  are inherited. Otherwise, any arguments passed are treated as objects,
   *  and their methods are copied over ("mixed in") as instance methods of the
   *  new class. In cases of method name overlap, later arguments take
   *  precedence over earlier arguments.
   *
   *  If a subclass overrides an instance method declared in a superclass, the
   *  subclass's method can still access the original method. To do so, declare
   *  the subclass's method as normal, but insert `$super` as the first
   *  argument. This makes `$super` available as a method for use within the
   *  function.
   *
   *  To extend a class after it has been defined, use [[Class#addMethods]].
   *
   *  If debug level is at call tracing, call tracing is activated for all
   *  methods added to the class. Note: Debug related stuff are stripped out of
   *  the compressed version.
   *
   *  For details, see the
   *  [inheritance tutorial](http://prototypejs.org/learn/class-inheritance)
   *  on the Prototype website.
  **/
  function subclass() {};
  function create() {
    var parent = null,
        properties = $A(arguments);
/*debug*/ var namesp = null, klassname = null;

    if (Object.isString(properties[0])) {
/*debug*/ klassname =
      properties.shift();
/*debug*/ var i = klassname.lastIndexOf('.');
/*debug*/ if( i > 0 ) {
/*debug*/   namesp = klassname.substring(0,i);
/*debug*/   klassname = klassname.substring(++i);
/*debug*/ }
    }

    if (Object.isFunction(properties[0]))
      parent = properties.shift();

/*debug*/ var klass;
/*debug*/ if( klassname ) {
/*debug*/   klass = eval('klass = function ' + klassname + '() { return arguments.callee.prototype.initialize.apply(this, arguments); }');
/*debug*/ } else {
/*debug*/   klass =
      function klass() { return arguments.callee.prototype.initialize.apply(this, arguments); }
/*debug*/ }

    Object.extend(klass, Class.Methods);
/*debug*/ if( namesp ) klass.namespace = namesp;
    klass.superclass = parent;
    klass.subclasses = [];

    if (parent) {
      subclass.prototype = parent.prototype;
      klass.prototype = new subclass;
      if( Object.isArray(parent.subclasses) ) {
        parent.subclasses.push(klass);
      }
    }

    for (var i = 0, length = properties.length; i < length; i++)
      klass.addMethods(properties[i]);

    if (!klass.prototype.initialize)
      klass.prototype.initialize = Improved.emptyFunction;

    klass.prototype.constructor = klass;

/*debug*/ if( debug.isCallTraceEnabled() ) {
/*debug*/   if( klassname ) {
/*debug*/     debug.callTrace('Define Class '+klassname+' as',klass);
/*debug*/   } else {
/*debug*/     debug.callTrace('Define anonymous Class as',klass);
/*debug*/   }
/*debug*/ }

    return klass;
  }

/*debug*/ function debugWrapper(method, property, args) {
/*debug*/   debug.callTrace('Call',Object.getTypeFQName(this)+'.'+property,args);
/*debug*/   try {
/*debug*/     var result = method.apply(this,args);
/*debug*/   } catch(e) {
/*debug*/     debug.callTrace('Throw',e.message,'from',Object.getTypeFQName(this)+'.'+property,args);
/*debug*/     throw(e);
/*debug*/   }
/*debug*/   debug.callTrace('Return',result,'from',Object.getTypeFQName(this)+'.'+property,args);
/*debug*/   return result;
/*debug*/ }

  /**
   *  Class#addMethods(methods) -> Class
   *    - methods (Object): The methods to add to the class.
   *
   *  Adds methods to an existing class.
   *
   *  [[Class#addMethods]] is a method available on classes that have been
   *  defined with [[Class.create]]. It can be used to add new instance methods
   *  to that class, or overwrite existing methods, after the class has been
   *  defined.
   *
   *  New methods propagate down the inheritance chain. If the class has
   *  subclasses, those subclasses will receive the new methods &mdash; even in
   *  the context of `$super` calls. The new methods also propagate to instances
   *  of the class and of all its subclasses, even those that have already been
   *  instantiated.
   *
   *  ##### Examples
   *
   *      var Animal = Class.create({
   *        initialize: function(name, sound) {
   *          this.name  = name;
   *          this.sound = sound;
   *        },
   *
   *        speak: function() {
   *          alert(this.name + " says: " + this.sound + "!");
   *        }
   *      });
   *
   *      // subclassing Animal
   *      var Snake = Class.create(Animal, {
   *        initialize: function($super, name) {
   *          $super(name, 'hissssssssss');
   *        }
   *      });
   *
   *      var ringneck = new Snake("Ringneck");
   *      ringneck.speak();
   *
   *      //-> alerts "Ringneck says: hissssssss!"
   *
   *      // adding Snake#speak (with a supercall)
   *      Snake.addMethods({
   *        speak: function($super) {
   *          $super();
   *          alert("You should probably run. He looks really mad.");
   *        }
   *      });
   *
   *      ringneck.speak();
   *      //-> alerts "Ringneck says: hissssssss!"
   *      //-> alerts "You should probably run. He looks really mad."
   *
   *      // redefining Animal#speak
   *      Animal.addMethods({
   *        speak: function() {
   *          alert(this.name + 'snarls: ' + this.sound + '!');
   *        }
   *      });
   *
   *      ringneck.speak();
   *      //-> alerts "Ringneck snarls: hissssssss!"
   *      //-> alerts "You should probably run. He looks really mad."
  **/
  function addMethods(source) {
    var ancestor   = this.superclass && this.superclass.prototype,
        properties = Object.keys(source);

    // IE6 doesn't enumerate `toString` and `valueOf` (among other built-in `Object.prototype`) properties,
    // Force copy if they're not Object.prototype ones.
    // Do not copy other Object.prototype.* for performance reasons
    if (IS_DONTENUM_BUGGY) {
      if (source.toString != Object.prototype.toString)
        properties.push("toString");
      if (source.valueOf != Object.prototype.valueOf)
        properties.push("valueOf");
    }

    for (var i = 0, length = properties.length; i < length; i++) {
      var property = properties[i], value, method = value = source[property];
      if( Object.isFunction(value) ) {
/*debug*/ value.methodName = property;
        if (ancestor && Object.isFunction(value) &&
            value.argumentNames()[0] == "$super") {
          if( property === 'initialize' && !Object.isArray(ancestor.constructor.subclasses) ) {
            value = (function() {
              return function() { return ancestor.constructor.apply(this, arguments); };
            })().wrap(method);
          } else {
            value = (function(m) {
              return function() { return ancestor[m].apply(this, arguments); };
            })(property).wrap(method);
          }
        }
/*debug*/ if( debug.isCallTraceEnabled() ) {
/*debug*/   value = (function(method,property) {
/*debug*/       return function() { return debugWrapper.call(this,method,property,arguments); };
/*debug*/     })(value,property);
/*debug*/ }
        if( method !== value ) {
/*debug*/ value.methodName = property;
          value.valueOf = method.valueOf.bind(method);
          value.toString = method.toString.bind(method);
        }
      }
      this.prototype[property] = value;
    }

    return this;
  }

  return {
    create: create,
    Methods: {
      addMethods: addMethods
    }
  };
})();
