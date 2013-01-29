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

var Improved = (function (Improved) {

  var TRANSITION_SUPPORTED = ('transition' in document.documentElement.style) ||
                             (Improved.BrowserExtensions.jsPrefix + 'Transition' in document.documentElement.style),
      clearTimeout = window.clearTimeout,
      clearInterval = window.clearInterval;

  function getAnims(create) {
    return (this.__ipd2anim || ((create) ? (this.__ipd2anim = {}) : null));
  }

  if( Improved.Browser.IE && Improved.Browser.IEVersion < 9 ) {
    clearTimeout = function(handler) {
                    window.clearTimeout(handler);
                  };
    clearInterval = function(handler) {
                      window.clearInterval(handler);
                    };
  }

  function unregister(property) {
    var anims = getAnims.call(this), canceller;
    if( anims && (canceller = anims[property]) ) {
      canceller();
      delete anims[property];
      for(property in anims) {
        if( anims[property] == canceller ) {
          delete anims[property];
        }
      }
    }
  }

  function register(canceller, property) {
    unregister.call(this, property);
    getAnims.call(this,true)[property] = canceller;
  }

  function setStyle(element, property, value) {
    var style = {};
    style[property] = value;
    return element.setStyle(style);
  }

  Improved.Transition = Class.create({
    initialize: function(duration, delay, timing) {
      this.duration = duration || '500ms';
      this.delay = delay || 0;
      this.timing = timing || 'ease';
      this.bindfct = Function.bind.curry(this);
      delay = parseFloat(this.delay);
      if (delay) {
        if (this.delay.indexOf('ms') == -1) delay *= 1000;
        this.delay = delay;
        this.delayfct = Function.delay.curry(delay/1000);
      }
      if (!this.isSupported) {
        duration = parseInt(this.duration);
        if (duration) {
          if (this.duration.indexOf('ms') == -1) duration *= 1000;
          this.duration = duration;
        }
      }
    },

    isSupported: TRANSITION_SUPPORTED,
    isEmulated: false,

    register: function(element, canceller) {
      if( Object.isArray(this.property) ) {
        this.property.each(register.bind(element, canceller));
      } else register.call(element, canceller, this.property);
      return element;
    },

    unregister: function(element) {
      if( Object.isArray(this.property) ) {
        this.property.each(unregister.bind(element));
      } else unregister.call(element,this.property);
      return element;
    },

    easing: function(frame){
      return (-Math.cos(frame*Math.PI)/2) + 0.5;
    },

    animator: function(pos,element) {

    },

    getAnimationBase: function(element) {

    },

    animate: function(element) {
      var handler;

      if( this.isSupported ) {
        handler = this.bindfct.apply(this.finish, arguments);
        element.observe('transitionend', handler, true);
        return this.register(element, Element.stopObserving.curry(element,'transitionend',handler));
      }

      var args = arguments,
          startTime = (new Date).getTime(),
          endTime = startTime + this.duration,
          baseValue = this.getAnimationBase(element);
      handler = window.setInterval(function() {
          var curTime = (new Date).getTime(), frame = curTime >= endTime ? 1 : (curTime - startTime) / this.duration;
          this.animator.curry(this.easing(frame),baseValue).apply(this, args);
          if(curTime >= endTime) {
            this.finish.apply(this, args);
        }
      }.bind(this), 10)

      return this.register(element, clearInterval.curry(handler));
    },

    install: function(element) {
      if (!this.isSupported) return element;
      var style = {
            transitionDuration: this.duration,
            transitionDelay: 0,
            transitionTimingFunction: this.timing
          }, 
          handler = this.bindfct.apply(this.finish, arguments);
      element.setStyle(style).observe('transitionend', handler, true);
      return this.register(element, Element.stopObserving.curry(element,'transitionend',handler));
    },

    start: function(element) {
      var startFunc = ((this.isSupported || this.isEmulated) ? this.animate : this.finish), handler;
      if ( !this.delayfct) return startFunc.apply(this, arguments);
      handler = this.delayfct.apply(startFunc.bind(this), arguments);
      return this.register(element, clearTimeout.curry(handler));
    },

    run: function(element) {
      this.install.apply(this, arguments);
      return this.start.apply(this, arguments);
    },

    finish: function(element, callback) {
      this.unregister(element);
      if (this.isSupported)
        element.removeStyle(['transitionProperty','transitionDuration','transitionDelay','transitionTimingFunction']);
      if (Object.isFunction(callback)) callback.call(this, element);
      return element;
    }
  });

  var ShowIn = Class.create(Improved.Transition, {
        isSupported: false,
        isEmulated: true,
        animate: function(element) {
          element.show();
          this.finish.apply(this, arguments);
        }
      }),

      ShowOut = Class.create(Improved.Transition, {
        isSupported: false,
        isEmulated: true,
        animate: function(element) {
          element.hide();
          this.finish.apply(this, arguments);
        }
      }),

      FadeTo = Class.create(Improved.Transition, {
        property: 'opacity',

        initialize: function($super, opacity, duration, delay, timing) {
          $super(duration || '250ms', delay, timing);
          this.opacity = Object.isNumber(opacity) ? opacity : 1;
        },

        isEmulated: true,

        animate: function($super, element, callback, opacity) {
          opacity = Object.isNumber(opacity) ? opacity : this.opacity;
          $super(element, callback, opacity);
          if (!this.isSupported) return element;
          return element.setOpacity(opacity);
        },

        getAnimationBase: function(element) {
          return parseFloat(element.getOpacity());
        },

        animator: function(frame, base, element, callback, opacity) {
          element.setOpacity((base+(opacity-base)*frame).toFixed(3));
        },

        install: function($super, element, callback) {
          if (!this.isSupported) return element;
          return $super(element.setStyle({transitionProperty: 'opacity'}), callback);
        }
      }),

      FadeIn = Class.create(FadeTo, {
        property: 'opacity',

        initialize: function($super, opacity, duration, delay, timing) {
          $super(opacity, duration || '350ms', delay || '0.1ms', timing || 'ease-in');
        },

        install: function($super, element, callback) {
          if (!Element.visible(element)) element.setOpacity(0).show();
          return $super(element, callback);
        }
      }),

      FadeOut = Class.create(FadeTo, {
        property: 'opacity',

        initialize: function($super, duration, delay, timing) {
          $super(0, duration || '500ms', delay, timing || 'ease-out');
        },

        finish: function($super, element, callback) {
          return $super(element.hide(), callback).setOpacity(1);
        }
      }),

      transformTo = Class.create(Improved.Transition, {
        initialize: function($super, transform, value, duration, delay, timing) {
          $super(duration || '250ms', delay, timing);
          this.property = transform;
          this.value = value;
          this.re = new RegExp(transform + '\\(([^)]+)\\)');
        },

        isSupported: TRANSITION_SUPPORTED && !Improved.Browser.Gecko,
        isEmulated: (!Improved.Browser.IE || Improved.Browser.IEVersion > 8),

        addTransform: function(element, value, force) {
          var transform = element.getStyle('transform');
          if( transform.indexOf(this.property) == -1 )
            return element.setStyle({
                transform: ((transform == 'none') ? this.property+'('+value+')'
                                                : transform+' '+this.property+'('+value+')')
              });
          if( force )
            return this.setTransform(element, value);
        },

        setTransform: function(element, value) {
          return element.setStyle({
              transform: element.getStyle('transform').replace(this.re,this.property+'('+value+')')
            });
        },

        removeTransform: function(element) {
          return element.setStyle({
              transform: element.getStyle('transform').replace(this.re,'')
            });
        },

        getTransform: function(element) {
          return parseFloat(element.getStyle('transform').match(this.re)[1]);
        },

        animate: function($super, element, callback, value) {
          value = Object.isNumber(value) ? value : this.value;
          $super(element, callback, value);
          if (!this.isSupported) return element;
          return this.setTransform(element, value);
        },

        getAnimationBase: function(element) {
          return this.getTransform(element);
        },

        animator: function(frame, base, element, callback, scale) {
          this.setTransform(element, (base+(scale-base)*frame).toFixed(3));
        },

        install: function($super, element, callback) {
          if (this.isSupported || this.isEmulated) this.addTransform(element, 1);
          if (!this.isSupported) return element;
          return $super(element.setStyle({transitionProperty: 'transform'}), callback);
        }
      }),

      transformIn = Class.create(transformTo, {
        initialize: function($super, transform, value, duration, delay, timing) {
          $super(transform, value, duration || '250ms', delay || '0.1ms', timing || 'ease-in');
        },
        install: function($super, element, callback) {
          if (!Element.visible(element)
                  && (this.isSupported || this.isEmulated)) this.addTransform(element, 0, true).show();
          return $super(element, callback);
        },
        finish: function($super, element, callback, scale) {
          if( !this.isSupported && !this.isEmulated ) element.show();
          return $super(element, callback);
        }
      }),

      transformOut = Class.create(transformTo, {
        initialize: function($super, transform, value, duration, delay, timing) {
          $super(transform, value, duration || '250ms', delay, timing || 'ease-out');
        },
        finish: function($super, element, callback) {
          $super(element.hide(), callback);
          if( !this.isSupported && !this.isEmulated ) return element;
          return this.removeTransform(element);
        }
      }),

      ScaleTo = Class.create(transformTo, {
        initialize: function($super, scale, duration, delay, timing) {
          $super('scale', (Object.isNumber(scale) ? scale : 1), duration || '250ms', delay, timing);
        }
      }),

      ScaleIn = Class.create(transformIn, {
        initialize: function($super, scale, duration, delay, timing) {
          $super('scale', scale, duration || '250ms', delay || '0.1ms', timing || 'ease-in');
        }
      }),

      ScaleOut = Class.create(transformOut, {
        initialize: function($super, duration, delay, timing) {
          $super('scale', 0, duration || '500ms', delay, timing || 'ease-out');
        }
      }),

      PixelTo = Class.create(Improved.Transition, {
        initialize: function($super, property, value, duration, delay, timing) {
          $super(duration || '250ms', delay, timing);
          this.property = property;
          this.value = Object.isNumber(value) ? value : 0;
        },

        isEmulated: true,

        getAnimationBase: function(element) {
          return parseInt(element.getStyle(this.property));
        },

        animate: function($super, element, callback, value) {
          value = Object.isNumber(value) ? value : this.value;
          $super(element, callback, value);
          if (!this.isSupported) return element;
          return setStyle(element,this.property,value.toCssPx());
        },

        animator: function(frame, base, element, callback, value) {
          setStyle(element,this.property,Object.toInteger(base+(value-base)*frame).toCssPx());
        },

        install: function($super, element, callback) {
          if( isNaN(this.getAnimationBase(element)) ) setStyle(element,this.property,0);
          if (!this.isSupported) return element;
          return $super(element.setStyle({transitionProperty: this.property}), callback);
        }
      }),

      Multi = Class.create(Improved.Transition, {
        initialize: function() {
          this.transitions = arguments;
          this.property = this.transitions[0].property;
        },

        install: function(element, callback) {
          var args = [];
          args.push.apply(args,arguments);
          args[1] = function(element) {
              this.next(element, callback, 1);
            }.bind(this);
          return this.transitions[0].install.apply(this.transitions[0], args);
        },

        next: function(element, callback, index) {
          if( this.transitions[index] ) {
            this.transitions[index].run(element, function(element) {
              this.next(element, callback, index+1);
            }.bind(this));
          } else if (Object.isFunction(callback)) callback.call(this, element);
        },

        start: function(element, callback) {
          var args = [];
          args.push.apply(args,arguments);
          args[1] = function(element) {
              this.next(element, callback, 1);
            }.bind(this);
          return this.transitions[0].start.apply(this.transitions[0], args);
        },

        finish: function(element, callback) {
          //never used
        }
      });

  Improved.Transitions = {
    ShowIn: ShowIn,
    ShowOut: ShowOut,
    FadeTo: FadeTo,
    FadeIn: FadeIn,
    FadeOut: FadeOut,
    ScaleTo: ScaleTo,
    ScaleIn: ScaleIn,
    ScaleOut: ScaleOut,
    PixelTo: PixelTo,
    Multi: Multi,
    SHOWIN: new ShowIn(),
    SHOWOUT: new ShowOut(),
    FADEIN: new FadeIn(),
    FADEOUT: new FadeOut(),
    SCALEIN: new ScaleIn(),
    SCALEOUT: new ScaleOut(),
    VSHIFT: new PixelTo('top'),
    HSHIFT: new PixelTo('left'),
    VSIZE: new PixelTo('height'),
    HSIZE: new PixelTo('width'),
    POPIN: new Multi(new ScaleIn(1.2,'250ms',null,'ease-out'), new ScaleTo(0.95,'200ms',null,'linear'), new ScaleTo(1,'50ms',null,'ease-in'))
  };

  Object.extend(Improved.Transitions, {
    FADEINOUT: new Multi(Improved.Transitions.FADEIN, new FadeOut(null, '5s'))
  });

  return Improved;
}(Improved || {}));
