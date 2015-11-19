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

  var update = function(){
    el = Eager.createElement(options.element, el);

    var map = options.map || 'world';

    var matches = map.match(mapRegex);
    if (matches) {
      map = matches[1];
    }

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

    var iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder', 0);
    iframe.src = '//embeds.mapjam.com/v2/map-embed.html?' + qs;

    iframe.style.position = 'absolute';
    iframe.style.height = '100%';
    iframe.style.width = '100%';
    iframe.style.top = 0;
    iframe.style.left = 0;

    el.style.display = 'block';
    el.style.position = 'relative';
    el.style.width = '100%';
    el.style.paddingBottom = options.aspectRatio + '%';

    el.appendChild(iframe);
  };

  ready(update);

  var setOptions = function(opts){
    options = opts;

    update();
  };

  window.EagerMapJam = {
    setOptions: setOptions
  }

})();
