/*! pusher-gif (v1.0.4) - Copyright: 2013, Nathan Walker <nathan.walker@infowrap.com>,Kirk Strobeck <kirk.strobeck@infowrap.com> MIT */
// glif, a client-side image generator in javascript
// Copyright (C) 2005 Jeff Epler

// This library is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 2.1 of the License, or (at your option) any later version.

// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.

// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

// The data: URL scheme is specified in rfc2397.
// My understanding of the GIF format is based on reading various documents
// and credit for the no-lzw way of writing gifs comes via libungif.

function base64Pusher(s) {
    var ch =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var c1, c2, c3, e1, e2, e3, e4;
    var l = s.length;
    var i = 0;
    var r = "";

    do {
        c1 = s.charCodeAt(i);
        e1 = c1 >> 2;
        c2 = s.charCodeAt(i+1);
        e2 = ((c1 & 3) << 4) | (c2 >> 4);
        c3 = s.charCodeAt(i+2);
        if (l < i+2) { e3 = 64; } else { e3 = ((c2 & 0xf) << 2) | (c3 >> 6); }
        if (l < i+3) { e4 = 64; } else { e4 = c3 & 0x3f; }
        r += ch.charAt(e1) + ch.charAt(e2) + ch.charAt(e3) + ch.charAt(e4);
    } while ((i += 3) < l);

    return r;
}

function bitstream() {
    this.bit = 1;
    this.byte_ = 0;
    this.data = "";

    this.write_bit = bitstream_write_bit;
    this.get = bitstream_get;
}

function bitstream_write_bit(b) {
    if(b) this.byte_ |= this.bit;
    this.bit <<= 1;
    if(this.bit == 256) {
        this.bit = 1;
        this.data += String.fromCharCode(this.byte_);
        this.byte_ = 0;
    }
}
function bitstream_get() {
    var result = "";
    var data = this.data;
    if(this.bit != 1) { data += String.fromCharCode(this.byte_); }
    for(i=0; i<data.length + 1; i+=255) {
        chunklen = data.length - i; if(chunklen < 0) chunklen = 0;
        if(chunklen > 255) chunklen=255;
        result += String.fromCharCode(chunklen) + data.substring(i,i+255);
    }
    return result + "\0"
}

function make_glif(w,h,d,fr,fg,fb) {
    var r = String.fromCharCode(w%256) + String.fromCharCode(w/256) + String.fromCharCode(h%256) + String.fromCharCode(h/256)
    gif = "GIF89a" + r + "\xf0\0\0\xff\xff\xff" + String.fromCharCode(fr) + String.fromCharCode(fg) + String.fromCharCode(fb) + "\x21\xf9\4\1\0\0\0\0,\0\0\0\0" + r + "\0\2";

    var b = new bitstream();
    for(y=0; y<h; y++) {
        for(x=0; x<w; x++) {
            b.write_bit(d[x+w*y]); b.write_bit(0); b.write_bit(0);
            b.write_bit(0); b.write_bit(0); b.write_bit(1);
        }
    }
    gif += b.get() + ";"

    return "data:image/gif;base64," + base64Pusher(gif);
}

angular.module("pusher-gif", []).factory("pusherGifService", function() {
  var api;
  api = {};
  api.make = function(width, height) {
    var area, index, pixels, _i;
    area = Math.floor(width * height);
    pixels = new Array(area);
    for (index = _i = 1; _i < area; index = _i += 1) {
      pixels[_i] = 0;
    }
    return make_glif(width, height, pixels);
  };
  return api;
}).directive("pusherGif", [
  "pusherGifService", function(pusherGifService) {
    return {
      restrict: "A",
      scope: {
        calcWidth: '@',
        calcHeight: '@',
        constrainWidth: '@'
      },
      compile: function(tElem, tAttrs) {
        var height, width;
        if (tAttrs.width && tAttrs.height) {
          width = +tAttrs.width;
          height = +tAttrs.height;
          tElem.attr('src', pusherGifService.make(width, height));
        }
        return function(scope, element, attrs) {
          if (scope.calcWidth && scope.calcHeight) {
            if (scope.constrainWidth) {
              width = +scope.constrainWidth;
              height = (+scope.calcHeight / +scope.calcWidth) * +scope.constrainWidth;
            } else {
              width = +scope.calcWidth;
              height = +scope.calcHeight;
            }
            return element.attr('src', pusherGifService.make(width, height));
          }
        };
      }
    };
  }
]);
