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

  var DYNBUTTON_SUPPORTED = !Improved.Browser.IE,
      FlexImageButtonInstances = {}, FlexImageButtonUID = 0,
      cssTemplate1 = new Template(" \
.#{btn} {\
	padding: 0px #{hx};\
	position: relative;\
	text-align: left;\
	cursor: pointer;\
}\
\
.#{btn} *.ipd2s_btn {\
	background-image: url(#{bgimage});\
	background-repeat: no-repeat;\
	display: block;\
	position: relative;\
}\
\
.#{btn} i.ipd2s_btn { \
	background-position: top left;\
	margin-bottom: -#{y};\
	height: #{y};\
	top: -#{hy};\
	left: -#{xq};\
	width: #{xq};\
}\
\
.#{btn} span.ipd2s_btn {\
	background-position: bottom left;\
	margin-left: -#{xq};\
	padding: 0 0 #{y} #{xq};\
	text-align: center;\
	top: #{hy};\
}\
\
.#{btn} span.ipd2s_btn i.ipd2s_btn {\
	background-position: bottom right;\
	margin-top: -#{qy};\
	margin-left: 0px;\
	position: absolute;\
	top: #{qy};\
	left: 100%;\
	height: 100%;\
	width: #{xq};\
}\
\
.#{btn} span.ipd2s_btn span.ipd2s_btn { \
	background-position: top right;\
	margin-top: -#{yh};\
	margin-right: -#{xq};\
	padding: 0;\
	position: absolute;\
	right: 0px;\
	height: #{y};\
	width: 100%;\
}\
"), cssTemplate2 = new Template("\
.#{btn}:hover *.ipd2s_btn {\
	background-image: url(#{bgimage});\
}\
");

  Improved.FlexImageButton = Class.create({
    initialize: function(imgUrlUp, imgUrlDown, width, height) {
      var h = (imgUrlUp + '|' + imgUrlDown).toSHA1(false);

      if( FlexImageButtonInstances[h] ) return FlexImageButtonInstances[h];
      FlexImageButtonInstances[h] = this;

      this.className = 'ipd2s_btn' + FlexImageButtonUID++;

      if( !DYNBUTTON_SUPPORTED ) return;

      var qw = Math.floor(width/4),
          qh = Math.floor(height/4),
          cssText = cssTemplate1.evaluate({
                      btn: this.className,
                      bgimage: imgUrlUp,
                      qx: qw.toCssPx(),
                      hx: (qw*2).toCssPx(),
                      x: (qw*4).toCssPx(),
                      xq: (qw*5).toCssPx(),
                      xh: (qw*6).toCssPx(),
                      qy: qh.toCssPx(),
                      hy: (qh*2).toCssPx(),
                      y: (qh*4).toCssPx(),
                      yq: (qh*5).toCssPx(),
                      yh: (qh*6).toCssPx()
                    }),
          stylesheet = new Element('style', {type: 'text/css'});

      cssText += cssTemplate2.evaluate({
                      btn: this.className,
                      bgimage: imgUrlDown
                    });

      stylesheet.textContent = cssText;

      $$('head')[0].insert(stylesheet);
    },

    install: function(element) {
      if( !DYNBUTTON_SUPPORTED || element.className.include('ipd2s_btn')) return element;
      var span = new Element('span',{'class':'ipd2s_btn'}).update(element.innerHTML);
      span.insert({top:new Element('i',{'class':'ipd2s_btn'})}).insert({top:new Element('span',{'class':'ipd2s_btn'})});
      element.update(span).insert({top:new Element('i',{'class':'ipd2s_btn'})});
			return element.addClassName(this.className);
    },

    remove: function(element) {
      if( !DYNBUTTON_SUPPORTED || !element.hasClassName(this.className) ) return element;
      var span = element.down('span');
      span.down('i').remove();
      span.down('span').remove();
      element.removeClassName(this.className);
      return element.update(span.innerHTML);
    }
  });

  return Improved;
}(Improved || {}));
