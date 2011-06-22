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

Object.extend(Math, (function() {

  /**
   * Default precision used in float conversion to avoid
   * rounding issues in calculations
   */


  /**
   * Converts numeric degrees to radians
   * @param num {number} numeric in degrees to be converted
   * @return {number} numeric equivalent in radians
   */
  function rad(num) {
    return num * Math.PI / 180;
  }

  /**
   * Converts numeric radians to degrees
   * @param num {number} numeric in radians to be converted
   * @return {number} numeric equivalent in degrees
   */
  function deg(num) {
    return num * 180 / Math.PI;
  }

  return {
    DEFAULT_PRECISION: 14,
    rad:               rad,
    deg:               deg
  };
  
})());

