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

describe('Improved - Error', function()
{
  var stringType = 'String',
      objectType = 'Object',
      klassType = (new Class.create()).functionName(),
      objectString = String({}),
      isStringName = Object.isString.functionName(),
      isArrayName = Object.isArray.functionName(),
      isCallerSupported = Object.isFunction(arguments.callee.caller);

  beforeEach(function() { debug.setLevel(6); });
  afterEach(function() { debug.setLevel(5); });

  it('can throw Error with context', function()
  {
    expect(function(){throw Improved.Error('Test Error', 'Here', 'Me')}).toThrow(new Error('Here: Test Error (in: Me)'));
    expect(function(){throw Improved.Error('Test Error', 'Here')}).toThrow(new Error('Here: Test Error'));
    expect(function(){throw Improved.Error('Test Error')}).toThrow(new Error('Test Error'));

    if( klassType === 'klass' ) {
      var Foo = Class.create({
        testError: function() {
          throw Improved.Error('Test Error', this, this.anotherMethod);
        },
        anotherMethod: function() {}
      });
      var Bar = Class.create('Bar',{
        testError: function() {
          throw Improved.Error('Test Error', this);
        }
      });
      var FooBar = Class.create({
        testError: function() {
          throw Improved.Error('Test Error', this);
        }
      });
      Object.extend(FooBar, {
        inspect: function() {
          return 'FooBar';
        }
      });
      expect(function(){(new Foo).testError()}).toThrow(new Error(klassType + ': Test Error (in: anotherMethod)'));
      if( isCallerSupported ) {
        expect(function(){(new Bar).testError()}).toThrow(new Error('Bar: Test Error (in: testError)'));
        expect(function(){(new FooBar).testError()}).toThrow(new Error('FooBar: Test Error (in: testError)'));
      }
    }
  });

  it('can throw TypeError with context', function()
  {
    expect(function(){throw Improved.TypeError('TestType', 'TestObject', 'TestClass', 'Me')})
        .toThrow(new Error("TestClass: Unexpected type " + stringType + " in Me for value 'TestObject' (expecting: 'TestType')"));
    expect(function(){throw Improved.TypeError('TestType', 'TestObject', 'TestClass')})
        .toThrow(new Error("TestClass: Unexpected type " + stringType + " for value 'TestObject' (expecting: 'TestType')"));
    expect(function(){throw Improved.TypeError('TestType', 'TestObject')})
        .toThrow(new Error("Unexpected type " + stringType + " for value 'TestObject' (expecting: 'TestType')"));

    if( klassType === 'klass' ) {
      var myType = Class.create('myType');
      var Foo = Class.create({
        testError: function() {
          throw Improved.TypeError(myType, {}, this);
        }
      });
      var Bar = Class.create('Bar',{
        testError: function() {
          throw Improved.TypeError(myType, {}, this);
        }
      });

      expect(function(){throw Improved.TypeError(myType, {})})
          .toThrow(new Error("Unexpected type " + objectType + " for value " + objectString + " (expecting: myType)"));
      if( isCallerSupported ) {
        expect(function(){(new Foo).testError()})
            .toThrow(new Error(klassType + ": Unexpected type " + objectType + " in testError for value " + objectString + " (expecting: myType)"));
        expect(function(){(new Bar).testError()})
            .toThrow(new Error("Bar: Unexpected type " + objectType + " in testError for value " + objectString + " (expecting: myType)"));
      }
    }
  });

  it('can check for object type error', function()
  {
    expect(function(){Improved.checkType(Object.isString, 'TestObject', 'TestClass', 'Me')})
        .not.toThrow();
    expect(function(){Improved.checkType(Object.isString, {}, 'TestClass', 'Me')})
        .toThrow(new Error("TestClass: Unexpected type " + objectType + " in Me for value " + objectString + " (expecting: " + isStringName + ")"));
    expect(function(){Improved.checkType(Object.isString, {}, 'TestClass')})
        .toThrow(new Error("TestClass: Unexpected type " + objectType + " for value " + objectString + " (expecting: " + isStringName + ")"));
    expect(function(){Improved.checkType(Object.isString, {})})
        .toThrow(new Error("Unexpected type " + objectType + " for value " + objectString + " (expecting: " + isStringName + ")"));
    expect(function(){Improved.checkOptionalType(Object.isString, {})})
        .toThrow(new Error("Unexpected type " + objectType + " for value " + objectString + " (expecting: " + isStringName + ")"));
    expect(function(){Improved.checkOptionalType(Object.isString, null)})
        .not.toThrow();
    expect(function(){Improved.checkOptionalType(Object.isString, undefined)})
        .not.toThrow();

    var myType = Class.create('myType');
    var Foo = Class.create({
      testError: function() {
        Improved.checkType(myType, {}, this);
      }
    });
    var Bar = Class.create('Bar',{
      testError: function() {
        Improved.checkType(myType, {}, this);
      }
    });

    if( klassType === 'klass' ) {
      expect(function(){Improved.checkType(myType, {})})
          .toThrow(new Error("Unexpected type " + objectType + " for value " + objectString + " (expecting: myType)"));
      if( isCallerSupported ) {
        expect(function(){(new Foo).testError()})
            .toThrow(new Error(klassType + ": Unexpected type " + objectType + " in testError for value " + objectString + " (expecting: myType)"));
        expect(function(){(new Bar).testError()})
            .toThrow(new Error("Bar: Unexpected type " + objectType + " in testError for value " + objectString + " (expecting: myType)"));
      }
      expect(function(){
        Improved.checkType(Improved.nTypes(myType, Object.isString), {})})
          .toThrow(new Error("Unexpected type " + objectType + " for value " + objectString + " (expecting: myType | " + isStringName + ")"));
    }
    expect(function(){Improved.checkType(Improved.nTypes(myType, Object.isString), 'TestObject')})
        .not.toThrow();
    expect(function(){Improved.checkType(Improved.nTypes(myType, Object.isString), new myType())})
        .not.toThrow();
  });

  it('can check for array type error', function()
  {
    expect(function(){Improved.checkArrayType(Object.isString, ['TestObject'], 'TestClass', 'Me')})
        .not.toThrow();
    expect(function(){Improved.checkArrayType(Object.isString, 'TestObject', 'TestClass', 'Me')})
        .toThrow(new Error("TestClass: Unexpected type " + stringType + " in Me for value 'TestObject' (expecting: " + isArrayName + ")"));
    expect(function(){Improved.checkArrayType(Object.isString, [{}], 'TestClass', 'Me')})
        .toThrow(new Error("TestClass: Unexpected type " + objectType + " in Me for value " + objectString + " (expecting: " + isStringName + ")"));
    expect(function(){Improved.checkArrayType(Object.isString, [{}], 'TestClass')})
        .toThrow(new Error("TestClass: Unexpected type " + objectType + " for value " + objectString + " (expecting: " + isStringName + ")"));
    expect(function(){Improved.checkArrayType(Object.isString, [{}])})
        .toThrow(new Error("Unexpected type " + objectType + " for value " + objectString + " (expecting: " + isStringName + ")"));
    expect(function(){Improved.checkArrayType(Object.isString, ['TestObject',{}])})
        .toThrow(new Error("Unexpected type " + objectType + " for value " + objectString + " (expecting: " + isStringName + ")"));
    expect(function(){Improved.checkOptionalArrayType(Object.isString, ['TestObject',{}])})
        .toThrow(new Error("Unexpected type " + objectType + " for value " + objectString + " (expecting: " + isStringName + ")"));
    expect(function(){Improved.checkOptionalArrayType(Object.isString, null)})
        .not.toThrow();
    expect(function(){Improved.checkOptionalArrayType(Object.isString, undefined)})
        .not.toThrow();

    var myType = Class.create('myType');
    var Foo = Class.create({
      testError: function() {
        Improved.checkArrayType(myType, [{}], this);
      }
    });
    var Bar = Class.create('Bar', {
      testError: function() {
        Improved.checkArrayType(myType, [{}], this);
      }
    });

    if( klassType === 'klass' ) {
      expect(function(){Improved.checkArrayType(myType, [{}])})
          .toThrow(new Error("Unexpected type " + objectType + " for value " + objectString + " (expecting: myType)"));
      if( isCallerSupported ) {
        expect(function(){(new Foo).testError()})
            .toThrow(new Error(klassType + ": Unexpected type " + objectType + " in testError for value " + objectString + " (expecting: myType)"));
        expect(function(){(new Bar).testError()})
            .toThrow(new Error("Bar: Unexpected type " + objectType + " in testError for value " + objectString + " (expecting: myType)"));
      }
      expect(function(){Improved.checkArrayType(Improved.nTypes(myType, Object.isString), [{}])})
          .toThrow(new Error("Unexpected type " + objectType + " for value " + objectString + " (expecting: myType | " + isStringName + ")"));
    }
    expect(function(){Improved.checkArrayType(Improved.nTypes(myType, Object.isString), ['TestObject'])})
        .not.toThrow();
    expect(function(){Improved.checkArrayType(Improved.nTypes(myType, Object.isString), [new myType()])})
        .not.toThrow();
    expect(function(){Improved.checkArrayType(Improved.nTypes(myType, Object.isString), ['TestObject', new myType()])})
        .not.toThrow();
  });

  it('can check for array type without typing its content', function()
  {
    expect(function(){Improved.checkType(Object.isArray, [])})
        .not.toThrow();
  });
});
