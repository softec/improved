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

describe('Element', function()
{

  beforeEach(function() {
    $$('body')[0].insert('<div id="testdiv"><span>test</span></div>');
  });

  afterEach(function() {
    $('testdiv').remove();    
  });

  it('can get inner text of an element using Element', function()
  {
    expect(Element.text('testdiv')).toEqual('test');
  });

  it('can get inner text of an element using extended dom element', function()
  {
    expect($('testdiv').text()).toEqual('test');
  });

  it('can set inner text of an element using Element', function()
  {
    var testdiv = $('testdiv');
    expect(Element.text(testdiv,'settest')).toBe(testdiv);
    expect(Element.text(testdiv)).toEqual('settest');
    expect(Element.text(testdiv,'testset')).toBe(testdiv);
    expect(Element.text(testdiv)).toEqual('testset');
    expect(Element.text(testdiv,'<b>tagtest</b>')).toBe(testdiv);
    expect(Element.text(testdiv)).toEqual('<b>tagtest</b>');    
  });

  it('can set inner text of an element using extended dom element', function()
  {
    var testdiv = $('testdiv');
    expect(testdiv.text('settest')).toBe(testdiv);
    expect(testdiv.text()).toEqual('settest');
    expect(testdiv.text('testset')).toBe(testdiv);
    expect(testdiv.text()).toEqual('testset');
    expect(testdiv.text('<b>tagtest</b>')).toBe(testdiv);
    expect(testdiv.text()).toEqual('<b>tagtest</b>');
  });

  xit('can remove styles', function()
  {
    var testdiv = $('testdiv');

    testdiv.setStyle({backgroundColor: 'red'});
    expect(testdiv.getStyle('backgroundColor')).toEqual('red');
    testdiv.removeStyle('backgroundColor');
    expect(testdiv.getStyle('backgroundColor')).not.toEqual('red');

    testdiv.setStyle({backgroundColor: 'red'});
    testdiv.removeStyle(['backgroundColor']);
    expect(testdiv.getStyle('backgroundColor')).not.toEqual('red');

    testdiv.setStyle({backgroundColor: 'red'});
    testdiv.setStyle({backgroundColor: null});
    expect(testdiv.getStyle('backgroundColor')).not.toEqual('red');

    testdiv.setStyle({backgroundColor: 'red'});
    testdiv.setStyle({backgroundColor: undefined});
    expect(testdiv.getStyle('backgroundColor')).not.toEqual('red');

    testdiv.setStyle({transitionDuration: '10s'});
    expect(testdiv.getStyle('transitionDuration')).toEqual('10s');
    testdiv.removeStyle('transitionDuration');
    expect(testdiv.getStyle('transitionDuration')).not.toEqual('10s');

    testdiv.setStyle({transitionDuration: '10s'});
    testdiv.removeStyle(['transitionDuration']);
    expect(testdiv.getStyle('transitionDuration')).not.toEqual('10s');

    testdiv.setStyle({transitionDuration: '10s'});
    testdiv.setStyle({transitionDuration: null});
    expect(testdiv.getStyle('transitionDuration')).not.toEqual('10s');

    testdiv.setStyle({transitionDuration: '10s'});
    testdiv.setStyle({transitionDuration: undefined});
    expect(testdiv.getStyle('transitionDuration')).not.toEqual('10s');
  });
});
