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

if( !Improved.titanium ) {

describe('Ajax', function() {

  var content, content2,
      // lowercase comparison because of MSIE which presents HTML tags in uppercase
      sentence = ("Pack my box with <em>five dozen</em> liquor jugs! " +
                  "Oh, how <strong>quickly</strong> daft jumping zebras vex...").toLowerCase();

  beforeEach(function() {
    $$('body')[0].insert('<div id="content"></div><div id="content2" style="color:red"></div>');
    content = $('content');
    content2 = $('content2');
    this.addMatchers({
          toBeElement: function() { return Object.isElement(this.actual); },
          toBeInstanceOf: function(klass) { return this.actual instanceof klass; }
        });
  });

  afterEach(function() {
    // hack to cleanup responders
    Ajax.Responders.responders = [Ajax.Responders.responders[0]];
    $('content').remove();
    $('content2').remove();
  });

  function extendDefault(options) {
    return Object.extend({
      asynchronous: false,
      method: 'get',
      onException: function(r, e) { throw e; }
    }, options);
  };

  it('can execute JSONP resquest that returns text', function() {
    var onComplete = jasmine.createSpy('onComplete'),
        onSuccess = jasmine.createSpy('onSuccess'),
        onFailure = jasmine.createSpy('onFailure');

    expect(content.innerHTML).toEqual('');

    runs(function() {
      expect(Ajax.activeRequestCount).toEqual(0);
      new Ajax.Request("../../src/test/resources/jsonp.js", {
        asynchronous: true,
        method: 'JSONP',
        onSuccess: onSuccess,
        onFailure: onFailure,
        onComplete: onComplete
      });
      expect(Ajax.activeRequestCount).toEqual(1);
    });

    waitsFor(function() { return !Ajax.activeRequestCount;}, 'Wait for Ajax request to complete');

    runs(function(){
      expect(onSuccess).toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalled();
      expect(onFailure).not.toHaveBeenCalled();
      expect(onComplete.mostRecentCall.args[0].responseText).toEqual('{"test": 123}');
    });
  });

  it('fails properly if JSONP response does not invoke the callback', function() {
    var onComplete = jasmine.createSpy('onComplete'),
        onSuccess = jasmine.createSpy('onSuccess'),
        onFailure = jasmine.createSpy('onFailure');

    expect(content.innerHTML).toEqual('');

    runs(function() {
      expect(Ajax.activeRequestCount).toEqual(0);
      new Ajax.Request("../../src/test/resources/jsonp.js", {
        asynchronous: true,
        method: 'JSONP',
        onSuccess: onSuccess,
        onFailure: onFailure,
        onComplete: onComplete
      });
      expect(Ajax.activeRequestCount).toEqual(1);
    });

    waitsFor(function() { return !Ajax.activeRequestCount;}, 'Wait for Ajax request to complete');

    runs(function(){
      expect(onSuccess).toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalled();
      expect(onFailure).not.toHaveBeenCalled();
      expect(onComplete.mostRecentCall.args[0].status).toEqual(204);
    });
  });

  it('can execute JSONP resquest that returns JSON', function() {
    var onComplete = jasmine.createSpy('onComplete'),
        onSuccess = jasmine.createSpy('onSuccess'),
        onFailure = jasmine.createSpy('onFailure');

    expect(content.innerHTML).toEqual('');

    runs(function() {
      expect(Ajax.activeRequestCount).toEqual(0);
      new Ajax.Request("../../src/test/resources/jsonp.js", {
        asynchronous: true,
        method: 'JSONP',
        onSuccess: onSuccess,
        onFailure: onFailure,
        onComplete: onComplete
      });
      expect(Ajax.activeRequestCount).toEqual(1);
    });

    waitsFor(function() { return !Ajax.activeRequestCount;}, 'Wait for Ajax request to complete');

    runs(function(){
      expect(onSuccess).toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalled();
      expect(onFailure).not.toHaveBeenCalled();
      expect(onComplete.mostRecentCall.args[0].responseJSON).toBeDefined();
      expect(onComplete.mostRecentCall.args[0].responseJSON.test).toEqual(123);
    });
  });

  it('fails properly when no response while using JSONP', function() {
    var onComplete = jasmine.createSpy('onComplete'),
        onSuccess = jasmine.createSpy('onSuccess'),
        onFailure = jasmine.createSpy('onFailure');

    expect(content.innerHTML).toEqual('');

    runs(function() {
      expect(Ajax.activeRequestCount).toEqual(0);
      new Ajax.Request("../../src/test/resources/missing.js", {
        asynchronous: true,
        method: 'JSONP',
        onSuccess: onSuccess,
        onFailure: onFailure,
        onComplete: onComplete
      });
      expect(Ajax.activeRequestCount).toEqual(1);
    });

    waitsFor(function() { return !Ajax.activeRequestCount;}, 12000, 'Wait for Ajax request to fail');

    runs(function(){
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalled();
      expect(onFailure).toHaveBeenCalled();
      expect(onComplete.mostRecentCall.args[0].responseJSON).toBeDefined();
      expect(onComplete.mostRecentCall.args[0].status==404
             || onComplete.mostRecentCall.args[0].status==408).toBeTruthy();
    });
  });

  it('can execute synchronous resquest', function() {
    expect(content.innerHTML).toEqual('');

    expect(Ajax.activeRequestCount).toEqual(0);
    new Ajax.Request("../../src/test/resources/hello.js", {
      asynchronous: false,
      method: 'GET',
      evalJS: 'force'
    });
    expect(Ajax.activeRequestCount).toEqual(0);

    expect(content.firstDescendant()).toBeElement();
    expect(content.firstDescendant().innerHTML).toEqual('Hello world!');
  });

  it('can execute asynchronous resquest', function() {
    expect(content.innerHTML).toEqual('');

    runs(function() {
      expect(Ajax.activeRequestCount).toEqual(0);
      new Ajax.Request("../../src/test/resources/hello.js", {
        asynchronous: true,
        method: 'GET',
        evalJS: 'force'
      });
      expect(Ajax.activeRequestCount).toEqual(1);
    });

    waitsFor(function() { return !Ajax.activeRequestCount;}, 'Wait for Ajax request to complete');

    runs(function() {
      expect(content.firstDescendant()).toBeElement();
      expect(content.firstDescendant().innerHTML).toEqual('Hello world!');
    });
  });

  it('can updates content', function() {
    expect(content.innerHTML).toEqual('');

    runs(function() {
      expect(Ajax.activeRequestCount).toEqual(0);
      new Ajax.Updater("content", "../../src/test/resources/content.html", { method:'get' });
      expect(Ajax.activeRequestCount).toEqual(1);
    });

    waitsFor(function() { return !Ajax.activeRequestCount;}, 'Wait for Ajax request to complete');

    runs(function() {
      expect(content.innerHTML.strip().toLowerCase()).toEqual(sentence);
      content.update('');
      expect(content.innerHTML).toEqual('');

      expect(Ajax.activeRequestCount).toEqual(0);
      new Ajax.Updater({ success:"content", failure:"content2" },
        "../../src/test/resources/content.html", { method:'get', parameters:{ pet:'monkey' } });
      expect(Ajax.activeRequestCount).toEqual(1);
      new Ajax.Updater("", "../../src/test/resources/content.html", { method:'get', parameters:"pet=monkey" });
      expect(Ajax.activeRequestCount).toEqual(2);
    });

    waitsFor(function() { return !Ajax.activeRequestCount;}, 'Wait for Ajax request to complete');

    runs(function() {
      expect(content.innerHTML.strip().toLowerCase()).toEqual(sentence);
    });
  });

  it('can insert content', function() {
    expect(content.innerHTML).toEqual('');

    runs(function() {
      expect(Ajax.activeRequestCount).toEqual(0);
      new Ajax.Updater("content", "../../src/test/resources/content.html", { method:'get', insertion: 'top' });
      expect(Ajax.activeRequestCount).toEqual(1);
    });

    waitsFor(function() { return !Ajax.activeRequestCount;}, 'Wait for Ajax request to complete');

    runs(function() {
      expect(content.innerHTML.strip().toLowerCase()).toEqual(sentence);
      content.update('');
      expect(content.innerHTML).toEqual('');

      expect(Ajax.activeRequestCount).toEqual(0);
      new Ajax.Updater("content", "../../src/test/resources/content.html", { method:'get', insertion: 'bottom' });
      expect(Ajax.activeRequestCount).toEqual(1);
    });

    waitsFor(function() { return !Ajax.activeRequestCount;}, 'Wait for Ajax request to complete');

    runs(function() {
      expect(content.innerHTML.strip().toLowerCase()).toEqual(sentence);
      content.update('').insert('<span id="test"></span>');

      expect(Ajax.activeRequestCount).toEqual(0);
      new Ajax.Updater("test", "../../src/test/resources/content.html", { method:'get', insertion: 'after' });
      expect(Ajax.activeRequestCount).toEqual(1);
    });

    waitsFor(function() { return !Ajax.activeRequestCount;}, 'Wait for Ajax request to complete');

    runs(function() {
      expect($('test').next().innerHTML.strip().toLowerCase()).toEqual('five dozen');
    });
  });

  it('can properly manage multiple responders', function() {
    var responder = {
      onCreate:   jasmine.createSpy('onCreate responder'),
      onLoading:  jasmine.createSpy('onLoading responder'),
      onComplete: jasmine.createSpy('onComplete responder')
    };

    runs(function() {
      // check for internal responder
      expect(Ajax.Responders.responders.length).toEqual(1);

      var dummyResponder = {
        onComplete: Improved.emptyFunction
      };

      Ajax.Responders.register(dummyResponder);
      expect(Ajax.Responders.responders.length).toEqual(2);

      // don't add twice
      Ajax.Responders.register(dummyResponder);
      expect(Ajax.Responders.responders.length).toEqual(2);

      Ajax.Responders.unregister(dummyResponder);
      expect(Ajax.Responders.responders.length).toEqual(1);

      Ajax.Responders.register(responder);

      expect(Ajax.activeRequestCount).toEqual(0);
      new Ajax.Request("../../src/test/resources/content.html", { method:'get', parameters:"pet=monkey" });
      expect(Ajax.activeRequestCount).toEqual(1);
      expect(responder.onCreate).toHaveBeenCalled();
    });

    waitsFor(function() { return !Ajax.activeRequestCount;}, 'Wait for Ajax request to complete');

    runs(function() {
      expect(responder.onLoading).toHaveBeenCalled();
      expect(responder.onComplete).toHaveBeenCalled();
    });
  });

  it('calls onComplete after script evaluation', function() {
    expect(content.innerHTML).toEqual('');

    expect(Ajax.activeRequestCount).toEqual(0);
    new Ajax.Request("../../src/test/resources/hello.js", extendDefault({
      evalJS: 'force',
      onComplete: function(response) { expect(content.innerHTML).not.toEqual(''); }.bind(this)
    }));
    expect(Ajax.activeRequestCount).toEqual(0);

    expect(content.firstDescendant()).toBeElement();
    expect(content.firstDescendant().innerHTML).toEqual('Hello world!');
  });

  it('expose call onCreate and onComplete appropriatly', function() {
    new Ajax.Request("../../src/test/resources/content.html", extendDefault({
      onCreate: function(transport) { expect(transport.readyState).toEqual(0) }.bind(this),
      onComplete: function(transport) { expect(transport.readyState).not.toEqual(0) }.bind(this)
    }));
  });

  it('expose call onCreate and onComplete appropriatly', function() {
    content.update();
    new Ajax.Request("../../src/test/resources/hello.js", extendDefault({
      evalJS: 'force',
      onComplete: function(transport) {
        expect(content.firstDescendant()).toBeElement();
        expect(content.firstDescendant().innerHTML).toEqual('Hello world!');
      }.bind(this)
    }));

    content.update();
    new Ajax.Request("../../src/test/resources/hello.js", extendDefault({
      evalJS: false,
      onComplete: function(transport) {
        expect(content.innerHTML).toEqual('');
      }.bind(this)
    }));
  });

  it('calls all callbacks with response', function() {
    var options = extendDefault({
      onCreate: jasmine.createSpy('onCreate Spy')
    });

    Ajax.Request.Events.each(function(state){
      options['on' + state] = jasmine.createSpy('on' + state + ' Spy');
    });

    new Ajax.Request("../../src/test/resources/content.html", options);

    expect(options['onCreate']).toHaveBeenCalled();
    expect(options['onCreate'].mostRecentCall.args[0]).toBeInstanceOf(Ajax.Response);
    Ajax.Request.Events.each(function(state){
      if(options['on' + state].callCount > 0) {
        expect(options['on' + state].mostRecentCall.args[0]).toBeInstanceOf(Ajax.Response);
      }
    });
  });

  it('have a response that contains proper data', function() {
    new Ajax.Request("../../src/test/resources/empty.html", extendDefault({
      onComplete: function(transport) { expect(transport.responseText).toEqual('') }.bind(this)
    }));
    new Ajax.Request("../../src/test/resources/content.html", extendDefault({
      onComplete: function(transport) { expect(transport.responseText.strip().toLowerCase()).toEqual(sentence) }.bind(this)
    }));
  });

  it('parse JSON response properly', function() {
    new Ajax.Request("../../src/test/resources/data.json", extendDefault({
      evalJSON: 'force',
      onComplete: function(transport) { expect(transport.responseJSON.test).toEqual(123); }.bind(this)
    }));
  });
})

} else {

describe('Ajax', function() {
  var content, content2,
      // lowercase comparison because of MSIE which presents HTML tags in uppercase
      sentence = ("Pack my box with <em>five dozen</em> liquor jugs! " +
                  "Oh, how <strong>quickly</strong> daft jumping zebras vex...").toLowerCase();

  beforeEach(function() {
    ajaxtest = {};
    this.addMatchers({
      toBeInstanceOf: function(klass) { return this.actual instanceof klass; }
    });
});

  afterEach(function() {
    // hack to cleanup responders
    Ajax.Responders.responders = [Ajax.Responders.responders[0]];
    ajaxtest = undefined;
  });

  function extendDefault(options) {
    return Object.extend({
      asynchronous: true,
      method: 'get',
      onException: function(r, e) { throw e; }
    }, options);
  };

  it('can execute asynchronous resquest', function() {
    expect(ajaxtest.response).not.toBeDefined();

    runs(function() {
      expect(Ajax.activeRequestCount).toEqual(0);
      new Ajax.Request("http://carto.softec.lu/resources/js/test/hello.js", extendDefault({
        evalJS: 'force'
      }));
      expect(Ajax.activeRequestCount).toEqual(1);
    });

    waitsFor(function() { return !Ajax.activeRequestCount;}, 'Wait for Ajax request to complete');

    runs(function() {
      expect(Ajax.activeRequestCount).toEqual(0);
      expect(ajaxtest.response).toEqual('hello');
    });
  });

  it('can properly manage multiple responders', function() {
    var responder = {
      onCreate:   jasmine.createSpy('onCreate responder'),
      onLoading:  jasmine.createSpy('onLoading responder'),
      onComplete: jasmine.createSpy('onComplete responder')
    };

    runs(function() {
      // check for internal responder
      expect(Ajax.Responders.responders.length).toEqual(1);

      var dummyResponder = {
        onComplete: Improved.emptyFunction
      };

      Ajax.Responders.register(dummyResponder);
      expect(Ajax.Responders.responders.length).toEqual(2);

      // don't add twice
      Ajax.Responders.register(dummyResponder);
      expect(Ajax.Responders.responders.length).toEqual(2);

      Ajax.Responders.unregister(dummyResponder);
      expect(Ajax.Responders.responders.length).toEqual(1);

      Ajax.Responders.register(responder);

      expect(Ajax.activeRequestCount).toEqual(0);
      new Ajax.Request("http://carto.softec.lu/resources/js/test/content.html", extendDefault({parameters:"pet=monkey"}));
      expect(Ajax.activeRequestCount).toEqual(1);
      expect(responder.onCreate).toHaveBeenCalled();
    });

    waitsFor(function() { return !Ajax.activeRequestCount;}, 'Wait for Ajax request to complete');

    runs(function() {
      expect(responder.onLoading).toHaveBeenCalled();
      expect(responder.onComplete).toHaveBeenCalled();
    });
  });

  it('calls onComplete after script evaluation', function() {
    runs(function() {
      expect(ajaxtest.response).not.toBeDefined();

      expect(Ajax.activeRequestCount).toEqual(0);
      new Ajax.Request("http://carto.softec.lu/resources/js/test/hello.js", extendDefault({
        evalJS: 'force',
        onComplete: function(response) { expect(ajaxtest.response).toEqual('hello'); }.bind(this)
      }));
    });

    waitsFor(function() { return !Ajax.activeRequestCount;}, 'Wait for Ajax request to complete');

    runs(function() {
      expect(Ajax.activeRequestCount).toEqual(0);
      expect(ajaxtest.response).toEqual('hello');
    });
  });

  it('expose call onCreate and onComplete appropriatly', function() {
    runs(function() {
      new Ajax.Request("http://carto.softec.lu/resources/js/test/content.html", extendDefault({
        onCreate: function(transport) { expect(transport.readyState).toEqual(0) }.bind(this),
        onComplete: function(transport) { expect(transport.readyState).not.toEqual(0) }.bind(this)
      }));
    });
    waitsFor(function() { return !Ajax.activeRequestCount;}, 'Wait for Ajax request to complete');
  });

  it('expose call onCreate and onComplete appropriatly', function() {
    runs(function() {
      expect(ajaxtest.response).not.toBeDefined();
      new Ajax.Request("http://carto.softec.lu/resources/js/test/hello.js", extendDefault({
        evalJS: 'force',
        onComplete: function(transport) {
          expect(ajaxtest.response).toEqual('hello');
        }.bind(this)
      }));
    });

    waitsFor(function() { return !Ajax.activeRequestCount;}, 'Wait for Ajax request to complete');

    runs(function() {
      delete ajaxtest.response;
      new Ajax.Request("http://carto.softec.lu/resources/js/test/hello.js", extendDefault({
        evalJS: false,
        onComplete: function(transport) {
          expect(ajaxtest.response).not.toBeDefined();
        }.bind(this)
      }));
    });

    waitsFor(function() { return !Ajax.activeRequestCount;}, 'Wait for Ajax request to complete');
  });

  it('calls all callbacks with response', function() {
    var options = extendDefault({
      onCreate: jasmine.createSpy('onCreate Spy')
    });

    runs(function() {
      Ajax.Request.Events.each(function(state){
        options['on' + state] = jasmine.createSpy('on' + state + ' Spy');
      });

      new Ajax.Request("http://carto.softec.lu/resources/js/test/content.html", options);
    });

    waitsFor(function() { return !Ajax.activeRequestCount;}, 'Wait for Ajax request to complete');

    runs(function() {
      expect(options['onCreate']).toHaveBeenCalled();
      expect(options['onCreate'].mostRecentCall.args[0]).toBeInstanceOf(Ajax.Response);
      Ajax.Request.Events.each(function(state){
        if(options['on' + state].callCount > 0) {
          expect(options['on' + state].mostRecentCall.args[0]).toBeInstanceOf(Ajax.Response);
        }
      });
    });
  });

  it('have a response that contains proper data', function() {
    runs(function() {
      new Ajax.Request("http://carto.softec.lu/resources/js/test/empty.html", extendDefault({
        onComplete: function(transport) { expect(transport.responseText).toEqual('') }.bind(this)
      }));
      new Ajax.Request("http://carto.softec.lu/resources/js/test/content.html", extendDefault({
        onComplete: function(transport) { expect(transport.responseText.strip().toLowerCase()).toEqual(sentence) }.bind(this)
      }));
    });

    waitsFor(function() { return !Ajax.activeRequestCount;}, 'Wait for Ajax request to complete');
  });

  it('parse JSON response properly', function() {
    runs(function() {
      new Ajax.Request("http://carto.softec.lu/resources/js/test/data.json", extendDefault({
        evalJSON: 'force',
        onComplete: function(transport) { expect(transport.responseJSON.test).toEqual(123); }.bind(this)
      }));
    });

    waitsFor(function() { return !Ajax.activeRequestCount;}, 'Wait for Ajax request to complete');
  });
});

}
