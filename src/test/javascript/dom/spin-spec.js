/*
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */

xdescribe('Spinner', function ()
{
  var testDiv, spinDiv, spinner;

  beforeEach(function() {
    window.testResult = undefined;
    if( testDiv ) {
      testDiv.firstDescendant().text('It #{description}'.interpolate(this));
    }
  });

  it('is just the initialisation of an html DOM for the rest of these tests', function() {
    $$('body')[0].insert({top:
        ("<div id='testdiv' ><h2>It is just the initialisation of an html DOM for the rest of these tests</h2>"
            +"<div id='spindiv' style='background-color: cyan; width: 100px; height: 100px;'></div>")
            +"<div><button onclick='window.testResult=true'>Passed</button><button onclick='window.testResult=false'>Failed</button></div>"});
    window.testResult = undefined;
    testDiv = $('testdiv');
    spinDiv = $('spindiv');
    jasmine.WaitsForBlock.TIMEOUT_INCREMENT = 1000;
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
  });

  it('can be started', function ()
  {
    runs(function() {
      spinner = new Improved.Spinner().spin(spinDiv);
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
    });
  });

  it('can be stopped', function ()
  {
    runs(function() {
      spinner.stop();
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
    });
  });

  it('can be started then displayed', function ()
  {
    runs(function() {
      spinner = new Improved.Spinner().spin();
      spinDiv.insert(spinner.div.setStyle({top: (spinDiv.offsetHeight >> 1).toCssPx(), left: (spinDiv.offsetWidth >> 1).toCssPx()}));
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      spinner.stop();
    });
  });

  it('can be started delayed', function ()
  {
    runs(function() {
      spinner = new Improved.Spinner().spin(spinDiv, 1);
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      spinner.stop();
    });
  });

  it('can be started delayed from options', function ()
  {
    runs(function() {
      spinner = new Improved.Spinner({target: spinDiv, delay: 1}).spin();
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      spinner.stop();
    });
  });

  it('can be started delayed and stopped early', function ()
  {
    runs(function() {
      spinner = new Improved.Spinner().spin(spinDiv, 1).stop();
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
    });
  });

  it('can be customized at construction time', function ()
  {
    runs(function() {
      spinner = new Improved.Spinner({
        lines: 16, // The number of lines to draw
        length: 10, // The length of each line
        width: 10, // The line thickness
        radius: 15, // The radius of the inner circle
        color: '#00F', // #rgb or #rrggbb
        speed: 1.5, // Rounds per second
        trail: 50, // Afterglow percentage
        opacity: 0.5,
        fps: 10
      }).spin(spinDiv);
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      spinner.stop();
    });
  });

  it('can be customized later', function ()
  {
    runs(function() {
      Object.extend(spinner, {
        lines: 8, // The number of lines to draw
        length: 3, // The length of each line
        width: 2, // The line thickness
        radius: 5, // The radius of the inner circle
        color: '#F00', // #rgb or #rrggbb
        speed: 0.5, // Rounds per second
        trail: 25, // Afterglow percentage
        opacity: 0.1,
        fps: 15
      }).spin(spinDiv);
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      spinner.stop();
    });
  });

  it('can be shadowed', function ()
  {
    runs(function() {
      spinner = new Improved.Spinner({shadow: true}).spin(spinDiv);
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      spinner.stop();
    });
  });

  it('can be hardware accelerated', function ()
  {
    runs(function() {
      spinner = new Improved.Spinner({hwaccel: true}).spin(spinDiv);
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      spinner.stop();
    });
  });

  it('can be drawn from option than started', function ()
  {
    runs(function() {
      spinner = new Improved.Spinner({target: spinDiv, delay:1});
      spinner.spin();
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      spinner.stop();
      expect(spinDiv.firstChild).toEqual(spinner.div);
    });
  });

  it('can be started again', function ()
  {
    runs(function() {
      spinner.spin();
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      spinner.stop();
    });
  });

  it('can be remove and restarted', function ()
  {
    runs(function() {
      spinner.clear();
      expect(spinDiv.firstChild).not.toEqual(spinner.div);
      spinner.spin();
    });
    waitsFor(function() { return !Object.isUndefined(window.testResult) }, "Wait for test results", Number.POSITIVE_INFINITY);
    runs(function() {
      expect(window.testResult).toBeTruthy();
      spinner.stop();
      expect(spinDiv.firstChild).toEqual(spinner.div);
    });
  });

  it('just clean up after these tests', function() {
    $('testdiv').remove();
    jasmine.WaitsForBlock.TIMEOUT_INCREMENT = 10;
  });
});
