/*
 * Copyright 2012 SOFTEC sa. All rights reserved.
 *
 * Work derived from:
 * # Spin.js
 * # Copyright (c) 2011 Felix Gnass [fgnass at neteye dot de]
 * # Licensed under the MIT license
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

var Improved = (function (Improved) {

  var ANIMATION_SUPPORTED = ('animation' in document.documentElement.style) ||
          (Improved.BrowserExtensions.jsPrefix + 'Animation' in document.documentElement.style),
      animations = {}, // Animation rules keyed by their name
      sheet, // Insert a new stylesheet to hold the @keyframe or VML rules.
      defaults = {
        lines: 12, // The number of lines to draw
        length: 7, // The length of each line
        width: 5, // The line thickness
        radius: 10, // The radius of the inner circle
        color: '#000', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 100, // Afterglow percentage
        opacity: 0.25,
        fps: 20
      },
      drawLines,
      changeOpacity;

  /**
   * Either create a stylesheet for animations or setup VML support for IE
   */
  function init() {
    if (drawLines) return; // do not run twice

    if (!ANIMATION_SUPPORTED && Improved.BrowserFeatures.addVMLSupport()) {
      drawLines = function(div, o) {
        var r = o.length+o.width,
            s = 2*r;

        function grp() {
          return Element.newVMLElement('group', {coordsize: s +' '+s, coordorigin: -r +' '+-r}).setStyle({width: s, height: s});
        }

        var g = grp(),
            margin = ~(o.length+o.radius+o.width)+'px',
            i;

        function seg(i, dx, filter) {
          g.insert(grp().setStyle({rotation: 360 / o.lines * i + 'deg', left: ~~dx})
            .insert(Element.newVMLElement('roundrect', {arcsize: 1}).setStyle({
                width: r,
                height: o.width,
                left: o.radius,
                top: -o.width>>1,
                filter: filter
              })
              .insert(Element.newVMLElement('fill', {color: o.color, opacity: o.opacity}))
              .insert(Element.newVMLElement('stroke', {opacity: 0})) // transparent stroke to fix color bleeding upon opacity change
            )
          );
        }

        if (o.shadow) {
          for (i = 1; i <= o.lines; i++) {
            seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)');
          }
        }
        for (i = 1; i <= o.lines; i++) {
          seg(i);
        }
        return div.setStyle({
          margin: margin + ' 0 0 ' + margin,
          zoom: 1
        }).insert(g).hide();
      };

      changeOpacity = function(div, i, val, o) {
        var c = div.firstChild;
        o = o.shadow && o.lines || 0;
        if (c && i+o < c.childNodes.length) {
          c = c.childNodes[i+o]; c = c && c.firstChild; c = c && c.firstChild;
          if (c) c.opacity = val;
        }
      };
    } else {
      if (!ANIMATION_SUPPORTED) {
        changeOpacity = function(div, i, val) {
          if (i < div.childNodes.length) div.childNodes[i].style.opacity = val;
        };
      } else {
        var el = new Element('style');
        $$('head')[0].insert(el);
        sheet = el.sheet || el.styleSheet;
      }

      drawLines = function(div, o) {
        var i = 0,
            seg;

        function fill(color, shadow) {
          return new Element('div').setStyle({
            position: 'absolute',
            width: (o.length+o.width) + 'px',
            height: o.width + 'px',
            background: color,
            boxShadow: shadow,
            transformOrigin: 'left',
            transform: 'rotate(' + ~~(360/o.lines*i) + 'deg) translate(' + o.radius+'px' +',0)',
            borderRadius: (o.width>>1) + 'px'
          });
        }
        for (; i < o.lines; i++) {
          seg = new Element('div').setStyle({
            position: 'absolute',
            top: 1+~(o.width/2) + 'px',
            transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
            opacity: o.opacity,
            animation: ANIMATION_SUPPORTED && addAnimation(o.opacity, o.trail, i, o.lines) + ' ' + 1/o.speed + 's linear infinite'
          });
          if (o.shadow) seg.insert(fill('#000', '0 0 4px ' + '#000').setStyle({top: 2+'px'}));
          div.insert(seg.insert(fill(o.color, '0 0 1px rgba(0,0,0,.1)')));
        }
        return div.hide();
      };
    }
  }

  /**
   * Creates an opacity keyframe animation rule and returns its name.
   * Since most mobile Webkits have timing issues with animation-delay,
   * we create separate rules for each line/segment.
   */
  function addAnimation(alpha, trail, i, lines) {
    var name = ['opacity', trail, ~~(alpha*100), i, lines].join('-'),
        start = 0.01 + i/lines*100,
        z = Math.max(1-(1-alpha)/trail*(100-start) , alpha),
        prefix = (Element._styleTranslations['animation']) ? Improved.BrowserExtensions.cssPrefix : '';

    if (!animations[name]) {
      sheet.insertRule(
          '@' + prefix + 'keyframes ' + name + '{' +
              '0%{opacity:'+z+'}' +
              start + '%{opacity:'+ alpha + '}' +
              (start+0.01) + '%{opacity:1}' +
              (start+trail)%100 + '%{opacity:'+ alpha + '}' +
              '100%{opacity:'+ z + '}' +
              '}', 0);
      animations[name] = 1;
    }
    return name;
  }

  /**
   * Return the animation function for animating browser that do not support animation
   */
  function getAnimation(o) {
    // No CSS animation support, use setTimeout() instead
    var i = 0,
        fps = o.fps,
        f = fps/o.speed,
        ostep = (1-o.opacity)/(f*o.trail / 100),
        astep = f/o.lines;
    return function() {
      i++;
      for (var s=o.lines; s; s--) {
        var alpha = Math.max(1-(i+s*astep)%f * ostep, o.opacity);
        changeOpacity(o.div, o.lines-s, alpha, o);
      }
      o.timeout = o.div && window.setTimeout(arguments.callee, ~~(1000/fps));
    };
  }

  function clear() {
    var div = this.div;
    if (div) {
      this.div = null;
      if (div.parentNode) div.remove();
    }
  }

  Improved.Spinner = Class.create({
    initialize: function(options) {
      init();
      Object.extend(Object.extend(Object.extend(this,defaults), this.defaults), options || {});

      if (this.target) {
        this.draw();
      }
    },

    defaults: Object.clone(defaults),

    draw: function(target) {
      this.clear();
      target = target || this.target;

      var div = this.div = new Element('div').setStyle({position: 'relative', display:'block'}),
          ep, // element position
          tp; // target position

      div.setAttribute('aria-role', 'progressbar');

      if (target) {
        target = $(target);
        target.insert({top: div});
        tp = target.cumulativeOffset();
        ep = div.cumulativeOffset();
        div.setStyle({
          left: ((target.offsetWidth >> 1) - ep.left+tp.left).toCssPx(),
          top: ((target.offsetHeight >> 1) - ep.top+tp.top).toCssPx()
        });
      }

      drawLines(div, this);
      return this;
    },

    clear: function() {
      this.stop();
      clear.call(this);
    },

    spin: function(target, delay) {
      this.stop();

      if (Object.isNumber(target)) {
        delay = target;
        target = null;
      }

      target = target || this.target;
      delay = (!Object.isUndefined(delay)) ? delay : this.delay;

      if (delay) {
        this.timeout = window.setTimeout(arguments.callee.bind(this,target,0),delay*1000);
        return this;
      } else {
        this.timeout = null;
      }

      if (!this.div || target !== this.target) {
        this.draw(target);
      }

      this.div.show();
      if (!ANIMATION_SUPPORTED) {
        (getAnimation(this))();
      }
      return this;
    },

    stop: function() {
      var div = this.div;
      if(this.timeout) {
        window.clearTimeout(this.timeout);
        this.timeout = null;
      }
      if (div) {
        if (div.parentNode !== this.target) {
          clear.call(this);
        } else {
          div.hide();
        }
      }
      return this;
    }
  });

  return Improved;
}(Improved || {}));
