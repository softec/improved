Improved
=========

#### An object-oriented JavaScript framework ####

Improved is a JavaScript framework that aims to ease development of dynamic 
web applications.  It offers a familiar class-style OO framework, extensive
Ajax support, higher-order programming constructs, and easy DOM manipulation.
Improved has been derived from the Prototype Javascript Framework initiated
by Sam Stephenson.

### Targeted platforms ###

Improved is expected to work on any Javascript 1.2 compliant browser and
has been tested on the following platforms:

 * Chrome 6 and higher
 * Apple Safari 3 and higher
 * Mozilla Firefox 2 and higher
 * Microsoft Internet Explorer for Windows, version 6 and higher
 * Opera 10 and higher

Using Improved
---------------

To use Improved in your application, you may download the latest release
from our [Maven Repository](http://nexus.softec.lu:8081/service/local/repositories/opensource/content/lu/softec/js/improved/1.0/improved-1.0-compressed.jar)
and extract improved.js to a suitable location. Then include it
early in your HTML like so:

    <script type="text/javascript" src="/path/to/improved.js"></script>

You may also reference it directly in your maven build, when using
maven-javascript-plugin, using the following dependency:

    <dependency>
      <groupId>lu.softec.js</groupId>
      <artifactId>improved</artifactId>
      <version>1.0</version>
      <type>javascript</type>
      <scope>runtime</scope>
    </dependency>

### Building Improved from source ###

The build is based on Maven, using our modified maven-javascript-plugin.

Contributing to Improved
-------------------------

Fork our repository on GitHub and submit your pull request.

Documentation
-------------

The documentation has yet to be written

License
-------

Improved by [SOFTEC sa](http://softec.lu) is license under
a [GNU Lesser General Public License as published by the Free Software
Foundation; either version 2.1 of the License, or (at your option) any
later version.
If you need a different license, please [contact us](mailto:support@softec.lu)
with a description of your expect usage, and we will propose you an
appropriate agreement on a case by case basis.
