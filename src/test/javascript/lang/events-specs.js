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

describe('Event (lang)', function() {
  var outer, inner, span;

  it('can fire events on normal objects', function() {
    var obj = {}, observer = jasmine.createSpy('Observe somethingHappened on obj');
    Event.addListener(obj, "somethingHappened", observer);
    Event.trigger(obj,"somethingHappened", "arg1");
    expect(observer).toHaveBeenCalled();
    expect(observer.mostRecentCall.object).toBe(obj);
    expect(observer.mostRecentCall.args.length).toEqual(2);
    expect(observer.mostRecentCall.args[0]).toEqual("somethingHappened");
    expect(observer.mostRecentCall.args[1]).toEqual("arg1");

    observer.reset();
    Event.trigger(obj,"somethingElseHappened");
    expect(observer).not.toHaveBeenCalled();

    observer.reset();
    Event.removeListener(obj, "somethingHappened", observer);
    Event.trigger(obj,"somethingHappened");
    expect(observer).not.toHaveBeenCalled();
  });

  it('can add and remove multiple event observer from the same object', function(){
    var obj = {},
        observer1 = jasmine.createSpy('1:Observe somethingHappened on obj'),
        observer2 = jasmine.createSpy('2:Observe somethingHappened on obj');

    Event.addListener(obj, "somethingHappened", observer1);
    Event.addListener(obj, "somethingHappened", observer2);
    Event.trigger(obj,"somethingHappened");
    expect(observer1).toHaveBeenCalled();
    expect(observer2).toHaveBeenCalled();

    observer1.reset();
    observer2.reset();
    Event.removeListener(obj, "somethingHappened", observer1);
    Event.removeListener(obj, "somethingHappened", observer2);
    Event.trigger(obj,"somethingHappened");
    expect(observer1).not.toHaveBeenCalled();
    expect(observer2).not.toHaveBeenCalled();
  });

  it('can cancel events on normal objects', function() {
    var obj = {},
        firstObserver = jasmine.createSpy('Observe test:somethingHappened on obj')
          .andCallFake(function(){return true;}),
        secondObserver = jasmine.createSpy('Observe test:somethingHappened on obj')

    Event.addListener(obj, "somethingHappened", firstObserver);
    Event.addListener(obj, "somethingHappened", secondObserver);
    Event.trigger(obj,"somethingHappened");
    expect(firstObserver).toHaveBeenCalled();
    expect(secondObserver).not.toHaveBeenCalled();

    firstObserver.reset();
    secondObserver.reset();
    Event.removeListener(obj, "somethingHappened", firstObserver);
    Event.trigger(obj,"somethingHappened");
    expect(firstObserver).not.toHaveBeenCalled();
    expect(secondObserver).toHaveBeenCalled();

    Event.removeListener(obj, "somethingHappened", secondObserver);
  });

  it('support multiple event observer with the same handler', function() {
    var obj = {}, observer = jasmine.createSpy('Observe somethingHappened on obj');

    Event.addListener(obj, "somethingHappened", observer);
    Event.addListener(obj, "somethingElseHappened", observer);
    Event.trigger(obj,"somethingHappened");
    expect(observer).toHaveBeenCalled();

    observer.reset();
    Event.trigger(obj,"somethingElseHappened");
    expect(observer).toHaveBeenCalled();
  });

  it('can stop observing all events of an object', function(){
    var obj = {}, observer = jasmine.createSpy('Observe on obj');

    Event.addListener(obj, "somethingHappened", observer);
    Event.addListener(obj, "somethingElseHappened", observer);
    Event.removeListener(obj);
    Event.trigger(obj,"somethingHappened");
    expect(observer).not.toHaveBeenCalled();

    observer.reset();
    Event.trigger(obj,"somethingElseHappened");
    expect(observer).not.toHaveBeenCalled();
  });

  it('can stop observing different event of an object indepandently', function(){
    var obj = {}, observer = jasmine.createSpy('Observe on obj');

    Event.addListener(obj, "somethingHappened", observer);
    Event.addListener(obj, "somethingElseHappened", observer);
    Event.removeListener(obj,"somethingHappened");
    Event.trigger(obj,"somethingHappened");
    expect(observer).not.toHaveBeenCalled();

    observer.reset();
    Event.trigger(obj,"somethingElseHappened");
    expect(observer).toHaveBeenCalled();

    observer.reset();
    Event.removeListener(obj,"somethingElseHappened");
    Event.trigger(obj,"somethingElseHappened");
    expect(observer).not.toHaveBeenCalled();
  });

  it('clean event information cached on object properly', function(){
    var obj = {}, observer = jasmine.createSpy('Observe somethingHappened on obj'),
        registry;

    Event.addListener(obj, "somethingHappened", observer);

    expect(registry = obj.__ipd2ev).toBeDefined();
    expect(Object.isArray(registry.get('somethingHappened'))).toBeTruthy();
    expect(registry.get('somethingHappened').length).toEqual(1);

    Event.removeListener(obj,"somethingHappened", observer);

    expect(registry = obj.__ipd2ev).toBeDefined();
    expect(Object.isArray(registry.get('somethingHappened'))).toBeTruthy();
    expect(registry.get('somethingHappened').length).toEqual(0);
  });

  it('fire object events multiple times when once=false', function() {
    var obj = {}, observer = jasmine.createSpy('Observe somethingHappened on obj');
    Event.addListener(obj, "somethingHappened", observer);
    Event.trigger(obj,"somethingHappened");
    expect(observer).toHaveBeenCalled();
    observer.reset();
    Event.trigger(obj,"somethingHappened");
    expect(observer).toHaveBeenCalled();
    Event.removeListener(obj,"somethingHappened");
  });

  it('fire object events once when once=true', function() {
    var obj = {}, observer = jasmine.createSpy('Observe once somethingHappened on obj'),
        observer2 = jasmine.createSpy('Observe always somethingHappened on obj');
    Event.addListener(obj, "somethingHappened", observer, true);
    Event.addListener(obj, "somethingHappened", observer2);
    Event.trigger(obj,"somethingHappened");
    expect(observer).toHaveBeenCalled();
    expect(observer2).toHaveBeenCalled();
    observer.reset();
    observer2.reset();
    Event.trigger(obj,"somethingHappened");
    expect(observer).not.toHaveBeenCalled();
    expect(observer2).toHaveBeenCalled();
    Event.removeListener(obj,"somethingHappened");
  });

  it('can bound a property value of an object on the same property in another object', function() {
    var obj1 = { value: 0 },
        obj2 = { value: 1, setValue: Object.getSetter('value') };

    Object.bindTo(obj1, 'value', obj2);
    expect(obj1.value).toEqual(1);
    obj2.setValue(2);
    expect(obj2.value).toEqual(2);
    expect(obj1.value).toEqual(2);
    Object.unbind(obj1, 'value');
    obj2.setValue(3);
    expect(obj2.value).toEqual(3);
    expect(obj1.value).toEqual(2);
  });

  it('can bound a property value of an object on another property in another object', function() {
    var obj1 = { value1: 0 },
        obj2 = { value2: 1, setValue2: Object.getSetter('value2') };

    Object.bindTo(obj1, 'value1', obj2, 'value2');
    expect(obj1.value1).toEqual(1);
    obj2.setValue2(2);
    expect(obj2.value2).toEqual(2);
    expect(obj1.value1).toEqual(2);
    Object.unbind(obj1, 'value1');
    obj2.setValue2(3);
    expect(obj2.value2).toEqual(3);
    expect(obj1.value1).toEqual(2);
  });

  it('can bound a property value with setter of an object on another property with getter in another object', function() {
    var obj1 = { _value1: 0, setValue1: jasmine.createSpy('value1 setter').andCallFake(Object.getQuietSetter('_value1')) },
        obj2 = { _value2: 1, getValue2: jasmine.createSpy('value2 getter').andCallFake(Object.getGetter('_value2')),
                             setValue2: Object.getSetter('_value2') };

    Object.bindTo(obj1, 'value1', obj2, 'value2');
    expect(obj1._value1).toEqual(1);
    expect(obj1.setValue1).toHaveBeenCalled();
    expect(obj2.getValue2).toHaveBeenCalled();
    obj1.setValue1.reset();
    obj2.getValue2.reset();
    obj2.setValue2(2);
    expect(obj2._value2).toEqual(2);
    expect(obj1._value1).toEqual(2);
    expect(obj1.setValue1).toHaveBeenCalled();
    expect(obj2.getValue2).toHaveBeenCalled();
    obj1.setValue1.reset();
    obj2.getValue2.reset();
    Object.unbind(obj1, 'value1');
    obj2.setValue2(3);
    expect(obj2._value2).toEqual(3);
    expect(obj1._value1).toEqual(2);
  });

  it('can extends object for easy use of event and binding function', function() {
    var MyKlass1 = Class.create('MyKlass1',Object.Methods, {
          initialize: function(obj){
            this._value1 = 0;
            this.bindTo('value1', obj2, 'value2');
          },
          stopBindings: function() {
            this.unbind('value1');
          },
          setValue1: jasmine.createSpy('value1 setter').andCallFake(Object.getQuietSetter('_value1'))
        }),
        MyKlass2 = Class.create('MyKlass2',Object.Methods, {
          initialize: function(obj){
            this._value2 = 1;
          },
          getValue2: jasmine.createSpy('value2 getter').andCallFake(Object.getGetter('_value2')),
          setValue2: Object.getSetter('_value2')
        }), obj2 = new MyKlass2(), obj1 = new MyKlass1(obj2);
    expect(obj1._value1).toEqual(1);
    expect(obj1.setValue1).toHaveBeenCalled();
    expect(obj2.getValue2).toHaveBeenCalled();
    obj1.setValue1.reset();
    obj2.getValue2.reset();
    obj2.setValue2(2);
    expect(obj2._value2).toEqual(2);
    expect(obj1._value1).toEqual(2);
    expect(obj1.setValue1).toHaveBeenCalled();
    expect(obj2.getValue2).toHaveBeenCalled();
    obj1.setValue1.reset();
    obj2.getValue2.reset();
    obj1.stopBindings();
    obj2.setValue2(3);
    expect(obj2._value2).toEqual(3);
    expect(obj1._value1).toEqual(2);
  });
});
