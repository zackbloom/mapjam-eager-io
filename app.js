(function(){

  console.log('init');

  // We check for features which are not universally supported, and don't try to
  // show the app if it would error.
  if (!window.addEventListener) return;

  var options, ready, el;

  options = INSTALL_OPTIONS;

  ready = function(fn) {
    console.log("READY");
    if (document.readyState != 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  };

  ready(function(){
    console.log("DFUNC");
    el = Eager.createElement(options.element);
    var params = {
      app_url: '//mapjam.com/',
      cdn_url: '//mapjamjson.global.ssl.fastly.net/',
      map_id: options.map,
      container: 'mapjam-1',
      domain: 'mapjam.com',
      disableClusteringAtZoom: 1
    };
    if (options.zoom) {
      params.zoom = Math.max(Math.min(options.zoom, 18), 1);
    }
    if (options.sharing_visible) {
      params.sharing_visible = !options.sharing_visible;
    }
    function validNum(val) {
      return val !== null && val !== undefined && !isNaN(val);
    }
    if (validNum(options.lat) && validNum(options.lng)) {
      params.map_lat_lng = options.lng + ',' + options.lat;
    }
    var parts = [];
    for (var i in params) {
      if (params.hasOwnProperty(i)) {
        parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(params[i]));
      }
    }
    var qs = parts.join("&");
    console.log('qs: ' + qs);
    var style =  '<style>' +
        '.mapjam-iframe {' +
        'position: relative;' +
        'width: 100%;' +
        'height: 0;' +
        'padding-bottom: 80%;' +
        '}' +
        '.eager-google-map {' +
        'position: absolute;' +
        'top: 0;' +
        'height: 100%;' +
        'left: 0;' +
        'width: 100%;' +
        'background: #e5e3df;' +
        '}' +
        '</style>';
    var ifr = '<div><h1>TEST</h1><iframe class="mapjam-iframe" frameborder="0" id="mapjam-iframe" src="//embeds.mapjam.com/v2/map-embed.html?' + qs + '" style="width: 100%;height:100px;padding-bottom:' + 80 + '%"></iframe></div>';
    el.innerHTML = ifr;
  });

})();