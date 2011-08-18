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

describe('Object', function()
{
  beforeEach(function() {
    this.addMatchers({
      toBeNaN: function() { return isNaN(this.actual); }
    });
  });

  it('can inspect Object, and it return "Object" for itself', function() {
     expect(Object.inspect()).toEqual('Object');
     expect(Object.inspect(undefined)).toEqual('undefined');
     expect(Object.inspect(null)).toEqual('null');
     expect(Object.inspect('foo\\b\'ar')).toEqual("'foo\\\\b\\\'ar'");
     expect(Object.inspect([])).toEqual('[]');
     if( !Improved.titanium ) {
       expect(function() { Object.inspect(window.Node) }).not.toThrow();
     }
  });

  it('can convert an Object to JSON', function() {
    expect(Object.toJSON(undefined)).not.toBeDefined();
    expect(Object.toJSON(Prototype.K)).not.toBeDefined();
    expect(Object.toJSON('')).toEqual('\"\"');
    expect(Object.toJSON('test')).toEqual('\"test\"');
    expect(Object.toJSON(Number.NaN)).toEqual('null');
    expect(Object.toJSON(0)).toEqual('0');
    expect(Object.toJSON(-293)).toEqual('-293');
    expect(Object.toJSON([])).toEqual('[]');
    expect(Object.toJSON(['a'])).toEqual('[\"a\"]');
    expect(Object.toJSON(['a', 1])).toEqual('[\"a\",1]');
    expect(Object.toJSON(['a', {'b': null}])).toEqual('[\"a\",{\"b\":null}]');
    expect(Object.toJSON({a: 'hello!'})).toEqual('{\"a\":\"hello!\"}');
    expect(Object.toJSON({})).toEqual('{}');
    expect(Object.toJSON({a: undefined, b: undefined, c: Prototype.K})).toEqual('{}');
    expect(Object.toJSON({'b': [undefined, false, true, undefined], c: {a: 'hello!'}}))
            .toEqual('{\"b\":[null,false,true,null],\"c\":{\"a\":\"hello!\"}}');
    expect(Object.toJSON($H({'b': [undefined, false, true, undefined], c: {a: 'hello!'}})))
            .toEqual('{\"b\":[null,false,true,null],\"c\":{\"a\":\"hello!\"}}');
    expect(Object.toJSON(true)).toEqual('true');
    expect(Object.toJSON(false)).toEqual('false');
    expect(Object.toJSON(null)).toEqual('null');

    var Person = function(name){
        this.name = name;
    };

    Person.prototype.toJSON = function() {
      return '-' + this.name;
    };

    var sam = new Person('sam');
    expect(Object.toJSON(sam)).toEqual('"-sam"');
  });

  it('can return the type name of an object', function() {
    expect(Object.getTypeName('')).toEqual('String');
    expect(Object.getTypeName(1)).toEqual('Number');
    expect(Object.getTypeName(function(){})).toEqual('Function');
    expect(Object.getTypeName(new (Class.create()))).toEqual((new Class.create()).functionName());
  });

  it('can be explicitly converted to float', function()
  {
    expect(Object.toFloat(123456)).toEqual(123456);
    expect(Object.toFloat(1234.5678)).toEqual(1234.5678);
    expect(Object.toFloat('123456')).toEqual(123456);
    expect(Object.toFloat('1234.5678')).toEqual(1234.5678);
    expect(Object.toFloat('')).toBeNaN();
    expect(Object.toFloat('  123456  ')).toEqual(123456);
    expect(Object.toFloat('  1234.5678  ')).toEqual(1234.5678);
    expect(Object.toFloat(123456789012345)).toEqual(123456789012350);
    expect(Object.toFloat(1.23456789012345)).toEqual(1.2345678901235);
    expect(Object.toFloat('123456789012345')).toEqual(123456789012350);
    expect(Object.toFloat('1.23456789012345')).toEqual(1.2345678901235);
  });

  it('can be explicitly converted to int', function()
  {
    expect(Object.toInteger(123456)).toEqual(123456);
    expect(Object.toInteger(1234.5678)).toEqual(1235);
    expect(Object.toInteger('123456')).toEqual(123456);
    expect(Object.toInteger('1234.5678')).toEqual(1235);
    expect(Object.toInteger('')).toBeNaN();
    expect(Object.toInteger('  123456  ')).toEqual(123456);
    expect(Object.toInteger('  1234.5678  ')).toEqual(1235);
    expect(Object.toInteger(123456789012345)).toEqual(123456789012345);
    expect(Object.toInteger(1.234567890123456)).toEqual(1);
    expect(Object.toInteger('123456789012345')).toEqual(123456789012345);
    expect(Object.toInteger('1.234567890123456')).toEqual(1);
  });

  it('can be explicitly converted to boolean', function()
  {
    expect(Object.toBoolean(true)).toBe(true);
    expect(Object.toBoolean(false)).toBe(false);
    expect(Object.toBoolean(1)).toBe(true);
    expect(Object.toBoolean(0)).toBe(false);
    expect(Object.toBoolean('string')).toBe(true);
    expect(Object.toBoolean('')).toBe(false);
    expect(Object.toBoolean({})).toBe(true);
    expect(Object.toBoolean([0,1])).toBe(true);
    expect(Object.toBoolean(undefined)).toBe(false);
    expect(Object.toBoolean(null)).toBe(false);
  });

  it('can be explicitly converted to !boolean', function()
  {
    expect(Object.toNotBoolean(true)).toBe(false);
    expect(Object.toNotBoolean(false)).toBe(true);
    expect(Object.toNotBoolean(1)).toBe(false);
    expect(Object.toNotBoolean(0)).toBe(true);
    expect(Object.toNotBoolean('string')).toBe(false);
    expect(Object.toNotBoolean('')).toBe(true);
    expect(Object.toNotBoolean({})).toBe(false);
    expect(Object.toNotBoolean([0,1])).toBe(false);
    expect(Object.toNotBoolean(undefined)).toBe(true);
    expect(Object.toNotBoolean(null)).toBe(true);
  });

  it('can check if an object is a class created with Class.create', function() {
    expect(Object.isClass(Class.create())).toBeTruthy();
    expect(Object.isClass(new (Class.create()))).toBeFalsy();
    expect(Object.isClass(Object)).toBeFalsy();
    expect(Object.isClass({})).toBeFalsy();
  });

});
