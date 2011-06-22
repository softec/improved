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

/** section: Language
 * class Number
 *
 *  Extensions to the built-in `Number` object.
 *
 *  Improved extends native JavaScript numbers in order to provide:
 *
 *  * [[ObjectRange]] compatibility, through [[Number#succ]].
 *  * Numerical loops with [[Number#times]].
 *  * Simple utility methods such as [[Number#toColorPart]] and
 *    [[Number#toPaddedString]].
 *  * Instance-method aliases of many functions in the `Math` namespace.
 *
**/
Object.extend(Number.prototype, (function() {
  /**
   *  Number#toColorPart() -> String
   *
   *  Produces a 2-digit hexadecimal representation of the number
   *  (which is therefore assumed to be in the \[0..255\] range, inclusive).
   *  Useful for composing CSS color strings.
   *
   *  ##### Example
   *
   *      10.toColorPart()
   *      // -> "0a"
  **/
  function toColorPart() {
    return this.toPaddedString(2, 16);
  }

  /**
   *  Number#succ() -> Number
   *
   *  Returns the successor of the current [[Number]], as defined by current + 1.
   *  Used to make numbers compatible with [[ObjectRange]].
  **/
  function succ() {
    return this + 1;
  }

  /**
   *  Number#times(iterator[,context]) -> Number
   *  - iterator (Function): An iterator function to call.
   *  - context (Object): An optional context (`this` value) to use when
   *    calling `iterator`.
   *
   *  Calls `iterator` the specified number of times, passing in a number as
   *  the first parameter. The number will be 0 on first call, 1 on second
   *  call, etc. `times` returns the number instance it was called on.
   *
   *  ##### Example
   *
   *      (3).times(alert);
   *      // -> Alerts "0", then "1", then "2"; returns 3
   *
   *      var obj = {count: 0, total: 0};
   *      function add(addend) {
   *        ++this.count;
   *        this.total += addend;
   *      }
   *      (4).times(add, obj);
   *      // -> 4
   *      obj.count;
   *      // -> 4
   *      obj.total;
   *      // -> 6 (e.g., 0 + 1 + 2 + 3)
  **/
  function times(iterator, context) {
    $R(0, this, true).each(iterator, context);
    return this;
  }

  /**
   *  Number#toPaddedString(length[, radix]) -> String
   *  - length (Number): The minimum length for the resulting string.
   *  - radix (Number): An optional radix for the string representation,
   *    defaults to 10 (decimal).
   *
   *  Returns a string representation of the number padded with leading 0s so
   *  that the string's length is at least equal to `length`. Takes an optional
   *  `radix` argument which specifies the base to use for conversion.
   *
   *  ##### Examples
   *
   *      (13).toPaddedString(4);
   *      // -> "0013"
   *
   *      (13).toPaddedString(2);
   *      // -> "13"
   *
   *      (13).toPaddedString(1);
   *      // -> "13"
   *
   *      (13).toPaddedString(4, 16)
   *      // -> "000d"
   *
   *      (13).toPaddedString(4, 2);
   *      // -> "1101"
  **/
  function toPaddedString(length, radix) {
    var string = this.toString(radix || 10);
    return '0'.times(length - string.length) + string;
  }

  /**
   *  Number#abs() -> Number
   *
   *  Returns the absolute value of the number. Convenience method that simply
   *  calls `Math.abs` on this instance and returns the result.
  **/
  function abs() {
    return Math.abs(this);
  }

  /**
   *  Number#round() -> Number
   *
   *  Rounds the number to the nearest integer. Convenience method that simply
   *  calls `Math.round` on this instance and returns the result.
  **/
  function round() {
    return Math.round(this);
  }

  /**
   *  Number#ceil() -> Number
   *
   *  Returns the smallest integer greater than or equal to the number.
   *  Convenience method that simply calls `Math.ceil` on this instance and
   *  returns the result.
  **/
  function ceil() {
    return Math.ceil(this);
  }

  /**
   *  Number#floor() -> Number
   *
   *  Returns the largest integer less than or equal to the number.
   *  Convenience method that simply calls `Math.floor` on this instance and
   *  returns the result.
  **/
  function floor() {
    return Math.floor(this);
  }

    /**
   * Returns this floating number rounded to the given precision
   * @param precision {number} Optional, defaults to 14
   * @return {number} the rounded number
   */
  function fround(precision) {
    precision = Object.isUndefined(precision) ? Math.DEFAULT_PRECISION : precision;
    return (precision && isFinite(this)) ? parseFloat(this.toPrecision(precision)) : this;
  }

  /**
   * Convert to signed Int32
   * @return {number} signed Int32 equivalent of this number
   */
  function toInt32() {
    return this >> 0;
  }

  /**
   * Convert to Unsigned Int32
   * @return {number} signed Int32 equivalent of this number
   */
  function toUInt32() {
    return this >>> 0;
  }

  /**
   * Wrap this number to fit in the given limits
   * @param min minimal limit
   * @param max maximal limit
   */
  function wrap(min,max) {
    if (this == Number.POSITIVE_INFINITY || this == Number.NEGATIVE_INFINITY) return min;
    if (this >= min && this <= max) return this.valueOf();
    var range = max - min;
    return (this % range + range - min) % range + min;
  }

  /**
   * Limit this number to fit in the given limits
   * @param min minimal limit
   * @param max maximal limit
   */
  function limit(min,max) {
    return Math.min(Math.max(this,min),max);
  }

  /**
   * Convert to CSS Style pixel value
   */
  function toCssPx() {
    if (this == 0) { return '0'; }
    return this.toFixed(2).replace(/\.?0+$/,'') + 'px';
  }

  /**
   * Convert to CSS Style em value
   */
  function toCssEm() {
    if (this == 0) { return '0'; }
    return this.toFixed(2).replace(/\.?0+$/,'') + 'em';
  }

  /**
   * Convert to CSS Style percent value
   */
  function toCssPc() {
    if (this == 0) { return '0'; }
    return this.toFixed(2).replace(/\.?0+$/,'') + '%';
  }

  /*
   * Unicode and SHA-1 functions inspired from:
   * SHA-1 implementation in JavaScript | (c) Chris Veness 2002-2010 | www.movable-type.co.uk
   */
  //
  // hexadecimal representation of a number
  //   (note toString(16) is implementation-dependant, and
  //   in IE returns signed numbers when used on full words)
  //
  function toHex32String() {
    var s="", v;
    for (var i=7; i>=0; i--) { v = (this>>>(i*4)) & 0xf; s += v.toString(16); }
    return s;
  }

  return {
    toColorPart:    toColorPart,
    succ:           succ,
    times:          times,
    toPaddedString: toPaddedString,
    abs:            abs,
    round:          round,
    ceil:           ceil,
    floor:          floor,
    fround:         fround,
    toInt32:        toInt32,
    toUInt32:       toUInt32,
    wrap:           wrap,
    limit:          limit,
    toCssPx:        toCssPx,
    toCssEm:        toCssEm,
    toCssPc:        toCssPc,
    toHex32String:  toHex32String
  };
})());
