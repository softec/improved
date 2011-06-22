/*
 * Copyright 2011 SOFTEC sa. All rights reserved.
 *
 * Work derived from:
 *  # Prototype JavaScript framework, version 1.6.1 and later
 *  # (c) 2005-2009 Sam Stephenson
 *  # Prototype is freely distributable under the terms of an MIT-style license.
 *  # For details, see the Prototype web site: http://www.prototypejs.org/
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

describe('String', function() {

  it('can compute SHA1 digest of a string', function() {
    expect('abc'.toSHA1()).toEqual('a9993e364706816aba3e25717850c26c9cd0d89d');
    expect('aébàc'.toSHA1()).toEqual('f4d9d254113a5295978d04e47132c2d5f2314a16');
  });

});
