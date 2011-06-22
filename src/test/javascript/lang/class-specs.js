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

var classTests = function(debugLevel) {
  var klassType = (new Class.create()).functionName();

  beforeEach(function() {
    debug.setLevel(debugLevel);
  });

  afterEach(function() {
    debug.setLevel(5);
  });

  var Animal, Cat, Mouse, Sellable, Reproduceable, Plant, Dog, Ox, Alien, Gungans, Ankura;

  it('initialize fixtures', function() {
    Animal = Class.create('Animal', {
      initialize: function(name) {
        this.name = name;
      },
      name: "",
      eat: function() {
        return this.say("Yum!");
      },
      say: function(message) {
        return this.name + ": " + message;
      }
    });

  // subclass that augments a method
    Cat = Class.create('Cat', Animal, {
      eat: function($super, food) {
        if (food instanceof Mouse) return $super();
        else return this.say("Yuk! I only eat mice.");
      }
    });

  // empty subclass
    Mouse = Class.create('Mouse', Animal, {});

  // namespaced class
    Gonzales = Class.create('Mouse.Gonzales', Mouse, {});


  //mixins
    Sellable = {
      getValue: function(pricePerKilo) {
        return this.weight * pricePerKilo;
      },

      inspect: function() {
        return '#<Sellable: #{weight}kg>'.interpolate(this);
      }
    };

    Reproduceable = {
      reproduce: function(partner) {
        if (partner.constructor != this.constructor || partner.sex == this.sex)
          return null;
        var weight = this.weight / 10, sex = Math.random(1).round() ? 'male' : 'female';
        return new this.constructor('baby', weight, sex);
      }
    };

    // base class with mixin
    Plant = Class.create(Sellable, {
      initialize: function(name, weight) {
        this.name = name;
        this.weight = weight;
      },

      inspect: function() {
        return '#<Plant: #{name}>'.interpolate(this);
      }
    });

    // subclass with mixin
    Dog = Class.create(Animal, Reproduceable, {
      initialize: function($super, name, weight, sex) {
        this.weight = weight;
        this.sex = sex;
        $super(name);
      }
    });

    // subclass with mixins
    Ox = Class.create(Animal, Sellable, Reproduceable, {
      initialize: function($super, name, weight, sex) {
        this.weight = weight;
        this.sex = sex;
        $super(name);
      },

      eat: function(food) {
        if (food instanceof Plant)
          this.weight += food.weight;
      },

      inspect: function() {
        return '#<Ox: #{name}>'.interpolate(this);
      }
    });

    // External base class
    Alien = function(name) { this.name = name; };
    Alien.prototype.eat = function() {
        return this.say("Slurp!");
    };
    Alien.prototype.say = function(message) {
        return this.name + ": " + message;
    };

    // Derived class from external base class
    Gungans = Class.create(Alien, {
      initialize: function($super, firstname, lastname) {
        if( lastname ) {
          $super(firstname + ' ' + firstname + ' ' + lastname);
        } else {
          $super(firstname);
        }
      },
      eat: function($super, food) {
        if (food instanceof Mouse) return this.say("Beurk! I dislike eating mice.");
        else return $super();
      },
      say: function($super, message) {
        return $super(message) + ' (translated)';
      },
      sleep: function() {
        return this.say('ZZZ');
      }
    });

    // Derived class from derived class from external base class
    Ankura = Class.create(Gungans, {
      initialize: function($super, name) {
        $super(name);
      }
    });
  });

  it('can create a new Classes', function() {
    expect(Object.isFunction(Animal)).toBeTruthy();
    expect(Animal.subclasses).toEqual([Cat, Mouse, Dog, Ox]);
    Animal.subclasses.each(function(subclass) {
      expect(subclass.superclass).toEqual(Animal);
    });

    var Bird = Class.create(Animal);
    expect(Animal.subclasses.last()).toBe(Bird);
    var tweety = new Bird;
    // for..in loop (for some reason) doesn't iterate over the constructor property in top-level classes
    expect(Object.keys(tweety).without('constructor').sort()).toEqual(Object.keys(new Animal).sort());
    if( Class.Methods.addMethods.name === 'addMethods' ) {
      expect(Object.keys(tweety).without('constructor').sort()
          .select(function(m){return Object.isFunction(tweety[m]) })
          .collect(function(m){return tweety[m].methodName })).toEqual(Object.keys(new Bird).without('constructor','name').sort());
    }
  });

  it('can instanciate Classes', function() {
    var pet = new Animal("Nibbles");
    expect(pet.name).toEqual("Nibbles"); // property not initialized
    expect(pet.say('Hi!')).toEqual('Nibbles: Hi!');
    expect(pet.constructor).toBe(Animal); // bad constructor reference
    expect(pet.superclass).not.toBeDefined();

    var Empty = Class.create();
    expect(typeof new Empty).toEqual('object');
  });

  it('support inheritance', function() {
    var tom = new Cat('Tom');
    expect(tom.constructor).toBe(Cat); // bad constructor reference
    expect(tom.constructor.superclass).toBe(Animal); // bad superclass reference
    expect(tom.name).toEqual('Tom');
    expect(tom.say('meow')).toEqual('Tom: meow');
    expect(tom.eat(new Animal)).toEqual('Tom: Yuk! I only eat mice.');
  });
  
  it('allow call to superclass using $super', function() {
    var tom = new Cat('Tom');
    expect(tom.eat(new Mouse)).toEqual('Tom: Yum!');

    // augment the constructor and test
    var Dodo = Class.create(Animal, {
      initialize: function($super, name) {
        $super(name);
        this.extinct = true;
      },

      say: function($super, message) {
        return $super(message) + " honk honk";
      }
    });

    var gonzo = new Dodo('Gonzo');
    expect(gonzo.name).toEqual('Gonzo');
    expect(gonzo.extinct).toBeTruthy(); // Dodo birds should be extinct
    expect(gonzo.say("hello")).toEqual("Gonzo: hello honk honk");
  });

  it('also works with an base class not based on prototype', function() {
    expect(Alien.subclasses).not.toBeDefined();
    expect(Gungans.subclasses).toEqual([Ankura]);
    Gungans.subclasses.each(function(subclass) {
      expect(subclass.superclass).toEqual(Gungans);
    });
    expect(Gungans.superclass).toBe(Alien);

    var GurgansSpecies = Class.create(Gungans);
    expect(Gungans.subclasses.last()).toBe(GurgansSpecies);
    // for..in loop (for some reason) doesn't iterate over the constructor property in top-level classes
    expect(Object.keys(new GurgansSpecies).sort()).toEqual(Object.keys(new Gungans).sort());
    expect(Object.keys(new GurgansSpecies).without('constructor','sleep','initialize').sort()).toEqual(Object.keys(new Alien).sort());

    var JarJar = new Gungans('Jar','Binks');
    expect(JarJar.name).toEqual("Jar Jar Binks"); // property not initialized
    expect(JarJar.constructor).toBe(Gungans); // bad constructor reference
    expect(JarJar.superclass).not.toBeDefined();
    expect(JarJar.say('Hi!')).toEqual('Jar Jar Binks: Hi! (translated)');
    expect(JarJar.eat(new Mouse())).toEqual('Jar Jar Binks: Beurk! I dislike eating mice. (translated)');
    expect(JarJar.eat(new Cat())).toEqual('Jar Jar Binks: Slurp! (translated)');
    expect(JarJar.sleep()).toEqual('Jar Jar Binks: ZZZ (translated)');

    var BossNass = new Ankura('Boss Nass');
    expect(BossNass.name).toEqual("Boss Nass"); // property not initialized
    expect(BossNass.constructor).toBe(Ankura); // bad constructor reference
    expect(BossNass.say('Hello!')).toEqual('Boss Nass: Hello! (translated)');
    expect(BossNass.eat(new Mouse())).toEqual('Boss Nass: Beurk! I dislike eating mice. (translated)');
    expect(BossNass.eat(new Cat())).toEqual('Boss Nass: Slurp! (translated)');
    expect(BossNass.sleep()).toEqual('Boss Nass: ZZZ (translated)');
  });

  it('can add new methods to existing class', function() {
    var tom   = new Cat('Tom');
    var jerry = new Mouse('Jerry');

    Animal.addMethods({
      sleep: function() {
        return this.say('ZZZ');
      }
    });

    Mouse.addMethods({
      sleep: function($super) {
        return $super() + " ... no, can't sleep! Gotta steal cheese!";
      },
      escape: function(cat) {
        return this.say('(from a mousehole) Take that, ' + cat.name + '!');
      }
    });

    expect(tom.sleep()).toEqual('Tom: ZZZ'); // added instance method not available to subclass
    expect(jerry.sleep()).toEqual("Jerry: ZZZ ... no, can't sleep! Gotta steal cheese!");
    expect(jerry.escape(tom)).toEqual("Jerry: (from a mousehole) Take that, Tom!");
    // insure that a method has not propagated *up* the prototype chain:
    expect(tom.escape).not.toBeDefined();
    expect(new Animal().escape).not.toBeDefined();

    Animal.addMethods({
      sleep: function() {
        return this.say('zZzZ');
      }
    });

    expect(jerry.sleep()).toEqual("Jerry: zZzZ ... no, can't sleep! Gotta steal cheese!");
  });

  it('support mixin', function() {
    var grass = new Plant('grass', 3);
    expect(Object.isFunction(grass.getValue)).toBeTruthy();
    expect(grass.inspect()).toEqual('#<Plant: grass>');
  });

  it('support mixing in subclasses', function() {
    var snoopy = new Dog('Snoopy', 12, 'male');
    expect(Object.isFunction(snoopy.reproduce)).toBeTruthy();
  });
  
  it('support multiple mixins', function() {
    var cow = new Ox('cow', 400, 'female');
    expect(cow.inspect()).toEqual('#<Ox: cow>');
    expect(Object.isFunction(cow.reproduce)).toBeTruthy();
    expect(Object.isFunction(cow.getValue)).toBeTruthy();
  });

  it('support overwriting and inheriting methods toString and valueOf', function() {
    var Foo = Class.create({
      toString: function() { return "toString" },
      valueOf: function() { return "valueOf" }
    });

    var Bar = Class.create(Foo, {
      valueOf: function() { return "myValueOf" }
    });

    var Parent = Class.create({
      m1: function(){ return 'm1' },
      m2: function(){ return 'm2' }
    });
    var Child = Class.create(Parent, {
      m1: function($super) { return 'm1 child' },
      m2: function($super) { return 'm2 child' }
    });

    expect(new Child().m1.toString().indexOf('m1 child')).toBeGreaterThan(-1);

    expect(new Foo().toString()).toEqual("toString");
    expect(new Foo().valueOf()).toEqual("valueOf");
    expect(new Bar().toString()).toEqual("toString");
    expect(new Bar().valueOf()).toEqual("myValueOf");
  });

  it('support constructors that returns an object', function() {
    var Foo = Class.create(Animal,{
      initialize: function() {
        return new Animal('foo');
      }
    });

    var foo = new Foo;
    expect(foo.name).toEqual("foo"); // property not initialized
    expect(foo.say('Hi!')).toEqual('foo: Hi!');
    expect(foo.constructor).toBe(Animal); // bad constructor reference
    expect(foo.superclass).not.toBeDefined();

  });

  it('support constructors that returns an external object', function() {
    var Foo = Class.create(TypeError,{
      initialize: function() {
        return new TypeError('foo');
      }
    });

    var foo = new Foo;
    expect(foo.message).toEqual("foo"); // property not initialized
    expect(foo.constructor).toBe(TypeError); // bad constructor reference
  });

  if( klassType === 'klass' ) {
    it('support naming klass for easier debugging', function() {
      var tom   = new Cat('Tom');
      var jerry = new Mouse('Jerry');
      var speedy = new Gonzales('Speedy');

      expect(Object.getTypeName(tom)).toEqual('Cat');
      expect(Object.getTypeFQName(tom)).toEqual('Cat');
      expect(Object.getTypeName(jerry)).toEqual('Mouse');
      expect(Object.getTypeFQName(jerry)).toEqual('Mouse');
      expect(Object.getTypeName(speedy)).toEqual('Gonzales');
      expect(Object.getTypeFQName(speedy)).toEqual('Mouse.Gonzales');
      expect(tom.constructor.superclass.functionName()).toEqual('Animal');
      expect(jerry.constructor.superclass.functionName()).toEqual('Animal');
      expect(speedy.constructor.superclass.functionName()).toEqual('Mouse');
    });
  }
}

describe('Class', function() { classTests(5) });
describe('Class (debug)', function() { classTests(6) });

