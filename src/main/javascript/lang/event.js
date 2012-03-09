/*
 * Copyright 2011 SOFTEC sa. All rights reserved.
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

(function () {

  var ImprovedEvent = {};

  function getEventRegistry(create) {
    return (this.__ipd2ev || ((create) ? (this.__ipd2ev = $H()) : null));
  }

  function deleteEventRegistry() {
    delete this.__ipd2ev;
  }

  function getEventResponders(eventName, create) {
    var registry = getEventRegistry.call(this,create);
    return ((registry && registry.get(eventName))
            || ((create) ? registry.set(eventName,[]) : null));
  }

  function getOnce(handler){
    return function(responder,eventName) {
      ImprovedEvent.removeListener(this, eventName, handler);
      return Function.bind.apply(responder,arguments)();
    }
  }

  ImprovedEvent.addListener = function(object, eventName, handler, once) {
    if( Object.isString(object) || Object.isElement(object) ) {
      return ImprovedEvent.observe(object, eventName, handler, once);
    }

    var responders = getEventResponders.call(object,eventName,true);

    for( var i=0, len=responders.length; i<len; i++ ) {
      if( responders[i].handler == handler ) return object;
    }

    var responder = handler;

    if(once) {
      responder = responder.wrap(getOnce(handler));
    }

    responder.handler = handler;
    responders.push(responder);

    return object;
  };

  ImprovedEvent.removeListener = function(object, eventName, handler) {
    if( Object.isString(object) || Object.isElement(object) ) {
      return ImprovedEvent.stopObserving(object, eventName, handler);
    }

    var registry = getEventRegistry.call(object);

    if( !registry ) return object;

    if( !eventName ) {
      deleteEventRegistry.call(object);
      return object;
    }

    var responders = registry.get(eventName);

    if( !responders ) return object;

    if( !handler ) {
      registry.unset(eventName);
      return object;
    }

    var i = responders.length, responder;
    while (i--) {
      if (responders[i].handler === handler) {
        break;
      }
    }

    if( i == -1 ) return object;

    responders.splice(i,1);
    return object;
  };

  ImprovedEvent.trigger = function(object, eventName) {
    if( Object.isString(object) || Object.isElement(object) ) {
      return ImprovedEvent.fire.apply(arguments);
    }

    var responders = getEventResponders.call(object,eventName,false);

    if( !responders ) return;
    responders = responders.clone();

    var i = responders.length, j = 0, responder;
    while (i-- && !Function.bind.apply(responders[j++],arguments)());
  };

  ImprovedEvent.triggerAsync = function(object, eventName) {
    if( Object.isString(object) || Object.isElement(object) ) {
      return ImprovedEvent.fire.apply(arguments);
    }

    var responders = getEventResponders.call(object,eventName,false);

    if( !responders ) return;
    responders = responders.clone();

    var i = responders.length, j = 0, responder;
    while (i--) Function.bind.apply(responders[j++],arguments).defer();
  };

  // Export to the global scope.
  try {
    Object.extend(Event, ImprovedEvent);
  } catch(e) {
    Event = ImprovedEvent;
  }
  
  function getBindings(create) {
    return (this.__ipd2bind || ((create) ? (this.__ipd2bind = {}) : null));
  }

  function addBindingEventListener(source, eventName, handler) {
    var binding = { source: source, eventName: eventName, handler: handler };
    if( source.addListener ) {
      var listener = source.addListener(eventName, handler);
      if( listener !== source ) {
        binding.listener = listener;
      }
    } else {
      ImprovedEvent.addListener(source, eventName, handler);
    }
    return binding;
  }

  function removeBindingEventListener(binding) {
    if( binding.source.removeListener ) {
      if( binding.listener ) {
        binding.source.removeListener(binding.listener);
      } else {
        binding.source.removeListener(binding.eventName, binding.handler);
      }
    } else {
      ImprovedEvent.removeListener(binding.source,binding.eventName,binding.handler);
    }
  }

  Object.extend(Object, {
    unbind: function(object, property) {
      var bindings = getBindings.call(object), binding;
      if( bindings && (binding = bindings[property]) ) {
        removeBindingEventListener(binding);
        delete bindings[property];
      }
    },

    unbindAll: function(object) {
      var bindings = getBindings.call(object);
      if( bindings ) {
        for(var property in bindings) {
          removeBindingEventListener(bindings[property]);
        }
        delete object.__ipd2bind;
      }
    },

    bindTo: function(object, property, source, sourceProps, noNotify) {
      sourceProps = sourceProps || property;
      var setterName = "set" + property.substring(0,1).toUpperCase() + property.substring(1),
          getterName = "get" + sourceProps.substring(0,1).toUpperCase() + sourceProps.substring(1),
          eventName = sourceProps + "_changed";

      Object.unbind(object,property);

      var setter = Object.isFunction(object[setterName]) ? object[setterName] : Object.getQuietSetter(property),
          getter = Object.isFunction(source[getterName]) ? source[getterName] : Object.getGetter(sourceProps),
          handler = function(){ setter.call(object,getter.call(source)) };

      getBindings.call(object,true)[property] = addBindingEventListener(source, eventName, handler);

      if( !noNotify ) {
        handler();
      }
    },

    getQuietSetter: function(property) {
      return function(value) {
        this[property] = value;
      };
    },

    getSetter: function(property,name) {
      var eventName = (name || property.replace(/^_*/,'')) + "_changed";
      return function(value) {
        if( !(value == this[property] || (value && Object.isFunction(value.equals) && value.equals(this[property]))) )
        {
          this[property] = value;
          if( this.trigger ) {
            this.trigger(eventName);
          } else {
            ImprovedEvent.trigger(this,eventName);
          }
        }
      };
    },

    getGetter: function(property) {
      return function() { return this[property]; };
    }
  });

  Object.extend(Object.Methods = Object.Methods || {}, {
    addListener:    ImprovedEvent.addListener.methodize(),
    removeListener: ImprovedEvent.removeListener.methodize(),
    triggerAsync:   ImprovedEvent.triggerAsync.methodize(),
    trigger:        ImprovedEvent.trigger.methodize(),
    unbind:         Object.unbind.methodize(),
    unbindAll:      Object.unbindAll.methodize(),
    bindTo:         Object.bindTo.methodize()
  });
})();
