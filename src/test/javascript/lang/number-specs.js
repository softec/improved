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

describe('Number', function()
{
  beforeEach(function() {
    this.addMatchers({
      toBeNaN: function() { return isNaN(this.actual); }
    });
  });

  it('can be rounded to precision, defaults is 14', function()
  {
    expect((123456).fround()).toEqual(123456);
    expect((1234.5678).fround()).toEqual(1234.5678);
    expect((123456789012345).fround()).toEqual(123456789012350);
    expect((1.23456789012345).fround()).toEqual(1.2345678901235);
    expect((123456789012345).fround(10)).toEqual(123456789000000);
    expect((1.234567890123456).fround(10)).toEqual(1.23456789);
    Math.DEFAULT_PRECISION = 10;
    expect((123456789012345).fround()).toEqual(123456789000000);
    expect((1.234567890123456).fround()).toEqual(1.23456789);
    Math.DEFAULT_PRECISION = 14;
  });

  it('can be converted to signed Int32', function()
  {
    expect((0x13579BDF).toInt32()).toEqual(0x13579BDF);
    expect((0x79BDF13579BDF).toInt32()).toEqual(0x13579BDF);
    expect((0xECA86421).toInt32()).toEqual(-324508639);
    expect((0x86421ECA86421).toInt32()).toEqual(-324508639);
  });

  it('can be converted to unsigned Int32', function()
  {
    expect((0x13579BDF).toUInt32()).toEqual(0x13579BDF);
    expect((0x79BDF13579BDF).toUInt32()).toEqual(0x13579BDF);
    expect((0xECA86421).toUInt32()).toEqual(0xECA86421);
    expect((0x86421ECA86421).toUInt32()).toEqual(0xECA86421);
  });

  it('can wrap numbers between limits', function()
  {
    expect((0).wrap(-180,180)).toEqual(0);
    expect((-180).wrap(-180,180)).toEqual(-180);
    expect((180).wrap(-180,180)).toEqual(180);
    expect((200).wrap(-180,180)).toEqual(-160);
    expect((380).wrap(-180,180)).toEqual(20);
    expect((560).wrap(-180,180)).toEqual(-160);
    expect((-200).wrap(-180,180)).toEqual(160);
    expect((-380).wrap(-180,180)).toEqual(-20);
    expect((-560).wrap(-180,180)).toEqual(160);
  });

  it('can limit numbers', function()
  {
    expect((0).limit(-180,180)).toEqual(0);
    expect((-180).limit(-180,180)).toEqual(-180);
    expect((180).limit(-180,180)).toEqual(180);
    expect((200).limit(-180,180)).toEqual(180);
    expect((380).limit(-180,180)).toEqual(180);
    expect((560).limit(-180,180)).toEqual(180);
    expect((-200).limit(-180,180)).toEqual(-180);
    expect((-380).limit(-180,180)).toEqual(-180);
    expect((-560).limit(-180,180)).toEqual(-180);
  });

  it('can convert to CSS value', function()
  {
    expect((10).toCssPx()).toEqual('10px');
    expect((10).toCssEm()).toEqual('10em');
    expect((10).toCssPc()).toEqual('10%');
    expect((0).toCssPx()).toEqual('0');
    expect((0).toCssEm()).toEqual('0');
    expect((0).toCssPc()).toEqual('0');
    expect((-10).toCssPx()).toEqual('-10px');
    expect((-10).toCssEm()).toEqual('-10em');
    expect((-10).toCssPc()).toEqual('-10%');
    expect((1.234).toCssPx()).toEqual('1.23px');
    expect((1.234).toCssEm()).toEqual('1.23em');
    expect((1.234).toCssPc()).toEqual('1.23%');
    expect((1.2).toCssPx()).toEqual('1.2px');
    expect((1.2).toCssEm()).toEqual('1.2em');
    expect((1.2).toCssPc()).toEqual('1.2%');
  });
});
