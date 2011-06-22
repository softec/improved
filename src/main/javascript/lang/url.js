/*
 * Copyright 2011 SOFTEC sa. All rights reserved.
 *
 * Work inspired from Closure Library goog.uri.utils
 * # Copyright 2008 The Closure Library Authors. All Rights Reserved.
 * # Licensed under the Apache License, Version 2.0
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

Object.extend(String.prototype, (function() {
  var urlSplitRe = new RegExp(          
        '^' +
        '(?:' +
          '([^:/?#.]+)' +                     // scheme - ignore special characters
                                              // used by other URL parts such as :,
                                              // ?, /, #, and .
        ':)?' +
        '(?://' +
          '(?:([^/?#]*)@)?' +                 // userInfo
          '([\\w\\d\\-\\u0100-\\uffff.%]*)' + // domain - restrict to letters,
                                              // digits, dashes, dots, percent
                                              // escapes, and unicode characters.
          '(?::([0-9]+))?' +                  // port
        ')?' +
        '([^?#]+)?' +                         // path
        '(?:\\?([^#]*))?' +                   // query
        '(?:#(.*))?' +                        // fragment
        '$'),
      urlPartIndex = {
        scheme: 1,
        userInfo: 2,
        domain: 3,
        port: 4,
        path: 5,
        queryString: 6,
        fragment: 7
      };

  function matchURL(url) {
    url = url.strip();
    return url.match(urlSplitRe) || [];
  }

  Object.toURL = function(urlParts) {
    var out = [];

    if (urlParts.scheme) {
      out.push(urlParts.scheme, ':');
    }
    if (urlParts.domain) {
      out.push('//');
      if (urlParts.userInfo) {
        out.push(urlParts.userInfo, '@');
      }
      out.push(urlParts.domain);
      if (urlParts.port) {
        out.push(':', urlParts.port);
      }
    }
    if (urlParts.path) {
      out.push(urlParts.path);
    }
    if (urlParts.queryString) {
      out.push('?', urlParts.queryString);
    }
    if (urlParts.fragment) {
      out.push('#', urlParts.fragment);
    }
    return out.join('');
  };

  function parseURL() {
    var parts = matchURL(this), result = {}, v;
    if( !parts ) return null;
    for(var part in urlPartIndex) {
      v = parts[urlPartIndex[part]];
      if( v ) result[part] = parts[urlPartIndex[part]];
    }
    return result;
  }

  function urlScheme() {
    return matchURL(this)[urlPartIndex.scheme];
  }

  function urlUserInfo() {
    return matchURL(this)[urlPartIndex.userInfo];
  }

  function urlDomain() {
    return matchURL(this)[urlPartIndex.domain];
  }

  function urlPort() {
    return matchURL(this)[urlPartIndex.port];
  }

  function urlPath() {
    return matchURL(this)[urlPartIndex.path];
  }

  function urlQueryString() {
    return matchURL(this)[urlPartIndex.queryString];
  }

  function urlFragment() {
    return matchURL(this)[urlPartIndex.fragment];
  }

  function toRelativeURL(absolute) {
    if( !absolute ) return this;
    var parts = parseURL.call(this), absParts = parseURL.call(absolute);
    if( parts == {} || absParts == {} ) return this;

    if( (parts.scheme && (parts.scheme != absParts.scheme))
        || (parts.userInfo && (parts.userInfo != absParts.userInfo))
        || (parts.domain && (parts.domain != absParts.domain))
        || (parts.port && (parts.port != absParts.port)) ) {
      return this;
    }

    parts.scheme = parts.userInfo = parts.domain = parts.port = null;

    var basePath = absParts.path || '/',
        path = parts.path,
        ls = basePath.lastIndexOf('/');

    if( basePath != path ) {
      path = ((path == '') ? '/' : path).split('/');
      basePath = basePath.substring(0,ls).split('/');

      if( basePath[0] != '' ) return this;
      if( path[0] == '' ) {
        var i = 0, bl = basePath.length, pl = path.length, s, l, p = [];

        for (; i<bl; i++) {
          if (i >= pl || basePath[i] != path[i]) {
            s = i;
            break;
          }
        }
        if( !s ) s = bl;

        for (i=0, l=bl-s; i<l; i++) p.push('..','/');
        if( i<pl && p.length ) p.pop();
        for (i=s; i<pl; i++) p.push("/",path[i]);
        if( s == bl ) p.shift();

        parts.path = (p.length == 0 && parts.path != '') ? '/' : p.join('');
      }
    } else {
      parts.path = null;
    }

    var file = absParts.path.substring(ls+1);
    if( file == parts.path && parts.fragment ) {
      parts.path = null;
    }

    if( (!parts.path || parts.path == '') && !parts.fragment ) {
      parts.path = file.empty() ? '/' : file;
    }  

    return Object.toURL(parts);
  }

  function toAbsoluteURL(absolute) {
    if( !absolute || this == '' ) return this;
    var parts = parseURL.call(this), absParts = parseURL.call(absolute);
    if( absParts == {} || parts.scheme || parts.domain || parts.userInfo || parts.port ) return this;

    parts.scheme = absParts.scheme;
    parts.userInfo = absParts.userInfo;
    parts.domain = absParts.domain;
    parts.port = absParts.port;

    if(parts.path.startsWith('/')) {
      return Object.toURL(parts);
    }

    var basePath = absParts.path,
        path = parts.path, s;

    if( path == '' ) {
      parts.path = basePath;
    } else {
      basePath = basePath.substring(0,basePath.lastIndexOf('/')).split('/');
      path = path.split('/');

      while((s = path.shift()) == '..') basePath.pop();
      basePath.push(s);
      Array.prototype.push.apply(basePath,path);

      parts.path = basePath.join('/');
    }

    return Object.toURL(parts);
  }

  return {
    parseURL: parseURL,
    urlScheme: urlScheme,
    urlUserInfo: urlUserInfo,
    urlDomain: urlDomain,
    urlPort: urlPort,
    urlPath: urlPath,
    urlQueryString: urlQueryString,
    urlFragment: urlFragment,
    toRelativeURL: toRelativeURL,
    toAbsoluteURL: toAbsoluteURL
  };
})());
