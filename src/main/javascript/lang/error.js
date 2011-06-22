/*
 * Copyright 2010 SOFTEC sa. All rights reserved.
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

var Improved = (function (Improved) {

  function getWhere(where) {
    if ( where && !Object.isString(where) ) {
      where = Object.getTypeFQName(where);
    }
    return (where) ? where + ': ' : '';
  }

  function getSource(source, caller) {
    if( Object.isFunction(source) ) {
      caller = source;
      source = undefined;
    }
    return source || (caller && (caller.methodName || caller.functionName()));
  }

  function getExpected(expected) {
    return ((expected.inspect && expected.inspect())
            || expected.methodName || expected.functionName()
            || String(expected));
  }

  function checkType(expected, object) {
    return ((expected.prototype && object instanceof expected)
         || (!Object.isClass(expected) && expected(object)));
  }

  Improved.Error = function(message, where, source) {
    where = getWhere(where);

    source = getSource(source, arguments.callee.caller);
    source = (source) ? ' (in: ' + source + ')' : '';

    return new Error(where + message + source);
  };

  Improved.TypeError = function(expected, object, where, source) {
    where = getWhere(where);

    source = getSource(source, arguments.callee.caller);
    source = (source) ? ' in ' + source : '';

    expected = getExpected(expected);

    var result = new Error(where + 'Unexpected type '
         + Object.getTypeFQName(object)
         + source + ' for value '
         + Object.inspect(object) + ' (expecting: '
         + expected + ')');
    result.name = 'TypeError';
    return result;
  };

  Improved.checkOptionalType = function(expected, object, where, source) {
    if( object ) {
      Improved.checkType(expected, object, where, getSource(source, arguments.callee.caller))
    }
  };

  Improved.checkType = function(expected, object, where, source) {
      if( !Object.isFunction(expected) ) {
        throw Improved.TypeError(Object.isFunction,expected,this);
      }
      if( !checkType(expected,object) ) {
        throw Improved.TypeError(expected, object, where, getSource(source, arguments.callee.caller));
      }
  };

  Improved.checkOptionalArrayType = function(expected, array, where, source) {
    if( array ) {
      Improved.checkArrayType(expected, array, where, getSource(source, arguments.callee.caller))
    }
  };

  Improved.checkArrayType = function(expected, array, where, source) {
      if( !Object.isFunction(expected) ) {
        throw Improved.TypeError(Object.isFunction,expected,this);
      }
      source = getSource(source, arguments.callee.caller);
      if( !Object.isArray(array) ) {
        throw Improved.TypeError(Object.isArray,array,where,source);
      }
      array.each(function(object) {
        if( !checkType(expected,object) ) {
          throw Improved.TypeError(expected, object, where, source);
        }
      });
  };

  Improved.nTypes = function() {
    var types = $A(arguments),
        expected = function(object) {
          return !!types.find(function(expected) {
            return checkType(expected,object);
           });
        };
    expected.inspect = function() {
      return types.collect(getExpected).join(' | ');
    }
    return expected;
  };
  
  Improved.NotImplementedError = function(where, source) {
    return Improved.Error("Not Implemented!", where, source);
  };

  Improved.NotSupportedError = function(where, source) {
    return Improved.Error("Not supported!", where, source);
  };

  return Improved;
}(Improved || {}));
