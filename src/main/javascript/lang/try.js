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

var Try = {
  these: function() {
    var returnValue;

    for (var i = 0, length = arguments.length; i < length; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) { }
    }

    return returnValue;
  }
};

/*
@name Xccessors
@version 0.0.3
@desc Shim that implements __defineGetter__, __defineSetter__, __lookupGetter__, and __lookupSetter__ in browsers that have ECMAScript 3.1 accessor support but not the legacy methods
@license http://www.gnu.org/licenses/lgpl.html
@author Elijah Grey - eligrey.com

THIS IS NOT WORKING BECAUSE IT MAKES "FOR IN" CONSTRUCT TO ENUMERATE THESE FUNCTIONS

(function (methods, o, f) {
	function extendMethod(reqMethod, method, fun) {
		if (reqMethod in o && !(method in {})) o[f][method] = Element[f][method] = Window[f][method] = HTMLDocument[f][method] = fun;
	};
	extendMethod(methods[0], methods[2], function (prop, fun) {
		o[methods[0]](this, prop, { get: fun });
	});
	extendMethod(methods[0], methods[3], function (prop, fun) {
		o[methods[0]](this, prop, { set: fun });
	});
	extendMethod(methods[1], methods[4], function (prop) {
		return o[methods[1]](this, prop).get
		|| o[methods[1]](this.constructor.prototype, prop).get;
	});
	extendMethod(methods[1], methods[5], function (prop) {
		return o[methods[1]](this, prop).set
		|| o[methods[1]](this.constructor.prototype, prop).set;
	});
})(["defineProperty", "getOwnPropertyDescriptor","__defineGetter__","__defineSetter__","__lookupGetter__","__lookupSetter__"], Object, "prototype");
*/
