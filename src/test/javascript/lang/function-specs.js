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

describe('Function', function()
{
  it('can return its name', function()
  {
    expect((function test(){}).functionName()).toEqual('test');
    expect((function(){}).functionName()).not.toBeDefined();
    expect(Math.random.functionName()).toEqual('random');
    expect(Math.random.name).toEqual('random');
  });

  it('can return its arguments names', function()
  {
    expect((function() {}).argumentNames()).toEqual([]);
    expect((function(one) {}).argumentNames()).toEqual(['one']);
    expect((function(one, two, three) {}).argumentNames()).toEqual(['one','two','three']);
    expect((function(  one  , two
       , three   ) {}).argumentNames()).toEqual(['one','two','three']);
    expect((function($super) {}).argumentNames()).toEqual(['$super']);

    function named1() {};
    expect(named1.argumentNames()).toEqual([]);
    function named2(one) {};
    expect(named2.argumentNames()).toEqual(['one']);
    function named3(one, two, three) {};
    expect(named3.argumentNames()).toEqual(['one','two','three']);
    function named4(one,
      two,

      three) {}
    expect(named4.argumentNames()).toEqual(['one','two','three']);
    function named5(/*foo*/ foo, /* bar */ bar, /*****/ baz) {}
    expect(named5.argumentNames()).toEqual(['foo','bar','baz']);
    function named6(
      /*foo*/ foo,
      /**/bar,
      /* baz */ /* baz */ baz,
      // Skip a line just to screw with the regex...
      /* thud */ thud) {}
    expect(named6.argumentNames()).toEqual(['foo','bar','baz','thud']);
  });

  it('can be bind to a context object', function()
  {
    var func = Improved.emptyFunction,
        spy = jasmine.createSpy('Sample func'),
        obj;

    expect(func.bind()).toBe(func);
    expect(func.bind(undefined)).toBe(func);
    expect(func.bind(null)).not.toBe(func);

    (spy.bind(obj = {}))();
    expect(spy).toHaveBeenCalled();
    expect(spy.mostRecentCall.object).toBe(obj);
    (spy.bind(obj = {}))('arg1','arg2');
    expect(spy).toHaveBeenCalledWith('arg1','arg2');
    expect(spy.mostRecentCall.object).toBe(obj);
    (spy.bind(obj = {},'arg1','arg2'))();
    expect(spy).toHaveBeenCalledWith('arg1','arg2');
    expect(spy.mostRecentCall.object).toBe(obj);
    (spy.bind(obj = {},'arg1','arg2'))('arg3','arg4');
    expect(spy).toHaveBeenCalledWith('arg1','arg2','arg3','arg4');
    expect(spy.mostRecentCall.object).toBe(obj);
    (spy.bind(obj = {}))(1);
    expect(spy).toHaveBeenCalledWith(1);
    expect(spy.mostRecentCall.object).toBe(obj);
  });

  it('can be called with some prepared arguments', function()
  {
    var obj = { func: jasmine.createSpy('Sample method') };
    obj.curryFunc = obj.func.curry('arg1','arg2'),
    obj.curryFunc2 = obj.func.curry(1);

    obj.curryFunc();
    expect(obj.func).toHaveBeenCalledWith('arg1','arg2');
    expect(obj.func.mostRecentCall.object).toBe(obj);
    obj.curryFunc('arg3','arg4');
    expect(obj.func).toHaveBeenCalledWith('arg1','arg2','arg3','arg4');
    expect(obj.func.mostRecentCall.object).toBe(obj);
    obj.curryFunc2();
    expect(obj.func).toHaveBeenCalledWith(1);
    expect(obj.func.mostRecentCall.object).toBe(obj);
    obj.curryFunc2(2);
    expect(obj.func).toHaveBeenCalledWith(1,2);
    expect(obj.func.mostRecentCall.object).toBe(obj);
  });

  it('can be called after a delay', function()
  {
    var delayedFunction = jasmine.createSpy().andCallFake(function() { window.delayed = true; });

    runs(function () {
      window.delayed = undefined;
      delayedFunction.delay(0.8);
      expect(window.delayed).not.toBeDefined()
    });

    waitsFor(function() { return !!window.delayed; });

    runs(function () {
      expect(delayedFunction).toHaveBeenCalled();
      delayedFunction.reset();
      window.delayed = undefined;
      delayedFunction.delay(0.8,'args1','args2');
      expect(window.delayed).not.toBeDefined()
    });

    waitsFor(function() { return !!window.delayed; });

    runs(function () {
      expect(delayedFunction).toHaveBeenCalledWith('args1','args2');
      delayedFunction.reset();
      window.delayed = undefined;
      delayedFunction.delay(0.8,1);
      expect(window.delayed).not.toBeDefined()
    });

    waitsFor(function() { return !!window.delayed; });

    runs(function () {
      expect(delayedFunction).toHaveBeenCalledWith(1);
      window.delayed = undefined;
    });  });

  it('can be called after a short delay (defer)', function()
  {
    var deferedFunction = jasmine.createSpy().andCallFake(function() { window.defered = true; });

    runs(function () {
      window.delayed = undefined;
      deferedFunction.defer();
      expect(window.defered).not.toBeDefined()
    });

    waitsFor(function() { return !!window.defered; });

    runs(function () {
      expect(deferedFunction).toHaveBeenCalled();
      deferedFunction.reset();
      window.defered = undefined;
      deferedFunction.defer('args1','args2');
      expect(window.defered).not.toBeDefined()
    });

    waitsFor(function() { return !!window.defered; });

    runs(function () {
      expect(deferedFunction).toHaveBeenCalledWith('args1','args2');
      window.defered = undefined;
      deferedFunction.defer(1);
      expect(window.defered).not.toBeDefined()
    });

    waitsFor(function() { return !!window.defered; });

    runs(function () {
      expect(deferedFunction).toHaveBeenCalledWith(1);
      window.defered = undefined;
    });
  });

  it('can be wrapped', function()
  {
    var wrapper = jasmine.createSpy('Sample wrapper').andCallFake(function(func,arg1,arg3){func('arg2',arg3);}),
        obj = { func: jasmine.createSpy('Sample method') };
    obj.wrapFunc = obj.func.wrap(wrapper);

    obj.wrapFunc();
    expect(wrapper).toHaveBeenCalledWith(jasmine.any(Function));
    expect(wrapper.mostRecentCall.object).toBe(obj);
    expect(obj.func).toHaveBeenCalledWith('arg2',undefined);
    expect(obj.func.mostRecentCall.object).toBe(obj);
    obj.wrapFunc('arg1','arg3');
    expect(wrapper).toHaveBeenCalledWith(jasmine.any(Function),'arg1','arg3');
    expect(wrapper.mostRecentCall.object).toBe(obj);
    expect(obj.func).toHaveBeenCalledWith('arg2','arg3');
    expect(obj.func.mostRecentCall.object).toBe(obj);

    wrapper = jasmine.createSpy('Sample wrapper').andCallFake(function(func,arg1){func(arg1);})
    obj.wrapFunc = obj.func.wrap(wrapper);
    obj.wrapFunc(1);
    expect(wrapper).toHaveBeenCalledWith(jasmine.any(Function),1);
    expect(wrapper.mostRecentCall.object).toBe(obj);
    expect(obj.func).toHaveBeenCalledWith(1);
    expect(obj.func.mostRecentCall.object).toBe(obj);
  });

  it('can be methodized', function()
  {
    var func = jasmine.createSpy('Sample function');
        obj = { func: func.methodize() };

    expect(obj.func).toBe(func.methodize());
    obj.func('arg1','arg2');
    expect(func).toHaveBeenCalledWith(obj,'arg1','arg2');
    obj.func(1);
    expect(func).toHaveBeenCalledWith(obj,1);  });

  it('can create a new instance with arguments passed as an array', function()
  {
    var Foo = Class.create({
      initialize: function(foobar) {
        this.bar = foobar;
      }
    });

    expect(Foo.newInstance(['foobar'])).toEqual(new Foo('foobar'));
    expect(Foo.newInstance(['foobar']) instanceof Foo).toBeTruthy();
    expect(Foo.newInstance(['foobar']).constructor).toBe(Foo);
    //expect(Date.newInstance([123456789012])).toEqual(new Date(123456789012));
  });
});
