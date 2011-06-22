/*
 * Copyright 2011 SOFTEC sa. All rights reserved.
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

describe('Event (dom)', function() {
  var outer, inner, span;

  beforeEach( function() {
    $$('body')[0].insert({top:("<div id='outer' style='display: none'><p id='inner'>One two three <span id='span'>four</span></p></div>")});
    outer = $('outer');
    inner = $('inner');
    span = $('span');
  });

  afterEach( function() {
    outer.descendants().invoke('stopObserving');
    outer.stopObserving();
    outer.remove();
  });

  it('can fire custom events', function() {
    var observer = jasmine.createSpy('Observe test:somethingHappened on span');
    span.observe("test:somethingHappened", observer);
    span.fire("test:somethingHappened", { index: 1 });
    expect(observer).toHaveBeenCalled();
    expect(observer.mostRecentCall.args.length).toEqual(1);
    expect(observer.mostRecentCall.args[0].element()).toEqual(span);
    expect(observer.mostRecentCall.args[0].memo.index).toEqual(1);

    observer.reset();
    span.fire("test:somethingElseHappened");
    expect(observer).not.toHaveBeenCalled();

    observer.reset();
    span.stopObserving("test:somethingHappened", observer);
    span.fire("test:somethingHappened");
    expect(observer).not.toHaveBeenCalled();
  });

  it('can bubble custom events', function() {
    var observer = jasmine.createSpy('Observe test:somethingHappened on outer');
    outer.observe("test:somethingHappened", observer);
    span.fire("test:somethingHappened");
    expect(observer).toHaveBeenCalled();
    expect(observer.mostRecentCall.args.length).toEqual(1);
    expect(observer.mostRecentCall.args[0].element()).toEqual(span);

    observer.reset();
    span.fire("test:somethingElseHappened");
    expect(observer).not.toHaveBeenCalled();

    observer.reset();
    outer.stopObserving("test:somethingHappened", observer);
    span.fire("test:somethingHappened");
    expect(observer).not.toHaveBeenCalled();
  });

  it('can cancel custom events', function() {
    var outerObserver = jasmine.createSpy('Observe test:somethingHappened on outer'),
        innerObserver = jasmine.createSpy('Observe test:somethingHappened on inner')
          .andCallFake(function(event){event.stop()});

    inner.observe("test:somethingHappened", innerObserver);
    outer.observe("test:somethingHappened", outerObserver);
    span.fire("test:somethingHappened");
    expect(innerObserver).toHaveBeenCalled();
    expect(outerObserver).not.toHaveBeenCalled();

    outerObserver.reset();
    innerObserver.reset();
    inner.stopObserving("test:somethingHappened", innerObserver);
    span.fire("test:somethingHappened");
    expect(innerObserver).not.toHaveBeenCalled();
    expect(outerObserver).toHaveBeenCalled();

    outer.stopObserving("test:somethingHappened", outerObserver);
  });

  it('extends event objects', function() {
    var observer = jasmine.createSpy('Observe test:somethingHappened on span');
    span.observe("test:somethingHappened", observer);
    var event = span.fire("test:somethingHappened");
    expect(observer).toHaveBeenCalledWith(event);
    expect(event.stop).toEqual(Event.Methods.stop.methodize());

    span.stopObserving("test:somethingHappened", observer);

    event = span.fire("test:somethingHappenedButNoOneIsListening");
    expect(event.stop).toEqual(Event.Methods.stop.methodize());
  });

  it('bounds event observer to the observed element', function() {
    var observer = jasmine.createSpy('Observe test:somethingHappened on span');

    span.observe("test:somethingHappened", observer);
    span.fire("test:somethingHappened");
    span.stopObserving("test:somethingHappened", observer);
    expect(observer).toHaveBeenCalled();
    expect(observer.mostRecentCall.object).toEqual(span);

    observer.reset();
    outer.observe("test:somethingHappened", observer);
    span.fire("test:somethingHappened");
    outer.stopObserving("test:somethingHappened", observer);
    expect(observer).toHaveBeenCalled();
    expect(observer.mostRecentCall.object).toEqual(outer);
  });

  it('support multiple event observer with the same handler', function() {
    var observer = jasmine.createSpy('Observe test:somethingHappened on span');

    span.observe("test:somethingHappened", observer);
    span.observe("test:somethingElseHappened", observer);
    span.fire("test:somethingHappened");
    expect(observer).toHaveBeenCalled();

    observer.reset();
    span.fire("test:somethingElseHappened");
    expect(observer).toHaveBeenCalled();
  });

  it('can add and remove multiple event observer from the same element', function(){
    var observer1 = jasmine.createSpy('1:Observe test:somethingHappened on span'),
        observer2 = jasmine.createSpy('2:Observe test:somethingHappened on span');

    span.observe("test:somethingHappened", observer1);
    span.observe("test:somethingHappened", observer2);
    span.fire("test:somethingHappened");
    expect(observer1).toHaveBeenCalled();
    expect(observer2).toHaveBeenCalled();

    observer1.reset();
    observer2.reset();
    span.stopObserving("test:somethingHappened", observer1);
    span.stopObserving("test:somethingHappened", observer2);
    span.fire("test:somethingHappened");
    expect(observer1).not.toHaveBeenCalled();
    expect(observer2).not.toHaveBeenCalled();
  });

  it('can stop observing all events of an element', function(){
    var observer = jasmine.createSpy('Observe on span');

    span.observe("test:somethingHappened", observer);
    span.observe("test:somethingElseHappened", observer);
    span.stopObserving();
    span.fire("test:somethingHappened");
    expect(observer).not.toHaveBeenCalled();

    observer.reset();
    span.fire("test:somethingElseHappened");
    expect(observer).not.toHaveBeenCalled();
  });

  it('can stop observing different event of an element indepandently', function(){
    var observer = jasmine.createSpy('Observe on span');

    span.observe("test:somethingHappened", observer);
    span.observe("test:somethingElseHappened", observer);
    span.stopObserving("test:somethingHappened");
    span.fire("test:somethingHappened");
    expect(observer).not.toHaveBeenCalled();

    observer.reset();
    span.fire("test:somethingElseHappened");
    expect(observer).toHaveBeenCalled();

    observer.reset();
    span.stopObserving("test:somethingElseHappened");
    span.fire("test:somethingElseHappened");
    expect(observer).not.toHaveBeenCalled();
  });

  it('clean event information cached on element properly', function(){
    var observer = jasmine.createSpy('Observe test:somethingHappened on span'),
        registry;

    span.observe("test:somethingHappened", observer);

    expect(registry = span.getStorage().get('improved_event_registry')).toBeDefined();
    expect(Object.isArray(registry.get('test:somethingHappened'))).toBeTruthy();
    expect(registry.get('test:somethingHappened').length).toEqual(1);

    span.stopObserving("test:somethingHappened", observer);

    expect(registry = span.getStorage().get('improved_event_registry')).toBeDefined();
    expect(Object.isArray(registry.get('test:somethingHappened'))).toBeTruthy();
    expect(registry.get('test:somethingHappened').length).toEqual(0);
  });

  it('can chain observe and stopObserving', function(){
    var observer = jasmine.createSpy('Observe test:somethingHappened on span');

    expect(span.observe("test:somethingHappened", observer)).toEqual(span);
    expect(span.stopObserving("test:somethingHappened", observer)).toEqual(span);

    span.observe("test:somethingHappened", observer);
    expect(span.stopObserving("test:somethingHappened")).toEqual(span);

    expect(span.stopObserving("test:somethingOtherHappened")).toEqual(span);

    span.observe("test:somethingHappened", observer);
    expect(span.stopObserving()).toEqual(span);
    expect(span.stopObserving()).toEqual(span);

    span.observe("test:somethingHappened", observer);
    expect(span.observe("test:somethingHappened", observer)).toEqual(span);
    span.stopObserving();
  });

  it('mark stopped event properly', function(){
    var observer = jasmine.createSpy('Observe test:somethingHappened on span'),
        event;

    span.observe("test:somethingHappened", observer);
    event = span.fire("test:somethingHappened");
    expect(event.stopped).toBeFalsy();
    span.stopObserving("test:somethingHappened");

    observer = jasmine.createSpy('Observe test:somethingHappened on span')
      .andCallFake(function(event){event.stop()});
    span.observe("test:somethingHappened", observer);
    event = span.fire("test:somethingHappened");
    expect(event.stopped).toBeTruthy();
    span.stopObserving("test:somethingHappened");
  });

  it('can fire non-bubbling events', function() {
    var observer = jasmine.createSpy('Observe test:bubbleEvent on outer');

    outer.observe("test:bubbleEvent", observer);
    span.fire("test:bubbleEvent", {}, false);

    expect(observer).not.toHaveBeenCalled();
    outer.stopObserving("test:bubbleEvent")
  });

  it('can find elements related to an event', function() {
    var event = span.fire("test:somethingHappened");
    expect(event.findElement()).toEqual(span);
    expect(event.findElement('span')).toEqual(span);
    expect(event.findElement('p')).toEqual(inner);
    expect(event.findElement('div.does_not_exist')).not.toBeDefined();
    expect(event.findElement('.does_not_exist, span')).toEqual(span);
  });

  it('does not duplicate event ID', function() {
    var observer = jasmine.createSpy('Observe test:somethingHappened on inner');

    $('outer').down().observe("test:somethingHappened", observer);
    $('outer').innerHTML += $('outer').innerHTML;

    expect($('outer').down(1)._prototypeEventID).not.toBeDefined();
  });

  it('fire custom events multiple times when once=false', function() {
    var observer = jasmine.createSpy('Observe test:somethingHappened on span');
    span.observe("test:somethingHappened", observer);
    span.fire("test:somethingHappened");
    expect(observer).toHaveBeenCalled();
    observer.reset();
    span.fire("test:somethingHappened");
    expect(observer).toHaveBeenCalled();
    span.stopObserving("test:somethingHappened", observer);
  });

  it('fire custom events once when once=true', function() {
    var observer = jasmine.createSpy('Observe test:somethingHappened on span'),
        observer2 = jasmine.createSpy('Observe test:somethingHappened on span');
    span.observe("test:somethingHappened", observer, true);
    span.fire("test:somethingHappened");
    expect(observer).toHaveBeenCalled();
    observer.reset();
    span.fire("test:somethingHappened");
    expect(observer).not.toHaveBeenCalled();
    span.stopObserving("test:somethingHappened", observer);
  });
});

describe('Event Handler', function() {
  var container;

  beforeEach( function() {
    $$('body')[0].insert({top:('<div id="container" style="display: none">'
                              +'<p>Here\'s <a href="#"><span>a link</span></a>.</p>'
                              +'<p>And here\'s another paragraph.</p></div>')});
    container = $('container');
  });

  afterEach( function() {
    container.stopObserving();
    container.remove();
  });

  it('does not fire until start has been called', function() {
    var observer = jasmine.createSpy('Observe test.somethingHappened on container'),
        handler = new Event.Handler("container", "test:somethingHappened", null, observer);

    container.fire("test:somethingHappened");
    expect(observer).not.toHaveBeenCalled();
    handler.start();
    expect(observer).not.toHaveBeenCalled();
    container.fire("test:somethingHappened");
    expect(observer).toHaveBeenCalled();
  });

  it('does not fire after stop has been called', function() {
    var observer = jasmine.createSpy('Observe test.somethingHappened on container'),
        handler = new Event.Handler("container", "test:somethingHappened", null, observer).start();

    container.fire("test:somethingHappened");
    expect(observer).toHaveBeenCalled();
    observer.reset();
    handler.stop();
    expect(observer).not.toHaveBeenCalled();
    container.fire("test:somethingHappened");
    expect(observer).not.toHaveBeenCalled();
  });

  it('pass the event and element to the callback', function() {
    var span = container.down('span'),
        observer = jasmine.createSpy('Observe test.somethingHappened on container'),
        handler = new Event.Handler("container", "test:somethingHappened", null, observer).start(),
        event = span.fire("test:somethingHappened");
    expect(observer).toHaveBeenCalledWith(event,span);
  });

  it('pass the event and selector matching element to the callback', function() {
    var link = $("container").down("a"), span = link.down("span"),
        observer = jasmine.createSpy('Observe test.somethingHappened on container'),
        handler = new Event.Handler("container", "test:somethingHappened", "a", observer).start(),
        event = span.fire("test:somethingHappened");
    expect(observer).toHaveBeenCalledWith(event,link);
  });

  it('does not call the callback when no element match the selector', function() {
    var paragraph = $("container").down("p", 1),
        observer = jasmine.createSpy('Observe test.somethingHappened on container'),
        handler = new Event.Handler("container", "test:somethingHappened", "a", observer).start();
    paragraph.fire("test:somethingHappened");
    expect(observer).not.toHaveBeenCalledWith();
  });

  it('bounds the callback to the original element', function() {
    var span = $("container").down("span"),
        observer = jasmine.createSpy('Observe test.somethingHappened on container'),
        handler = new Event.Handler("container", "test:somethingHappened", null, observer).start(),
        event = span.fire("test:somethingHappened");
    expect(observer).toHaveBeenCalled();
    expect(observer.mostRecentCall.object).toEqual(container);
  });

  it('does not fire multiple times when start has been called multiple times', function() {
    var observer = jasmine.createSpy('Observe test.somethingHappened on container'),
        handler = new Event.Handler("container", "test:somethingHappened", null, observer).start();

    handler.start();
    container.fire("test:somethingHappened");
    expect(observer.callCount).toEqual(1);
  });

  it('fire only once when created with once=true', function() {
    var observer = jasmine.createSpy('Observe test.somethingHappened on container'),
        handler = new Event.Handler("container", "test:somethingHappened", null, observer, true).start();

    container.fire("test:somethingHappened");
    expect(observer).toHaveBeenCalled();
    observer.reset();
    container.fire("test:somethingHappened");
    expect(observer).not.toHaveBeenCalled();
  });

  it('be restarted in the handler when created with once=true', function() {
    var observer = jasmine.createSpy('Observe test.somethingHappened on container')
            .andCallFake(function(event){handler.start()}),
        handler = new Event.Handler("container", "test:somethingHappened", null, observer, true).start();

    container.fire("test:somethingHappened");
    expect(observer).toHaveBeenCalled();
    observer.reset();
    container.fire("test:somethingHappened");
    expect(observer).toHaveBeenCalled();
  });
});
