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

describe('URLs', function() {

  it('can be parse URL', function() {
    expect('http://user:pass@domain.com:8080/dir1/dir2/file.html?query=value&param=args#anchor'.parseURL()).toEqual(
      {
        scheme: 'http',
        userInfo: 'user:pass',
        domain: 'domain.com',
        port: '8080',
        path: '/dir1/dir2/file.html',
        queryString: 'query=value&param=args',
        fragment: 'anchor'
      });
    expect('http://domain.com/'.parseURL()).toEqual(
      {
        scheme: 'http',
        domain: 'domain.com',
        path: '/'
      });
    expect('https://domain.com/dir1/file.html?query=value'.parseURL()).toEqual(
      {
        scheme: 'https',
        domain: 'domain.com',
        path: '/dir1/file.html',
        queryString: 'query=value'
      });
    expect('https://domain.com/file.html#anchor'.parseURL()).toEqual(
      {
        scheme: 'https',
        domain: 'domain.com',
        path: '/file.html',
        fragment: 'anchor'
      });
    expect('file.html#anchor'.parseURL()).toEqual(
      {
        path: 'file.html',
        fragment: 'anchor'
      });
    expect('/file.html?query'.parseURL()).toEqual(
      {
        path: '/file.html',
        queryString: 'query'
      });
    expect('file'.parseURL()).toEqual(
      {
        path: 'file'
      });
    expect('/'.parseURL()).toEqual(
      {
        path: '/'
      });
    expect(''.parseURL()).toEqual(
     {});
  });

  it('can retreive URL parts individually', function() {
    expect('http://user:pass@domain.com:8080/dir1/dir2/file.html?query=value&param=args#anchor'.urlScheme()).toEqual('http');
    expect('http://user:pass@domain.com:8080/dir1/dir2/file.html?query=value&param=args#anchor'.urlUserInfo()).toEqual('user:pass');
    expect('http://user:pass@domain.com:8080/dir1/dir2/file.html?query=value&param=args#anchor'.urlDomain()).toEqual('domain.com');
    expect('http://user:pass@domain.com:8080/dir1/dir2/file.html?query=value&param=args#anchor'.urlPort()).toEqual('8080');
    expect('http://user:pass@domain.com:8080/dir1/dir2/file.html?query=value&param=args#anchor'.urlPath()).toEqual('/dir1/dir2/file.html');
    expect('http://user:pass@domain.com:8080/dir1/dir2/file.html?query=value&param=args#anchor'.urlQueryString()).toEqual('query=value&param=args');
    expect('http://user:pass@domain.com:8080/dir1/dir2/file.html?query=value&param=args#anchor'.urlFragment()).toEqual('anchor');
  });

  it('can compose URLs from parts', function() {
    expect(
      Object.toURL({
        scheme: 'http',
        userInfo: 'user:pass',
        domain: 'domain.com',
        port: '8080',
        path: '/dir1/dir2/file.html',
        queryString: 'query=value&param=args',
        fragment: 'anchor'
      })).toEqual('http://user:pass@domain.com:8080/dir1/dir2/file.html?query=value&param=args#anchor');
    expect(
      Object.toURL({
        scheme: 'http',
        domain: 'domain.com',
        path: '/'
      })).toEqual('http://domain.com/');
    expect(
      Object.toURL({
        scheme: 'https',
        domain: 'domain.com',
        path: '/dir1/file.html',
        queryString: 'query=value'
      })).toEqual('https://domain.com/dir1/file.html?query=value');
    expect(
      Object.toURL({
        scheme: 'https',
        domain: 'domain.com',
        path: '/file.html',
        fragment: 'anchor'
      })).toEqual('https://domain.com/file.html#anchor');
    expect(
      Object.toURL({
        path: 'file.html',
        fragment: 'anchor'
      })).toEqual('file.html#anchor');
    expect(
      Object.toURL({
        path: '/file.html',
        queryString: 'query'
      })).toEqual('/file.html?query');
    expect(
      Object.toURL({
        path: 'file'
      })).toEqual('file');
    expect(
      Object.toURL({
        path: '/'
      })).toEqual('/');
    expect(Object.toURL({})).toEqual('');
  });

  it('can convert absolute URL to relative', function() {
    expect('http://domain.com/dir1/dir2/file.html'.toRelativeURL('http://domain.com/dir1/file.html')).toEqual('dir2/file.html')
    expect('http://domain.com/dir1/file2.html'.toRelativeURL('http://domain.com/dir1/file1.html')).toEqual('file2.html')
    expect('http://domain.com/dir2/file.html'.toRelativeURL('http://domain.com/dir1/file.html')).toEqual('../dir2/file.html')
    expect('http://domain.com/dir2/file.html'.toRelativeURL('http://domain.com/dir1/dir3/file.html')).toEqual('../../dir2/file.html')
    expect('http://domain.com/dir1/dir2/file.html'.toRelativeURL('http://domain.com/dir1/dir3/file.html')).toEqual('../dir2/file.html')
    expect('http://domain.com/dir1/file.html'.toRelativeURL('http://domain.com/dir1/file.html')).toEqual('file.html')
    expect('http://domain.com/dir1/file.html#anchor'.toRelativeURL('http://domain.com/dir1/file.html')).toEqual('#anchor')

    expect('http://domain.com/dir1/dir2/file.html'.toRelativeURL('http://domain.com/dir1/')).toEqual('dir2/file.html')
    expect('http://domain.com/dir1/file2.html'.toRelativeURL('http://domain.com/dir1/')).toEqual('file2.html')
    expect('http://domain.com/dir2/file.html'.toRelativeURL('http://domain.com/dir1/')).toEqual('../dir2/file.html')
    expect('http://domain.com/dir2/file.html'.toRelativeURL('http://domain.com/dir1/dir3/')).toEqual('../../dir2/file.html')
    expect('http://domain.com/dir1/dir2/file.html'.toRelativeURL('http://domain.com/dir1/dir3/')).toEqual('../dir2/file.html')
    expect('http://domain.com/dir1/file.html'.toRelativeURL('http://domain.com/dir1/')).toEqual('file.html')
    expect('http://domain.com/dir1/file.html#anchor'.toRelativeURL('http://domain.com/dir1/')).toEqual('file.html#anchor')

    expect('/dir1/dir2/file.html'.toRelativeURL('http://domain.com/dir1/file.html')).toEqual('dir2/file.html')
    expect('/dir1/file2.html'.toRelativeURL('http://domain.com/dir1/file1.html')).toEqual('file2.html')
    expect('/dir2/file.html'.toRelativeURL('http://domain.com/dir1/file.html')).toEqual('../dir2/file.html')
    expect('/dir2/file.html'.toRelativeURL('http://domain.com/dir1/dir3/file.html')).toEqual('../../dir2/file.html')
    expect('/dir1/dir2/file.html'.toRelativeURL('http://domain.com/dir1/dir3/file.html')).toEqual('../dir2/file.html')
    expect('/dir1/file.html'.toRelativeURL('http://domain.com/dir1/file.html')).toEqual('file.html')
    expect('/dir1/file.html#anchor'.toRelativeURL('http://domain.com/dir1/file.html')).toEqual('#anchor')

    expect('dir1/dir2/file.html'.toRelativeURL('http://domain.com/dir1/file.html')).toEqual('dir1/dir2/file.html')
    expect('dir1/file2.html'.toRelativeURL('http://domain.com/dir1/file1.html')).toEqual('dir1/file2.html')
    expect('dir2/file.html'.toRelativeURL('http://domain.com/dir1/file.html')).toEqual('dir2/file.html')
    expect('dir2/file.html'.toRelativeURL('http://domain.com/dir1/dir3/file.html')).toEqual('dir2/file.html')
    expect('dir1/dir2/file.html'.toRelativeURL('http://domain.com/dir1/dir3/file.html')).toEqual('dir1/dir2/file.html')
    expect('dir1/file.html'.toRelativeURL('http://domain.com/dir1/file.html')).toEqual('dir1/file.html')
    expect('dir1/file.html#anchor'.toRelativeURL('http://domain.com/dir1/file.html')).toEqual('dir1/file.html#anchor')
    expect('file.html'.toRelativeURL('http://domain.com/dir1/file.html')).toEqual('file.html')
    expect('file.html#anchor'.toRelativeURL('http://domain.com/dir1/file.html')).toEqual('#anchor')

    expect('https://domain.com/dir1/file.html'.toRelativeURL('http://domain.com/dir1/file.html')).toEqual('https://domain.com/dir1/file.html')
    expect('http://otherdomain.com/dir1/file.html'.toRelativeURL('http://domain.com/dir1/file.html')).toEqual('http://otherdomain.com/dir1/file.html')
    expect('http://domain.com:8080/dir1/file.html'.toRelativeURL('http://domain.com/dir1/file.html')).toEqual('http://domain.com:8080/dir1/file.html')
    expect('http://user@domain.com/dir1/file.html'.toRelativeURL('http://domain.com/dir1/file.html')).toEqual('http://user@domain.com/dir1/file.html')
  });

  it('can convert relative URL to absolute', function() {
    expect('/dir1/dir2/file.html'.toAbsoluteURL('http://domain.com/dir1/file.html')).toEqual('http://domain.com/dir1/dir2/file.html')
    expect('/dir1/file2.html'.toAbsoluteURL('http://domain.com/dir1/file1.html')).toEqual('http://domain.com/dir1/file2.html')
    expect('/dir2/file.html'.toAbsoluteURL('http://domain.com/dir1/file.html')).toEqual('http://domain.com/dir2/file.html')
    expect('/dir2/file.html'.toAbsoluteURL('http://domain.com/dir1/dir3/file.html')).toEqual('http://domain.com/dir2/file.html')
    expect('/dir1/dir2/file.html'.toAbsoluteURL('http://domain.com/dir1/dir3/file.html')).toEqual('http://domain.com/dir1/dir2/file.html')
    expect('/dir1/file.html'.toAbsoluteURL('http://domain.com/dir1/file.html')).toEqual('http://domain.com/dir1/file.html')
    expect('/dir1/file.html#anchor'.toAbsoluteURL('http://domain.com/dir1/file.html')).toEqual('http://domain.com/dir1/file.html#anchor')

    expect('dir1/dir2/file.html'.toAbsoluteURL('http://domain.com/dir1/file.html')).toEqual('http://domain.com/dir1/dir1/dir2/file.html')
    expect('dir1/file2.html'.toAbsoluteURL('http://domain.com/dir1/file1.html')).toEqual('http://domain.com/dir1/dir1/file2.html')
    expect('dir2/file.html'.toAbsoluteURL('http://domain.com/dir1/file.html')).toEqual('http://domain.com/dir1/dir2/file.html')
    expect('dir2/file.html'.toAbsoluteURL('http://domain.com/dir1/dir3/file.html')).toEqual('http://domain.com/dir1/dir3/dir2/file.html')
    expect('dir1/dir2/file.html'.toAbsoluteURL('http://domain.com/dir1/dir3/file.html')).toEqual('http://domain.com/dir1/dir3/dir1/dir2/file.html')
    expect('dir1/file.html'.toAbsoluteURL('http://domain.com/dir1/file.html')).toEqual('http://domain.com/dir1/dir1/file.html')
    expect('dir1/file.html#anchor'.toAbsoluteURL('http://domain.com/dir1/file.html')).toEqual('http://domain.com/dir1/dir1/file.html#anchor')
    expect('file.html'.toAbsoluteURL('http://domain.com/dir1/file.html')).toEqual('http://domain.com/dir1/file.html')
    expect('file.html#anchor'.toAbsoluteURL('http://domain.com/dir1/file.html')).toEqual('http://domain.com/dir1/file.html#anchor')

    expect('https://domain.com/dir1/file.html'.toAbsoluteURL('http://domain.com/dir1/file.html')).toEqual('https://domain.com/dir1/file.html')
    expect('http://otherdomain.com/dir1/file.html'.toAbsoluteURL('http://domain.com/dir1/file.html')).toEqual('http://otherdomain.com/dir1/file.html')
    expect('http://domain.com:8080/dir1/file.html'.toAbsoluteURL('http://domain.com/dir1/file.html')).toEqual('http://domain.com:8080/dir1/file.html')
    expect('http://user@domain.com/dir1/file.html'.toAbsoluteURL('http://domain.com/dir1/file.html')).toEqual('http://user@domain.com/dir1/file.html')
  });

});
