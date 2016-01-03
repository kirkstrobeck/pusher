/* global $, make_glif */

(function (window, $, make_glif) {
  'use strict';

  window.pusher = window.pusher || {};
  window.pusher.render = render;

  return;

  function render (next) {
    var i = 0;
    $('[data-pusher]').each(function () {
      i++;
      var $this = $(this);
      $this.attr('src', createGif(
        $this.attr('data-width'),
        $this.attr('data-height')
      ));
    });
    next(i);
  }

  // http://stackoverflow.com/a/4652513/537998
  function reduceFraction (numerator, denominator) {
    var gcd = function gcd (a, b) {
      return b ? gcd(b, a % b) : a;
    };
    gcd = gcd(numerator, denominator);
    return [numerator / gcd, denominator / gcd];
  }

  function createGif (width, height) {
    width = parseInt(width, 10);
    height = parseInt(height, 10);
    var reduced = reduceFraction(width, height);
    width = reduced[0];
    height = reduced[1];
    var pixels = [width * height];
    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        pixels[x + y * width] = 0;
      }
    }
    return make_glif(width, height, pixels, [0, 0, 0]);
  }
})(window, $, make_glif);
