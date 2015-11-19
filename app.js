(function(){

  var mapRegex = /mapjam.com\/([\w\-]*)/i

  // We check for features which are not universally supported, and don't try to
  // show the app if it would error.
  if (!window.addEventListener) return;

  var options, ready, el;

  options = INSTALL_OPTIONS;

  ready = function(fn) {
    if (document.readyState != 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  };

  var map = options.map || 'world';

  var matches = map.match(mapRegex);
  if (matches) {
    map = matches[1];
  }

  ready(function(){
    el = Eager.createElement(options.element);

    var params = {
      app_url: '//mapjam.com/',
      cdn_url: '//mapjamjson.global.ssl.fastly.net/',
      map_id: map,
      container: 'mapjam-1',
      domain: 'mapjam.com',
      disableClusteringAtZoom: 1,
      sharing_visible: options.sharingVisible
    };

    if (options.showCustomZoom && options.zoom) {
      params.zoom = options.zoom;
    }

    if (options.showCustomLocation) {
      params.map_lat_lng = options.location.lat + ',' + options.location.lng;
    }

    var parts = [];
    for (var i in params) {
      if (params.hasOwnProperty(i)) {
        parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(params[i]));
      }
    }

    var qs = parts.join("&");
    var style =  '<style>' +
        '.mapjam-holder {' +
        'position: relative;' +
        'width: 100%;' +
        'padding-bottom: ' + options.aspectRatio + '%;' +
        '}' +
        '.mapjam-iframe {' +
        'position: absolute;' +
        'top: 0;' +
        'height: 100%;' +
        'left: 0;' +
        'width: 100%;' +
        '}' +
        '</style>';

    var ifr = '<iframe class="mapjam-iframe" frameborder="0" id="mapjam-iframe" src="//embeds.mapjam.com/v2/map-embed.html?' + qs + '" style="width:100%;height:100%;"></iframe>';
    var holder = '<div class="mapjam-holder">' + style + ifr + '</div>';

    el.innerHTML = holder;
  });

})();
