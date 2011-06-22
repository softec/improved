/*
 * Copyright 2011 SOFTEC sa. All rights reserved.
 *
 * This source code is licensed under the Creative Commons
 * Attribution-NonCommercial-NoDerivs 3.0 Luxembourg
 * License.
 *
 * To view a copy of this license, visit
 * http://creativecommons.org/licenses/by-nc-nd/3.0/lu/
 * or send a letter to Creative Commons, 171 Second Street,
 * Suite 300, San Francisco, California, 94105, USA.
 */

xdescribe('Animation', function() {
  var testDiv, animDiv;

  beforeEach(function() {
    window.testResult = undefined;
    if( testDiv ) {
      testDiv.firstDescendant().text('It #{description}'.interpolate(this));
    }
  });

  it('is just the initialisation of map for the rest of these tests', function() {
    $$('body')[0].insert({top:
      ("<div id='testdiv' ><h2>It is just the initialisation of map for the rest of these tests</h2>"
      +"<div><button onclick='window.testResult=true'>Passed</button><button onclick='window.testResult=false'>Failed</button></div>"
      +"<div id='animdiv' style='background-color: red; width: 100px; height: 50px'></div>")});
    window.testResult = undefined;
    testDiv = $('testdiv');
    animDiv = $('animdiv').hide();
    jasmine.WaitsForBlock.TIMEOUT_INCREMENT = 1000;
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
  });

  it('can show in', function() {
    var callback = jasmine.createSpy('callback');
    runs(function() {
      Improved.Transitions.SHOWIN.run(animDiv,callback);
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      expect(callback).toHaveBeenCalledWith(animDiv);
      expect(callback.mostRecentCall.object).toBe(Improved.Transitions.SHOWIN);
    });
  });

  it('can show out', function() {
    var callback = jasmine.createSpy('callback');
    runs(function() {
      Improved.Transitions.SHOWOUT.run(animDiv,callback);
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      expect(callback).toHaveBeenCalledWith(animDiv);
      expect(callback.mostRecentCall.object).toBe(Improved.Transitions.SHOWOUT);
    });
  });

  it('can fade in', function() {
    var callback = jasmine.createSpy('callback');
    runs(function() {
      Improved.Transitions.FADEIN.run(animDiv,callback);
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      expect(callback).toHaveBeenCalledWith(animDiv);
      expect(callback.mostRecentCall.object).toBe(Improved.Transitions.FADEIN);
    });
  });

  it('can fade out', function() {
    var callback = jasmine.createSpy('callback');
    runs(function() {
      Improved.Transitions.FADEOUT.run(animDiv,callback);
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      expect(callback).toHaveBeenCalledWith(animDiv);
      expect(callback.mostRecentCall.object).toBe(Improved.Transitions.FADEOUT);
      animDiv.setOpacity(1);
    });
  });

  it('can fade in/out', function() {
    var callback = jasmine.createSpy('callback');
    runs(function() {
      Improved.Transitions.FADEINOUT.run(animDiv,callback);
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      expect(callback).toHaveBeenCalledWith(animDiv);
      expect(callback.mostRecentCall.object).toBe(Improved.Transitions.FADEINOUT);
      animDiv.setOpacity(1);
    });
  });

  it('can pop in', function() {
    var callback = jasmine.createSpy('callback');
    runs(function() {
      Improved.Transitions.POPIN.run(animDiv,callback);
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      expect(callback).toHaveBeenCalledWith(animDiv);
      expect(callback.mostRecentCall.object).toBe(Improved.Transitions.POPIN);
    });
  });

  it('can scale out', function() {
    var callback = jasmine.createSpy('callback');
    runs(function() {
      Improved.Transitions.SCALEOUT.run(animDiv,callback);
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      expect(callback).toHaveBeenCalledWith(animDiv);
      expect(callback.mostRecentCall.object).toBe(Improved.Transitions.SCALEOUT);
    });
  });

  xit('can fade in/out', function() {
    var callback = jasmine.createSpy('callback');
    runs(function() {
      Improved.Transitions.FADEINOUT.run(animDiv,callback);
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      expect(callback).toHaveBeenCalledWith(animDiv);
      expect(callback.mostRecentCall.object).toBe(Improved.Transitions.FADEINOUT);
    });
  });

  it('properly cancel animation', function() {
    var callback = jasmine.createSpy('callback');
    runs(function() {
      var fadeTo1 = new Improved.Transitions.FadeTo(1,'5s'), fadeTo0 = new Improved.Transitions.FadeTo(0.1,'5s');
      animDiv.observe('mouseover', function() { fadeTo0.run(animDiv) });
      animDiv.observe('mouseout', function() { fadeTo1.run(animDiv) });
      Improved.Transitions.FADEIN.run(animDiv);
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      animDiv.stopObserving();
    });
  })

  it('allow pixel animation', function() {
    var callback = jasmine.createSpy('callback');
    runs(function() {
      animDiv.setStyle({position:'relative'});
      Improved.Transitions.HSHIFT.run(animDiv,callback,500);
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      expect(callback).toHaveBeenCalledWith(animDiv);
      expect(callback.mostRecentCall.object).toBe(Improved.Transitions.HSHIFT);

      callback.reset();
      Improved.Transitions.HSIZE.run(animDiv,callback,500);
      window.testResult = undefined;
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      expect(callback).toHaveBeenCalledWith(animDiv);
      expect(callback.mostRecentCall.object).toBe(Improved.Transitions.HSIZE);
    });
  })

  it('just clean up after these tests', function() {
    $('testdiv').remove();
    jasmine.WaitsForBlock.TIMEOUT_INCREMENT = 10;
  });
});
